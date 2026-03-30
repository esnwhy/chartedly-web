"""
AI Category Quality Gate — Runs after every product fetch.

For EACH product, this script:
1. Reads the product name (granular level)
2. Checks: does this product belong in Chartedly AT ALL?
3. If yes: is it in the RIGHT category > subcategory > type?
4. If no: removes it

Uses Claude API in batches for efficiency.
This should run as part of the weekly pipeline, AFTER ai-enrich and BEFORE sync.
"""

import json, glob, os, time, urllib.request, sys

API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
if not API_KEY:
    # Try reading from .env
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
    if os.path.exists(env_path):
        for line in open(env_path):
            if line.startswith("ANTHROPIC_API_KEY="):
                API_KEY = line.strip().split("=", 1)[1]
                break

if not API_KEY:
    print("ERROR: No ANTHROPIC_API_KEY found")
    sys.exit(1)

PRODUCTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "content", "products")

APPROVED_CATEGORIES = """
APPROVED CATEGORIES (products MUST fit one of these):
- Beauty > Skincare > (Sunscreen, Moisturizer, Serum, Cleansing Oil, Toner, Essence, Cream, Face Wash, Face Mask, Eye Cream)
- Beauty > Cosmetics > (Foundation, Powder, Lipstick, Eyelash, Nail, Makeup Remover, BB Cream, Primer, Mascara, Eyeshadow, Blush)
- Beauty > Haircare > (Shampoo, Conditioner, Hair Oil, Hair Brush, Hair Treatment, Hair Growth, Hair Dryer, Hair Iron, Scalp Care)
- Beauty > Tools > (Facial Device, Beauty Device, Brush, Mirror, EMS Device)
- Health > Supplements > (Vitamin, Protein, Diet, Collagen, NMN, Probiotics)
- Health > OTC Medicine > (Pain Relief, Cold Medicine, Stomach Medicine, Eye Drops, Allergy, Motion Sickness, Throat)
- Health > Wellness > (Massage, Sleep, Aromatherapy, Bath Salts)
- Travel & Connectivity > SIM & WiFi > (SIM Card, eSIM, Pocket WiFi, Mobile Router)
- Kitchen > Knives > (Kitchen Knife, Chef Knife, Santoku, Nakiri, Petty Knife, Bread Knife, Knife Set, Sharpening Stone)
- Food & Drink > Snacks & Sweets > (Chocolate, Candy, Rice Crackers, Wagashi, Mochi, Cookies, KitKat, Pocky, Chips)
- Food & Drink > Noodles & Ramen > (Instant Ramen, Ramen, Soba, Udon, Yakisoba)
- Food & Drink > Tea & Matcha > (Green Tea, Matcha, Hojicha, Sencha, Tea Set, Tea Bags)
- Food & Drink > Coffee > (Coffee Beans, Drip Coffee, Instant Coffee, Cold Brew)
- Food & Drink > Whisky & Sake > (Whisky, Sake, Shochu, Umeshu, Japanese Gin)
- Food & Drink > Beverages > (Water, Juice, Soda, Energy Drink, Non-Alcoholic Beer)
- Food & Drink > Seasonings > (Soy Sauce, Miso, Dashi, Curry Roux, Furikake, Wasabi, Mirin, Rice Vinegar, Ponzu)
- Electronics > Kitchen Appliances > (Rice Cooker, Electric Kettle, Microwave, Air Fryer, Blender, Water Filter, Toaster, Coffee Maker, Hot Plate, Bread Machine)
- Electronics > Home Appliances > (Air Purifier, Vacuum, Fan, Humidifier, Dehumidifier, Robot Vacuum)
- Electronics > Gadgets > (Earphones, Portable Fan, Phone Charger, Power Bank)
- Anime & Manga > Figures & Collectibles > (Figure, Nendoroid, Scale Figure, Plush)
- Anime & Manga > Trading Cards > (Pokemon Cards, Yu-Gi-Oh, One Piece Cards, Card Sleeves)
- Stationery > Pens & Writing > (Ballpoint Pen, Fountain Pen, Mechanical Pencil, Marker, Brush Pen)
- Stationery > Notebooks > (Notebook, Journal, Planner, Memo Pad)
- Seasonal > Summer Cooling > (Cooling Sheet, Portable Fan, Cool Towel, Ice Pack)
- Baby & Kids > Baby Essentials > (Diapers, Baby Bottle, Baby Food, Stroller, Teether, Baby Wipes)
- Pet > Dog > (Dog Food, Dog Treats, Dog Toy, Dog Bed, Leash, Dog Shampoo)
- Pet > Cat > (Cat Food, Cat Litter, Cat Toy, Cat Bed, Scratching Post, Cat Treats)
- Home & Living > Cleaning > (Floor Cleaner, Mold Remover, Laundry Detergent, Dish Soap, Sponge)
- DIY & Tools > Tools > (Drill, Screwdriver Set, Wrench, Tape Measure, Level)

EXCLUDED (REMOVE these if found):
- Clothing, shoes, fashion accessories (watches, bags, wallets, belts)
- Car parts, automotive accessories, navigation kits
- Perfume, fragrance, cologne
- Furniture (sofas, tables, chairs)
- Craft supplies (yarn, crochet, knitting, sewing)
- Flowers, plants, bouquets
- Insurance, services, rentals
- Musical instruments
- Generic household textiles (curtains, rugs, carpets)
"""

