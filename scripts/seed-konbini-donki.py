"""
Seed Chartedly with konbini & Don Quijote products from research doc.
Uses Claude API to generate scores, pros/cons, radar charts in batches.

Subcategories seeded:
  - Food & Drink > Snacks & Sweets (25-30 products)
  - Food & Drink > Beverages (15-20 products)
  - Food & Drink > Noodles & Ramen (10 products)
  - Food & Drink > Tea & Matcha (8-10 products)
  - Food & Drink > Coffee (8-10 products)
"""

import json, os, time, urllib.request, re, glob

# ---------------------------------------------------------------------------
# API Key
# ---------------------------------------------------------------------------
API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
if not API_KEY:
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
    if os.path.exists(env_path):
        for line in open(env_path):
            if line.startswith("ANTHROPIC_API_KEY="):
                API_KEY = line.strip().split("=", 1)[1]
                break

if not API_KEY:
    raise SystemExit("ERROR: No ANTHROPIC_API_KEY found in env or .env file")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.join(SCRIPT_DIR, "..")
PRODUCTS_DIR = os.path.join(PROJECT_DIR, "src", "content", "products")
DOCS_DIR = os.path.join(PROJECT_DIR, "docs")
RESEARCH_FILE = os.path.join(DOCS_DIR, "konbini-donki-products.md")

DATE_ADDED = "2026-03-31"

# ---------------------------------------------------------------------------
# Product definitions per subcategory (from research doc)
# ---------------------------------------------------------------------------
SNACKS_AND_SWEETS = [
    # KitKat flavors
    {"name": "KitKat Matcha", "brand": "Nestle Japan", "type": "Chocolate", "price": "¥350", "where": "Available at all convenience stores and Don Quijote"},
    {"name": "KitKat Strawberry", "brand": "Nestle Japan", "type": "Chocolate", "price": "¥350", "where": "Available at all convenience stores and Don Quijote"},
    {"name": "KitKat Sake", "brand": "Nestle Japan", "type": "Chocolate", "price": "¥400", "where": "Available at all convenience stores and Don Quijote"},
    {"name": "KitKat Hojicha", "brand": "Nestle Japan", "type": "Chocolate", "price": "¥350", "where": "Available at all convenience stores and Don Quijote"},
    {"name": "KitKat Wasabi", "brand": "Nestle Japan", "type": "Chocolate", "price": "¥400", "where": "Available at select convenience stores and Don Quijote"},
    {"name": "KitKat Sweet Potato", "brand": "Nestle Japan", "type": "Chocolate", "price": "¥400", "where": "Available at select convenience stores and Don Quijote"},
    {"name": "KitKat Variety Pack", "brand": "Nestle Japan", "type": "Chocolate Assortment", "price": "¥1,200", "where": "Available at Don Quijote and souvenir shops"},
    # Pocky
    {"name": "Pocky Chocolate", "brand": "Glico", "type": "Biscuit Sticks", "price": "¥180", "where": "Available at all convenience stores"},
    {"name": "Pocky Strawberry", "brand": "Glico", "type": "Biscuit Sticks", "price": "¥180", "where": "Available at all convenience stores"},
    {"name": "Pocky Matcha", "brand": "Glico", "type": "Biscuit Sticks", "price": "¥180", "where": "Available at all convenience stores"},
    {"name": "Pocky Almond Crush", "brand": "Glico", "type": "Biscuit Sticks", "price": "¥230", "where": "Available at all convenience stores"},
    # Calbee chips & snacks
    {"name": "Calbee Potato Chips Consomme", "brand": "Calbee", "type": "Potato Chips", "price": "¥180", "where": "Available at all convenience stores"},
    {"name": "Calbee Potato Chips Seaweed Salt", "brand": "Calbee", "type": "Potato Chips", "price": "¥180", "where": "Available at all convenience stores"},
    {"name": "Calbee Jagarico Salad", "brand": "Calbee", "type": "Potato Snack", "price": "¥170", "where": "Available at all convenience stores"},
    {"name": "Calbee Jagarico Cheese", "brand": "Calbee", "type": "Potato Snack", "price": "¥170", "where": "Available at all convenience stores"},
    {"name": "Calbee Jagabee Butter Soy Sauce", "brand": "Calbee", "type": "Potato Sticks", "price": "¥180", "where": "Available at all convenience stores"},
    # Hi-Chew
    {"name": "Hi-Chew Grape", "brand": "Morinaga", "type": "Chewy Candy", "price": "¥140", "where": "Available at all convenience stores"},
    {"name": "Hi-Chew Strawberry", "brand": "Morinaga", "type": "Chewy Candy", "price": "¥140", "where": "Available at all convenience stores"},
    {"name": "Hi-Chew Premium Muscat", "brand": "Morinaga", "type": "Chewy Candy", "price": "¥230", "where": "Available at all convenience stores"},
    # Others
    {"name": "Black Thunder", "brand": "Yuraku Seika", "type": "Chocolate Bar", "price": "¥40", "where": "Available at all convenience stores"},
    {"name": "Country Ma'am Vanilla", "brand": "Fujiya", "type": "Soft Cookie", "price": "¥250", "where": "Available at all convenience stores"},
    {"name": "Tokyo Banana", "brand": "Grapestone", "type": "Sponge Cake", "price": "¥1,200", "where": "Available at select convenience stores and train stations"},
    {"name": "Kinoko no Yama", "brand": "Meiji", "type": "Chocolate Biscuit", "price": "¥230", "where": "Available at all convenience stores"},
    {"name": "Takenoko no Sato", "brand": "Meiji", "type": "Chocolate Cookie", "price": "¥230", "where": "Available at all convenience stores"},
    {"name": "Umaibo Assorted Box", "brand": "Yaokin", "type": "Corn Puff Snack", "price": "¥400", "where": "Available at all convenience stores and Don Quijote"},
    {"name": "Kaki no Tane", "brand": "Kameda Seika", "type": "Rice Crackers", "price": "¥200", "where": "Available at all convenience stores"},
    {"name": "Meiji Almond Chocolate", "brand": "Meiji", "type": "Chocolate", "price": "¥250", "where": "Available at all convenience stores"},
    {"name": "Royce Nama Chocolate", "brand": "Royce", "type": "Fresh Chocolate", "price": "¥900", "where": "Available at Don Quijote and department stores"},
]

