"""
Seed empty categories with real Japanese products using Claude API.
Instead of fetching from Rakuten (which returns random stuff),
ask Claude to generate the TOP products for each category.
"""
import json, os, time, urllib.request, glob, re

API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
if not API_KEY:
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
    if os.path.exists(env_path):
        for line in open(env_path):
            if line.startswith("ANTHROPIC_API_KEY="):
                API_KEY = line.strip().split("=", 1)[1]
                break

PRODUCTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "content", "products")

CATEGORIES_TO_SEED = [
    {
        "category": "Kitchen", "subcategory": "Knives",
        "prompt": "Top 10 most popular Japanese kitchen knives that foreigners buy. Include: Shun, Global, Tojiro, MAC, Misono, Kai. Mix of santoku, gyuto (chef), nakiri, petty, bread knife. Include price in JPY."
    },
    {
        "category": "Travel & Connectivity", "subcategory": "SIM & WiFi",
        "prompt": "Top 10 most popular SIM cards, eSIMs, and pocket WiFi options for tourists and new residents in Japan. Include: Sakura Mobile, IIJmio, Mobal, Ubigi eSIM, Japan Wireless, Rakuten Mobile, ahamo, LINEMO. Include price in JPY."
    },
    {
        "category": "Health", "subcategory": "OTC Medicine",
        "prompt": "Top 10 most popular Japanese OTC medicines that foreigners buy at drugstores. Include: EVE (pain), Pansiron (stomach), Ryukakusan (throat), Aneron (motion sickness), Salonpas (muscle), Loxonin, Bufferin, eye drops (Sante FX). Include price in JPY."
    },
    {
        "category": "Stationery", "subcategory": "Pens & Writing",
        "prompt": "Top 10 most popular Japanese pens and writing instruments. Include: Uni Jetstream, Pilot Kakuno, Pentel EnerGel, Zebra Sarasa, Tombow Mono, Uni Kuru Toga, Pilot Hi-Tec-C, Sakura Pigma. Include price in JPY."
    },
    {
        "category": "Stationery", "subcategory": "Notebooks",
        "prompt": "Top 8 most popular Japanese notebooks and stationery items. Include: Midori MD, Kokuyo Campus, Hobonichi Techo, Maruman Mnemosyne, Life Noble, Apica Premium. Include price in JPY."
    },
    {
        "category": "Anime & Manga", "subcategory": "Figures & Collectibles",
        "prompt": "Top 10 most popular anime figures and collectibles that tourists buy in Japan. Include: Nendoroid, figma, Gundam model kits (Gunpla), One Piece figures, Dragon Ball figures, Demon Slayer figures. Mix of brands: Good Smile Company, Bandai, Banpresto. Include price in JPY."
    },
    {
        "category": "Anime & Manga", "subcategory": "Trading Cards",
        "prompt": "Top 8 most popular trading card products in Japan. Include: Pokemon cards (booster box, starter deck), Yu-Gi-Oh, One Piece Card Game, Dragon Ball Super Card Game. Include price in JPY."
    },
    {
        "category": "Food & Drink", "subcategory": "Noodles & Ramen",
        "prompt": "Top 10 most popular Japanese instant ramen and noodles. Include: Nissin Cup Noodle, Maruchan Seimen, Ippudo, Ichiran (take-home), Sapporo Ichiban, Myojo Charumera, soba noodles, udon noodles. Include price in JPY."
    },
    {
        "category": "Food & Drink", "subcategory": "Tea & Matcha",
        "prompt": "Top 10 most popular Japanese tea and matcha products. Include: Ippodo matcha, Itoen Oi Ocha, Fukujuen, hojicha, sencha, genmaicha, matcha powder for drinking, tea bags. Include price in JPY."
    },
    {
        "category": "Food & Drink", "subcategory": "Coffee",
        "prompt": "Top 8 most popular Japanese coffee products. Include: Boss canned coffee, UCC drip coffee, Kalita pour-over kit, Hario V60, Blue Bottle Japan blend, AGF Blendy, Key Coffee. Include price in JPY."
    },
    {
        "category": "Food & Drink", "subcategory": "Seasonings",
        "prompt": "Top 10 most popular Japanese seasonings and condiments for cooking. Include: Kikkoman soy sauce, Marukome miso, Yamaki dashi, S&B curry roux, Nagatanien furikake, Mizkan rice vinegar, Otafuku sauce, wasabi, mirin. Include price in JPY."
    },
    {
        "category": "Seasonal", "subcategory": "Summer Cooling",
        "prompt": "Top 8 most popular Japanese summer cooling products. Include: Biore cooling body sheets, portable neck fan, cool towel, ice ring, Gatsby ice deodorant spray, cooling pillow pad. Include price in JPY."
    },
    {
        "category": "Home & Living", "subcategory": "Cleaning",
        "prompt": "Top 8 most popular Japanese cleaning products. Include: Kao Magiclean, Lion Look bathroom mold remover, Attack laundry detergent, Joy dish soap, Quickle Wiper, toilet cleaning tablets. Include price in JPY."
    },
    {
        "category": "DIY & Tools", "subcategory": "Tools",
        "prompt": "Top 5 most popular Japanese DIY tools and toolkits. Include: Vessel screwdriver set, Engineer pliers, Olfa cutter, SK11 tool set, Hozan precision tools. Include price in JPY."
    },
    {
        "category": "Electronics", "subcategory": "Gadgets",
        "prompt": "Top 8 most popular Japanese electronics gadgets foreigners buy. Include: Sony WF-1000XM5 earphones, Anker PowerCore, portable fan, USB charger, phone case Japan exclusive, power strip with USB. Include price in JPY."
    },
]