def call_claude(products_batch):
    """Send batch to Claude for classification."""
    items = []
    for p in products_batch:
        name = p.get("name", p.get("name_en", ""))
        items.append({
            "slug": os.path.basename(p["_file"]).replace(".json", ""),
            "name": name[:80],
            "brand": p.get("brand", "")[:30],
            "current": f"{p.get('category','')} > {p.get('subcategory','')} > {p.get('type','')}",
        })

    prompt = f"""{APPROVED_CATEGORIES}

For each product below, decide:
1. KEEP — if it belongs in Chartedly. Verify the category/subcategory/type is correct.
2. REMOVE — if it doesn't belong (clothing, car parts, perfume, furniture, craft, etc.)
3. FIX — if it belongs but is in the wrong category.

Return ONLY a JSON array. Each item:
- {{"slug": "...", "action": "keep"}} — category is correct, no change needed
- {{"slug": "...", "action": "fix", "category": "...", "subcategory": "...", "type": "..."}} — fix the category
- {{"slug": "...", "action": "remove", "reason": "..."}} — doesn't belong

Products:
{json.dumps(items, ensure_ascii=False, indent=1)}

Return ONLY the JSON array, no other text."""

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

    # Parse JSON from response
    if text.startswith("["):
        return json.loads(text)
    elif "[" in text:
        return json.loads(text[text.index("["):text.rindex("]") + 1])
    return []


# ── Load all products ──
products = []
for f in sorted(glob.glob(os.path.join(PRODUCTS_DIR, "*.json"))):
    if "_template" in f:
        continue
    d = json.load(open(f, encoding="utf-8"))
    d["_file"] = f
    products.append(d)

print(f"AI Category Quality Gate")
print(f"========================")
print(f"Total products: {len(products)}")
print(f"Processing in batches of 25...\n")

removed_count = 0
fixed_count = 0
kept_count = 0
errors = 0
batch_size = 25

for i in range(0, len(products), batch_size):
    batch = products[i:i + batch_size]
    batch_num = i // batch_size + 1
    total_batches = (len(products) - 1) // batch_size + 1

    try:
        results = call_claude(batch)

        for r in results:
            slug = r.get("slug", "")
            action = r.get("action", "keep")
            fpath = os.path.join(PRODUCTS_DIR, f"{slug}.json")

            if not os.path.exists(fpath):
                continue

            if action == "remove":
                os.remove(fpath)
                removed_count += 1
                reason = r.get("reason", "doesn't belong")
                print(f"  REMOVE: {slug} — {reason}")

            elif action == "fix":
                d = json.load(open(fpath, encoding="utf-8"))
                old = f"{d.get('category','')}/{d.get('subcategory','')}/{d.get('type','')}"
                d["category"] = r.get("category", d.get("category", ""))
                d["subcategory"] = r.get("subcategory", d.get("subcategory", ""))
                d["type"] = r.get("type", d.get("type", ""))
                new = f"{d['category']}/{d['subcategory']}/{d['type']}"
                if old != new:
                    json.dump(d, open(fpath, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
                    fixed_count += 1
                    print(f"  FIX: {slug}: {old} -> {new}")
                else:
                    kept_count += 1
            else:
                kept_count += 1

        print(f"  Batch {batch_num}/{total_batches}: {len([r for r in results if r.get('action')=='keep'])} kept, {len([r for r in results if r.get('action')=='fix'])} fixed, {len([r for r in results if r.get('action')=='remove'])} removed")

    except Exception as e:
        errors += 1
        print(f"  Batch {batch_num}/{total_batches} ERROR: {str(e)[:80]}")

    time.sleep(1)  # Rate limit

print(f"\n{'='*50}")
print(f"AI Category Gate Summary")
print(f"{'='*50}")
print(f"  Kept:    {kept_count}")
print(f"  Fixed:   {fixed_count}")
print(f"  Removed: {removed_count}")
print(f"  Errors:  {errors}")
print(f"  Final:   {kept_count + fixed_count} products")
print(f"{'='*50}")