BEVERAGES = [
    # Non-Alcoholic
    {"name": "Calpis Original", "brand": "Asahi", "type": "Fermented Milk Drink", "price": "¥150", "where": "Available at all convenience stores"},
    {"name": "Calpis Soda", "brand": "Asahi", "type": "Carbonated Drink", "price": "¥150", "where": "Available at all convenience stores"},
    {"name": "Pocari Sweat", "brand": "Otsuka", "type": "Sports Drink", "price": "¥160", "where": "Available at all convenience stores"},
    {"name": "Melon Soda", "brand": "Various", "type": "Soda", "price": "¥150", "where": "Available at all convenience stores and vending machines"},
    {"name": "Ramune Marble Soda", "brand": "Various", "type": "Soda", "price": "¥200", "where": "Available at select convenience stores and Don Quijote"},
    {"name": "Royal Milk Tea", "brand": "Kirin", "type": "Milk Tea", "price": "¥180", "where": "Available at all convenience stores"},
    {"name": "Yakult 1000", "brand": "Yakult", "type": "Probiotic Drink", "price": "¥180", "where": "Available at all convenience stores"},
    {"name": "Mitsuya Cider", "brand": "Asahi", "type": "Soda", "price": "¥150", "where": "Available at all convenience stores"},
    {"name": "C.C. Lemon", "brand": "Suntory", "type": "Lemon Soda", "price": "¥150", "where": "Available at all convenience stores"},
    {"name": "Matcha Latte Bottled", "brand": "Various", "type": "Matcha Drink", "price": "¥250", "where": "Available at all convenience stores"},
    # Alcoholic
    {"name": "Strong Zero Double Lemon", "brand": "Suntory", "type": "Chuhai", "price": "¥180", "where": "Available at all convenience stores"},
    {"name": "Strong Zero Grapefruit", "brand": "Suntory", "type": "Chuhai", "price": "¥180", "where": "Available at all convenience stores"},
    {"name": "Asahi Super Dry", "brand": "Asahi", "type": "Beer", "price": "¥230", "where": "Available at all convenience stores"},
    {"name": "Suntory Premium Malt's", "brand": "Suntory", "type": "Beer", "price": "¥280", "where": "Available at all convenience stores"},
    {"name": "Kirin Ichiban Shibori", "brand": "Kirin", "type": "Beer", "price": "¥230", "where": "Available at all convenience stores"},
    {"name": "Horoyoi Peach", "brand": "Suntory", "type": "Chuhai", "price": "¥150", "where": "Available at all convenience stores"},
    {"name": "Highball Can Kakubin", "brand": "Suntory", "type": "Whisky Highball", "price": "¥230", "where": "Available at all convenience stores"},
]

