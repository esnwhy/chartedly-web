"""Deep audit: find ALL products that don't belong in Chartedly's 25 approved categories."""
import json, glob, os, re

# ════════════════════════════════════════════════════════════
# APPROVED CATEGORIES (from ATLAS research)
# Only these should exist on the site
# ════════════════════════════════════════════════════════════
APPROVED = {
    # Tier 1: Core
    "Beauty > Skincare",
    "Beauty > Cosmetics",
    "Beauty > Haircare",
    "Beauty > Tools",
    "Health > Supplements",
    "Health > OTC Medicine",
    "Health > Wellness",
    "Travel & Connectivity > SIM & WiFi",
    "Kitchen > Knives",
    # Tier 2: Growth
    "Food & Drink > Snacks & Sweets",
    "Food & Drink > Noodles & Ramen",
    "Food & Drink > Tea & Matcha",
    "Food & Drink > Coffee",
    "Food & Drink > Whisky & Sake",
    "Food & Drink > Beverages",
    "Food & Drink > Seasonings",
    "Electronics > Kitchen Appliances",
    "Electronics > Home Appliances",
    "Electronics > Gadgets",
    "Anime & Manga > Figures & Collectibles",
    "Anime & Manga > Trading Cards",
    # Tier 3: Expansion
    "Stationery > Pens & Writing",
    "Stationery > Notebooks",
    "Seasonal > Summer Cooling",
    "Baby & Kids > Baby Essentials",
    "Pet > Dog",
    "Pet > Cat",
    "Home & Living > Cleaning",
    "DIY & Tools > Tools",
}

# ════════════════════════════════════════════════════════════
# JUNK PATTERNS — products that should NEVER be on the site
# ════════════════════════════════════════════════════════════
JUNK_PATTERNS = [
    # Clothing & fashion
    r"tracksuit|sneaker|loafer|pumps|boot|shoe|sandal|slipper",
    r"jacket|hoodie|pants|shirt|dress|skirt|coat|vest|cardigan|sweater",
    r"adidas|nike|under armour|puma|new balance|reebok|asics",
    r"swimsuit|bikini|leggings|tights|socks",
    # Cars & automotive
    r"car nav|car audio|tv kit|tv canceller|rear camera|engine starter",
    r"harness kit|dvd player|disc player|dash cam|dashcam|car stereo",
    r"toyota|honda|mazda|suzuki|subaru|nissan|daihatsu|mitsubishi|audi|bmw",
    r"wiper|brake pad|oil filter|spark plug|battery charger|car seat cover",
    r"oem.*mount|oem.*bracket|oem.*attachment",
    r"navigation.*kit|navi.*kit",
    # Watches (not smartwatches)
    r"casio.*watch|baby-g|g-shock|analog watch|quartz watch|solar watch",
    r"wave ceptor|wristwatch|dress watch|diver watch",
    # Craft supplies
    r"yarn|crochet|knitting|embroidery|bobbin|lace.*set",
    r"dollhouse|miniature kit|craft.*eye|craft.*wire",
    r"stitch marker|needle stopper|gauge ruler",
    # Flowers & plants
    r"potted flower|bouquet|arrangement.*flower|carnation.*pot|hydrangea",
    r"mothers day.*flower|flower.*gift",
    # Perfume/fragrance
    r"eau de toilette|eau de parfum|cologne|fragrance.*discovery",
    r"bvlgari|calvin klein|jo malone|jill stuart.*edt|imp.*fragrance",
    # Furniture
    r"sofa|dining table|bookshelf|wardrobe|cabinet",
    # WiFi rentals (not SIM cards)
    r"wifi.*rental|pocket wifi.*\d+day|wimax.*rental|\d+day.*wifi",
    # Insurance/services
    r"insurance|warranty|extended.*plan|service.*plan",
    # Generic household that's not cleaning
    r"curtain|carpet|rug|mat.*floor|cushion|pillow case",
    r"towel rack|toilet.*seat|bath.*mat",
    # Musical instruments
    r"guitar|piano|drum|violin|ukulele",
    # Bags & accessories
    r"backpack|tote bag|wallet|belt|necktie",
    # GPS trackers (not consumer product)
    r"gps tracker|gps.*children|tracking device",
]

products = []
for f in sorted(glob.glob(os.path.join("src/content/products", "*.json"))):
    if "_template" in f:
        continue
    d = json.load(open(f, encoding="utf-8"))
    d["_file"] = f
    products.append(d)

# ── Check each product ──
junk = []
wrong_cat = []
approved_counts = {}

for d in products:
    name = (d.get("name", "") + " " + d.get("name_en", "")).lower()
    typ = d.get("type", "").lower()
    cat = d.get("category", "")
    sub = d.get("subcategory", "")
    key = f"{cat} > {sub}"
    slug = os.path.basename(d["_file"])

    # Check junk patterns
    is_junk = False
    matched = ""
    for pattern in JUNK_PATTERNS:
        if re.search(pattern, name + " " + typ, re.IGNORECASE):
            is_junk = True
            matched = pattern[:40]
            break

    if is_junk:
        junk.append((slug, name[:50].strip(), matched))
    elif key not in APPROVED:
        wrong_cat.append((slug, name[:50].strip(), key))
    else:
        approved_counts[key] = approved_counts.get(key, 0) + 1

# ── Report ──
print(f"Total products: {len(products)}")
print(f"\n{'='*60}")
print(f"APPROVED products by category:")
print(f"{'='*60}")
for k, v in sorted(approved_counts.items()):
    print(f"  {k}: {v}")
print(f"  TOTAL APPROVED: {sum(approved_counts.values())}")

print(f"\n{'='*60}")
print(f"JUNK to REMOVE: {len(junk)}")
print(f"{'='*60}")
for slug, name, pattern in junk[:30]:
    print(f"  {slug}: {name} [{pattern}]")
if len(junk) > 30:
    print(f"  ... and {len(junk)-30} more")

print(f"\n{'='*60}")
print(f"WRONG CATEGORY (not in approved list): {len(wrong_cat)}")
print(f"{'='*60}")
cats_wrong = {}
for slug, name, key in wrong_cat:
    cats_wrong[key] = cats_wrong.get(key, 0) + 1
for k, v in sorted(cats_wrong.items()):
    print(f"  {k}: {v}")
    # Show examples
    examples = [(s, n) for s, n, c in wrong_cat if c == k][:3]
    for s, n in examples:
        print(f"    - {s}: {n}")
