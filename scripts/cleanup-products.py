"""Remove products that don't belong + merge duplicate categories."""
import json, glob, os, re

PRODUCTS_DIR = "src/content/products"

# Products to REMOVE: clothing, shoes, sportswear, car parts, craft supplies, flowers
REMOVE_PATTERNS = [
    # Clothing & shoes
    r"tracksuit|sneaker|loafer|pumps|boot|shoe|sandal|slipper",
    r"jacket|hoodie|pants|shirt|dress|skirt|coat|vest|cardigan",
    r"adidas|nike|under armour|puma|new balance",
    # Car accessories
    r"car nav|car audio|tv kit|tv canceller|rear camera|engine starter|harness kit",
    r"dvd player|disc player|dash cam|dashcam",
    r"toyota|honda|mazda|suzuki|subaru|nissan|daihatsu|mitsubishi",
    # Craft supplies
    r"yarn|crochet|knit|bobbin|lace.*set|embroidery",
    r"dollhouse|miniature kit",
    # Flowers/plants
    r"potted flower|bouquet|arrangement.*flower|carnation.*pot",
    # WiFi rentals (keep SIM cards but remove rentals)
    r"wifi.*rental|pocket wifi.*\d+day|wimax.*rental",
    # Generic clothing accessories
    r"insole|shoe.*care|belt|wallet|backpack|tote bag",
    # Perfume/fragrance (not core category)
    r"eau de toilette|eau de parfum|fragrance.*set|cologne",
    r"bvlgari|calvin klein|jo malone|jill stuart.*edt",
]

# Category merges
CATEGORY_MERGE = {
    "Baby": "Baby & Kids",
    "Food": "Food & Drink",
    "Home": "Home & Living",
}

removed = 0
merged = 0
total = 0

for f in sorted(glob.glob(os.path.join(PRODUCTS_DIR, "*.json"))):
    if "_template" in f:
        continue
    total += 1
    d = json.load(open(f, encoding="utf-8"))
    name = (d.get("name", "") + " " + d.get("name_en", "")).lower()
    slug = os.path.basename(f)

    # Check remove patterns
    should_remove = False
    for pattern in REMOVE_PATTERNS:
        if re.search(pattern, name, re.IGNORECASE):
            should_remove = True
            print(f"  REMOVE: {slug}: {name[:50].strip()} (matched: {pattern[:30]})")
            break

    if should_remove:
        os.remove(f)
        # Also remove image
        for ext in ["png", "jpg", "webp"]:
            img_path = os.path.join("public/images/products", slug.replace(".json", f".{ext}"))
            if os.path.exists(img_path):
                os.remove(img_path)
        removed += 1
        continue

    # Merge categories
    cat = d.get("category", "")
    if cat in CATEGORY_MERGE:
        d["category"] = CATEGORY_MERGE[cat]
        json.dump(d, open(f, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
        merged += 1

print(f"\nTotal: {total}")
print(f"Removed: {removed}")
print(f"Category merges: {merged}")
print(f"Remaining: {total - removed}")