NOODLES_AND_RAMEN = [
    {"name": "Cup Noodle Original", "brand": "Nissin", "type": "Instant Ramen", "price": "¥230", "where": "Available at all convenience stores"},
    {"name": "Cup Noodle Seafood", "brand": "Nissin", "type": "Instant Ramen", "price": "¥230", "where": "Available at all convenience stores"},
    {"name": "Cup Noodle Curry", "brand": "Nissin", "type": "Instant Ramen", "price": "¥230", "where": "Available at all convenience stores"},
    {"name": "Maruchan Seimen Shoyu", "brand": "Toyo Suisan", "type": "Instant Ramen", "price": "¥200", "where": "Available at all convenience stores and supermarkets"},
    {"name": "Maruchan Seimen Miso", "brand": "Toyo Suisan", "type": "Instant Ramen", "price": "¥200", "where": "Available at all convenience stores and supermarkets"},
    {"name": "Ichiran Instant Ramen", "brand": "Ichiran", "type": "Instant Ramen", "price": "¥600", "where": "Available at Don Quijote and specialty stores"},
    {"name": "Sapporo Ichiban Shio Ramen", "brand": "Sanyo Foods", "type": "Instant Ramen", "price": "¥180", "where": "Available at all convenience stores and supermarkets"},
    {"name": "Myojo Charumera Shoyu", "brand": "Myojo", "type": "Instant Ramen", "price": "¥180", "where": "Available at all convenience stores and supermarkets"},
    {"name": "Nissin Donbei Kitsune Udon", "brand": "Nissin", "type": "Instant Udon", "price": "¥220", "where": "Available at all convenience stores"},
    {"name": "Nissin Yakisoba UFO", "brand": "Nissin", "type": "Instant Yakisoba", "price": "¥220", "where": "Available at all convenience stores"},
]

TEA_AND_MATCHA = [
    {"name": "Ito En Oi Ocha Green Tea", "brand": "Ito En", "type": "Bottled Green Tea", "price": "¥150", "where": "Available at all convenience stores and vending machines"},
    {"name": "Suntory Iemon Green Tea", "brand": "Suntory", "type": "Bottled Green Tea", "price": "¥150", "where": "Available at all convenience stores"},
    {"name": "Coca-Cola Ayataka Green Tea", "brand": "Coca-Cola Japan", "type": "Bottled Green Tea", "price": "¥150", "where": "Available at all convenience stores"},
    {"name": "Ito En Matcha Powder", "brand": "Ito En", "type": "Matcha Powder", "price": "¥800", "where": "Available at supermarkets and Don Quijote"},
    {"name": "Ito En Hojicha Tea Bags", "brand": "Ito En", "type": "Tea Bags", "price": "¥400", "where": "Available at supermarkets and Don Quijote"},
    {"name": "Ito En Genmaicha Tea Bags", "brand": "Ito En", "type": "Tea Bags", "price": "¥400", "where": "Available at supermarkets and Don Quijote"},
    {"name": "Mugicha Barley Tea", "brand": "Ito En", "type": "Bottled Barley Tea", "price": "¥120", "where": "Available at all convenience stores and vending machines"},
    {"name": "Ippodo Matcha Ummon", "brand": "Ippodo", "type": "Ceremonial Matcha", "price": "¥1,800", "where": "Available at Ippodo shops and select department stores"},
    {"name": "Fukujuen Sencha", "brand": "Fukujuen", "type": "Loose Leaf Tea", "price": "¥1,200", "where": "Available at Fukujuen shops and select department stores"},
]

