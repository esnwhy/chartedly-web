import json, glob
cats = {}
for f in glob.glob("src/content/products/*.json"):
    if "_template" in f: continue
    d = json.load(open(f, encoding="utf-8"))
    if d.get("category") == "Food & Drink":
        sub = d.get("subcategory", "?")
        typ = d.get("type", "?")
        key = f"{sub} > {typ}"
        cats[key] = cats.get(key, 0) + 1
for k, v in sorted(cats.items()):
    print(f"  {k}: {v}")
print(f"\nTotal Food & Drink: {sum(cats.values())}")