def call_claude(category_info):
    prompt = f"""Generate product data for Chartedly, a product comparison site for Japan.

Category: {category_info['category']} > {category_info['subcategory']}
Request: {category_info['prompt']}

For each product return a JSON object with:
- "name": clean English product name (short, no marketing text)
- "brand": brand name
- "type": specific product type (e.g., "Santoku Knife", "SIM Card", "Pain Relief")
- "price": price string like "¥1,200"
- "score": quality score 60-95 (be realistic, not everything is 90+)
- "shortDescription": 1 sentence describing the product for foreigners
- "pros": array of 3 pros
- "cons": array of 2 cons
- "radar": {{"quality": 60-95, "value": 60-95, "popularity": 60-95, "ease": 60-95, "innovation": 60-95}}

Return ONLY a JSON array of products. No other text."""

    data = json.dumps({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 4000,
        "messages": [{"role": "user", "content": prompt}]
    }).encode()

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=data,
        headers={
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
    )

    resp = urllib.request.urlopen(req, timeout=60)
    result = json.loads(resp.read().decode())
    text = result["content"][0]["text"].strip()

    if text.startswith("["):
        return json.loads(text)
    elif "[" in text:
        return json.loads(text[text.index("["):text.rindex("]") + 1])
    return []


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text[:60]


total_created = 0

for cat_info in CATEGORIES_TO_SEED:
    cat = cat_info["category"]
    sub = cat_info["subcategory"]
    print(f"\n{'='*50}")
    print(f"Seeding: {cat} > {sub}")
    print(f"{'='*50}")

    try:
        products = call_claude(cat_info)
        created = 0

        for p in products:
            slug = slugify(f"{p.get('brand', '')} {p.get('name', '')}")
            fpath = os.path.join(PRODUCTS_DIR, f"{slug}.json")

            if os.path.exists(fpath):
                print(f"  SKIP (exists): {slug}")
                continue

            product = {
                "name": p.get("name", ""),
                "name_en": p.get("name", ""),
                "brand": p.get("brand", ""),
                "category": cat,
                "subcategory": sub,
                "type": p.get("type", "Product"),
                "price": p.get("price", ""),
                "score": p.get("score", 75),
                "shortDescription": p.get("shortDescription", ""),
                "pros": p.get("pros", []),
                "cons": p.get("cons", []),
                "radar": p.get("radar", {"quality": 75, "value": 75, "popularity": 75, "ease": 75, "innovation": 75}),
                "image": "",
                "buyUrl": f"https://www.amazon.co.jp/s?k={urllib.request.quote(p.get('name', ''))}&tag=movemate04-22",
                "retailers": {
                    "amazon": f"https://www.amazon.co.jp/s?k={urllib.request.quote(p.get('brand', '') + ' ' + p.get('name', ''))}&tag=movemate04-22",
                    "rakuten": f"https://search.rakuten.co.jp/search/mall/{urllib.request.quote(p.get('brand', '') + ' ' + p.get('name', ''))}/",
                },
                "dateAdded": "2026-03-30",
                "featured": False,
            }

            json.dump(product, open(fpath, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
            created += 1
            print(f"  CREATED: {slug} ({p.get('brand', '')} - {p.get('name', '')[:40]})")

        total_created += created
        print(f"  -> {created} new products")

    except Exception as e:
        print(f"  ERROR: {str(e)[:80]}")

    time.sleep(2)

print(f"\n{'='*50}")
print(f"Total seeded: {total_created} new products")
print(f"{'='*50}")