COFFEE = [
    {"name": "Boss Rainbow Mountain Blend", "brand": "Suntory", "type": "Canned Coffee", "price": "¥140", "where": "Available at all convenience stores and vending machines"},
    {"name": "Boss Black Coffee", "brand": "Suntory", "type": "Canned Coffee", "price": "¥140", "where": "Available at all convenience stores and vending machines"},
    {"name": "Georgia Emerald Mountain", "brand": "Coca-Cola Japan", "type": "Canned Coffee", "price": "¥140", "where": "Available at all convenience stores and vending machines"},
    {"name": "UCC Black Unsweetened Coffee", "brand": "UCC", "type": "Canned Coffee", "price": "¥140", "where": "Available at all convenience stores and vending machines"},
    {"name": "UCC Drip Coffee One Cup", "brand": "UCC", "type": "Drip Coffee", "price": "¥500", "where": "Available at supermarkets and Don Quijote"},
    {"name": "AGF Blendy Stick Cafe Au Lait", "brand": "AGF", "type": "Instant Coffee", "price": "¥400", "where": "Available at supermarkets and Don Quijote"},
    {"name": "Key Coffee Drip On Variety Pack", "brand": "Key Coffee", "type": "Drip Coffee", "price": "¥600", "where": "Available at supermarkets and Don Quijote"},
    {"name": "Hario V60 Dripper", "brand": "Hario", "type": "Pour-Over Dripper", "price": "¥600", "where": "Available at home goods stores and Don Quijote"},
]

