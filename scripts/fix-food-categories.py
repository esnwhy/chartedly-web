"""Fix Food & Drink categories + remove non-food items that snuck in."""
import json, glob, os, re

fixed = 0
removed = 0

# Craft supplies that somehow ended up in Food
CRAFT_PATTERNS = [
    "yarn", "crochet", "knitting", "embroidery", "lace thread",
    "stitch stopper", "ball winder", "needle", "gauge ruler",
    "pouch frame", "clasp", "sock blocker", "shape.*wire",
    "craft.*eye", "craft.*wire", "craft.*case", "yarn organizer",
    "yarn holder", "yarn skein",
]

for f in sorted(glob.glob("src/content/products/*.json")):
    if "_template" in f:
        continue
    d = json.load(open(f, encoding="utf-8"))
    name = (d.get("name", "") + " " + d.get("name_en", "")).lower()
    typ = d.get("type", "").lower()
    sub = d.get("subcategory", "")
    changed = False

    # Remove craft supplies
    is_craft = any(re.search(p, name + " " + typ) for p in CRAFT_PATTERNS)
    if is_craft:
        os.remove(f)
        removed += 1
        print(f"REMOVED (craft): {os.path.basename(f)}")
        continue

    # Fix beer → Beverages > Beer
    if any(w in name or w in typ for w in ["beer", "lager", "ale", "ipa", "stout"]):
        if sub not in ("Beverages",):
            d["category"] = "Food & Drink"
            d["subcategory"] = "Beverages"
            d["type"] = "Beer"
            changed = True

    # Fix wine → Beverages > Wine
    if any(w in name or w in typ for w in ["wine", "champagne", "sparkling wine"]):
        if sub not in ("Beverages",):
            d["category"] = "Food & Drink"
            d["subcategory"] = "Beverages"
            d["type"] = "Wine"
            changed = True

    # Fix wagashi/mochi/sweets → Snacks & Sweets
    if any(w in name or w in typ for w in ["wagashi", "mochi", "tart", "chocolate", "confection", "sweet", "candy", "cookie", "cake", "sekihan", "red rice"]):
        if sub not in ("Snacks & Sweets",):
            d["category"] = "Food & Drink"
            d["subcategory"] = "Snacks & Sweets"
            if "chocolate" in name or "chocolate" in typ:
                d["type"] = "Chocolate"
            elif "mochi" in name or "mochi" in typ:
                d["type"] = "Mochi"
            elif "wagashi" in name or "wagashi" in typ:
                d["type"] = "Wagashi"
            elif "sekihan" in name or "red rice" in name:
                d["type"] = "Traditional Sweets"
            else:
                d["type"] = "Sweets"
            changed = True

    # Fix dressing/condiment → Seasonings
    if any(w in name or w in typ for w in ["dressing", "condiment", "sauce", "soy sauce", "miso", "dashi"]):
        if sub not in ("Seasonings",):
            d["category"] = "Food & Drink"
            d["subcategory"] = "Seasonings"
            d["type"] = "Condiment"
            changed = True

    # Fix tempura flour → Seasonings (cooking ingredients)
    if "tempura" in name or "tempura" in typ:
        if sub not in ("Seasonings",):
            d["category"] = "Food & Drink"
            d["subcategory"] = "Seasonings"
            d["type"] = "Cooking Ingredient"
            changed = True

    # Fix sparkling water → Beverages
    if "sparkling" in name and "water" in name:
        if sub not in ("Beverages",):
            d["category"] = "Food & Drink"
            d["subcategory"] = "Beverages"
            d["type"] = "Sparkling Water"
            changed = True

    if changed:
        json.dump(d, open(f, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
        fixed += 1
        print(f"Fixed: {os.path.basename(f)} -> {d['subcategory']} > {d['type']}")

print(f"\nTotal fixed: {fixed}")
print(f"Total removed (craft): {removed}")
