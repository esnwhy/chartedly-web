"""Check which approved categories have low or zero products."""
import json, glob

APPROVED = {
    "Beauty > Skincare": 20,
    "Beauty > Cosmetics": 15,
    "Beauty > Haircare": 15,
    "Beauty > Tools": 5,
    "Health > Supplements": 10,
    "Health > OTC Medicine": 10,
    "Health > Wellness": 5,
    "Travel & Connectivity > SIM & WiFi": 10,
    "Kitchen > Knives": 8,
    "Food & Drink > Snacks & Sweets": 15,
    "Food & Drink > Noodles & Ramen": 10,
    "Food & Drink > Tea & Matcha": 8,
    "Food & Drink > Coffee": 8,
    "Food & Drink > Whisky & Sake": 10,
    "Food & Drink > Beverages": 8,
    "Food & Drink > Seasonings": 8,
    "Electronics > Kitchen Appliances": 10,
    "Electronics > Home Appliances": 10,
    "Electronics > Gadgets": 5,
    "Anime & Manga > Figures & Collectibles": 8,
    "Anime & Manga > Trading Cards": 8,
    "Stationery > Pens & Writing": 8,
    "Stationery > Notebooks": 5,
    "Seasonal > Summer Cooling": 5,
    "Baby & Kids > Baby Essentials": 8,
    "Pet > Dog": 8,
    "Pet > Cat": 8,
    "Home & Living > Cleaning": 5,
    "DIY & Tools > Tools": 5,
}

counts = {k: 0 for k in APPROVED}
extra = {}

for f in glob.glob("src/content/products/*.json"):
    if "_template" in f: continue
    d = json.load(open(f, encoding="utf-8"))
    key = f"{d.get('category','')} > {d.get('subcategory','')}"
    if key in counts:
        counts[key] += 1
    else:
        extra[key] = extra.get(key, 0) + 1

print("CATEGORY COVERAGE REPORT")
print("=" * 60)
print(f"{'Category':<45} {'Have':>5} {'Target':>7} {'Status':>8}")
print("-" * 60)

total_have = 0
total_target = 0
missing = []
low = []

for cat, target in sorted(APPROVED.items()):
    have = counts[cat]
    total_have += have
    total_target += target
    if have == 0:
        status = "EMPTY"
        missing.append(cat)
    elif have < target // 2:
        status = "LOW"
        low.append(cat)
    elif have < target:
        status = "OK"
    else:
        status = "GOOD"
    print(f"  {cat:<43} {have:>5} {target:>7} {status:>8}")

print("-" * 60)
print(f"  {'TOTAL':<43} {total_have:>5} {total_target:>7}")

if missing:
    print(f"\n*** EMPTY CATEGORIES (need products): ***")
    for c in missing:
        print(f"  - {c}")

if low:
    print(f"\n*** LOW CATEGORIES (need more): ***")
    for c in low:
        print(f"  - {c} ({counts[c]}/{APPROVED[c]})")

if extra:
    print(f"\n*** UNEXPECTED CATEGORIES (not in approved list): ***")
    for k, v in sorted(extra.items()):
        print(f"  - {k}: {v}")