# ---------------------------------------------------------------------------
# All batches
# ---------------------------------------------------------------------------
BATCHES = [
    {
        "category": "Food & Drink",
        "subcategory": "Snacks & Sweets",
        "products": SNACKS_AND_SWEETS,
    },
    {
        "category": "Food & Drink",
        "subcategory": "Beverages",
        "products": BEVERAGES,
    },
    {
        "category": "Food & Drink",
        "subcategory": "Noodles & Ramen",
        "products": NOODLES_AND_RAMEN,
    },
    {
        "category": "Food & Drink",
        "subcategory": "Tea & Matcha",
        "products": TEA_AND_MATCHA,
    },
    {
        "category": "Food & Drink",
        "subcategory": "Coffee",
        "products": COFFEE,
    },
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text[:60]


def existing_slugs():
    """Return set of existing product file slugs (without .json)."""
    slugs = set()
    for f in glob.glob(os.path.join(PRODUCTS_DIR, "*.json")):
        slugs.add(os.path.splitext(os.path.basename(f))[0])
    return slugs


def call_claude(batch_products, category, subcategory):
    """Call Claude API to enrich a batch of products with scores/pros/cons/radar."""
    product_list = "\n".join(
        f"- {p['name']} by {p['brand']} ({p['type']}, {p['price']}) — {p['where']}"
        for p in batch_products
    )

    prompt = f"""You are a product reviewer for Chartedly, a product comparison site helping foreign tourists shop in Japan.

Category: {category} > {subcategory}

Here are the products to score. For EACH product, return a JSON object.

Products:
{product_list}

For each product return a JSON object with these exact keys:
- "name": the exact product name I gave you (do not change it)
- "score": overall quality score 60-95 (be realistic — iconic popular items 85-92, decent items 72-82, niche items 65-78)
- "shortDescription": 1 tourist-friendly sentence (mention where to buy, e.g. "Available at all 7-Eleven stores" or "Found at Don Quijote")
- "pros": array of exactly 3 short pros (each under 15 words)
- "cons": array of exactly 2 short cons (each under 15 words)
- "radar": object with keys "quality", "value", "popularity", "ease", "innovation" — each 60-95

Return ONLY a JSON array. No markdown, no explanation, no code fences."""

    data = json.dumps({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 8000,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=data,
        headers={
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
    )

    resp = urllib.request.urlopen(req, timeout=120)
    result = json.loads(resp.read().decode())
    text = result["content"][0]["text"].strip()

    # Parse JSON from response (handle markdown code fences)
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

    if text.startswith("["):
        return json.loads(text)
    elif "[" in text:
        return json.loads(text[text.index("["):text.rindex("]") + 1])

    print(f"  WARNING: Could not parse Claude response")
    return []


def build_product_json(product_def, enrichment, category, subcategory):
    """Merge static product definition with Claude-enriched data."""
    name = product_def["name"]
    brand = product_def["brand"]
    search_term = f"{brand} {name}"

    return {
        "name": name,
        "name_en": name,
        "brand": brand,
        "image": "",
        "category": category,
        "subcategory": subcategory,
        "type": product_def.get("type", "Product"),
        "price": product_def.get("price", ""),
        "score": enrichment.get("score", 75),
        "rank": None,
        "badge": None,
        "buyUrl": f"https://www.amazon.co.jp/s?k={urllib.request.quote(search_term)}&tag=movemate04-22",
        "pros": enrichment.get("pros", ["Popular with tourists", "Widely available", "Great souvenir"]),
        "cons": enrichment.get("cons", ["Limited shelf life", "May be hard to find outside Japan"]),
        "specs": {},
        "shortDescription": enrichment.get("shortDescription", f"{name} by {brand}. {product_def.get('where', '')}"),
        "review": "",
        "comparisonSlug": "",
        "dateAdded": DATE_ADDED,
        "featured": False,
        "radar": enrichment.get("radar", {
            "quality": 75,
            "value": 75,
            "popularity": 75,
            "ease": 75,
            "innovation": 75,
        }),
        "retailers": {
            "amazon": f"https://www.amazon.co.jp/s?k={urllib.request.quote(search_term)}&tag=movemate04-22",
            "rakuten": f"https://search.rakuten.co.jp/search/mall/{urllib.request.quote(search_term)}/",
        },
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    if not os.path.isdir(PRODUCTS_DIR):
        raise SystemExit(f"ERROR: Products directory not found: {PRODUCTS_DIR}")

    existing = existing_slugs()
    total_created = 0
    total_skipped = 0

    for batch in BATCHES:
        category = batch["category"]
        subcategory = batch["subcategory"]
        products = batch["products"]

        print(f"\n{'=' * 60}")
        print(f"  {category} > {subcategory} ({len(products)} products)")
        print(f"{'=' * 60}")

        # Check which products need creation
        to_create = []
        for p in products:
            slug = slugify(f"{p['brand']} {p['name']}")
            if slug in existing:
                print(f"  SKIP (exists): {slug}")
                total_skipped += 1
            else:
                to_create.append(p)

        if not to_create:
            print(f"  -> All products already exist, skipping batch")
            continue

        # Call Claude API in sub-batches of 15 to stay within token limits
        CHUNK_SIZE = 15
        enrichments = {}

        for i in range(0, len(to_create), CHUNK_SIZE):
            chunk = to_create[i : i + CHUNK_SIZE]
            print(f"\n  Calling Claude API for {len(chunk)} products...")

            try:
                results = call_claude(chunk, category, subcategory)
                # Map results back by name
                for r in results:
                    enrichments[r.get("name", "")] = r
                print(f"  -> Got {len(results)} enrichments")
            except Exception as e:
                print(f"  ERROR calling Claude: {str(e)[:100]}")
                # Continue with defaults

            if i + CHUNK_SIZE < len(to_create):
                time.sleep(2)  # Rate limit between chunks

        # Write product files
        created = 0
        for p in to_create:
            slug = slugify(f"{p['brand']} {p['name']}")
            fpath = os.path.join(PRODUCTS_DIR, f"{slug}.json")

            # Double-check file doesn't exist
            if os.path.exists(fpath):
                print(f"  SKIP (file exists): {slug}")
                total_skipped += 1
                continue

            enrichment = enrichments.get(p["name"], {})
            product_json = build_product_json(p, enrichment, category, subcategory)

            with open(fpath, "w", encoding="utf-8") as f:
                json.dump(product_json, f, indent=2, ensure_ascii=False)

            created += 1
            existing.add(slug)
            print(f"  CREATED: {slug}")

        total_created += created
        print(f"\n  -> {created} new products created")

        # Pause between batches
        time.sleep(3)

    print(f"\n{'=' * 60}")
    print(f"  DONE: {total_created} created, {total_skipped} skipped")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
