"""Final cleanup: remove all junk + fix remaining wrong categories."""
import json, glob, os, re

JUNK_PATTERNS = [
    r"tracksuit|sneaker|loafer|pumps|boot(?!h)|shoe|sandal|slipper",
    r"jacket|hoodie|pants|shirt|dress|skirt|coat(?!ing)|vest|cardigan|sweater",
    r"adidas|nike|under armour|puma|new balance|reebok|asics",
    r"swimsuit|bikini|leggings|tights",
    r"car nav|car audio|tv kit|tv canceller|rear camera|engine starter",
    r"harness kit|dvd player|disc player|dash cam|dashcam|car stereo",
    r"toyota|honda|mazda|suzuki|subaru|nissan|daihatsu|mitsubishi|audi|bmw",
    r"wiper|brake pad|oil filter|spark plug|battery charger|car seat cover",
    r"oem.*mount|oem.*bracket|oem.*attachment|parking.*monitor|power cable.*rd-dr",
    r"navigation.*kit|navi.*kit|carrozzeria|pioneer.*rd-dr",
    r"casio.*watch|baby-g|g-shock|analog watch|quartz watch|solar watch",
    r"wave ceptor|wristwatch|dress watch|diver watch|waveceptor",
    r"chanel.*watch|fieldwork.*watch|qq.*watch|premiere.*watch",
    r"yarn|crochet|knitting|embroidery|bobbin|lace.*set",
    r"dollhouse|miniature kit|craft.*eye|craft.*wire",
    r"potted flower|bouquet|arrangement.*flower|carnation.*pot|hydrangea",
    r"mothers day.*flower|flower.*gift",
    r"eau de toilette|eau de parfum|cologne|fragrance.*discovery|perfume.*\d+ml",
    r"bvlgari|calvin klein|jo malone|jill stuart.*edt|imp.*fragrance",
    r"dolce.*gabbana|lanvin.*edp|maison margiela|samurai.*fragrance|tamburins.*perfume",
    r"wifi.*rental|pocket wifi.*\d+day|wimax.*rental|\d+day.*wifi",
    r"curtain|carpet(?!.*cleaner)|rug(?!.*cleaner)|mat.*floor|cushion|pillow case",
    r"backpack|tote bag|wallet(?!.*cleaner)|belt(?!.*sander)|necktie",
    r"gps tracker|gps.*children|tracking device",
    r"randoseru|school bag",
    r"refrigerator mat|fridge mat",
    r"dog rug|pet rug",
]

# Category fixes for "Electronics > Kitchen" → "Electronics > Kitchen Appliances"
CATEGORY_FIXES = {
    "Electronics > Kitchen": ("Electronics", "Kitchen Appliances"),
    "Electronics > Personal Care": ("Beauty", "Haircare"),
}

removed = 0
fixed = 0

for f in sorted(glob.glob(os.path.join("src/content/products", "*.json"))):
    if "_template" in f:
        continue
    d = json.load(open(f, encoding="utf-8"))
    name = (d.get("name", "") + " " + d.get("name_en", "")).lower()
    typ = d.get("type", "").lower()
    cat = d.get("category", "")
    sub = d.get("subcategory", "")
    slug = os.path.basename(f)

    # Check junk
    is_junk = False
    for pattern in JUNK_PATTERNS:
        if re.search(pattern, name + " " + typ, re.IGNORECASE):
            is_junk = True
            break

    if is_junk:
        os.remove(f)
        removed += 1
        print(f"REMOVED: {slug}: {name[:50].strip()}")
        continue

    # Fix wrong category
    key = f"{cat} > {sub}"
    if key in CATEGORY_FIXES:
        new_cat, new_sub = CATEGORY_FIXES[key]
        d["category"] = new_cat
        d["subcategory"] = new_sub
        json.dump(d, open(f, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
        fixed += 1
        print(f"FIXED: {slug}: {key} -> {new_cat} > {new_sub}")

print(f"\nRemoved: {removed}")
print(f"Fixed: {fixed}")
