"""Audit all products for category issues, missing radar charts, and buy links."""
import os, json, glob

products = []
for f in sorted(glob.glob('src/content/products/*.json')):
    if '_template' in f:
        continue
    with open(f, encoding='utf-8') as fh:
        d = json.load(fh)
        d['_file'] = os.path.basename(f)
        products.append(d)

print(f"Total products: {len(products)}")

# Category breakdown
cats = {}
for p in products:
    cat = p.get('category', '?')
    sub = p.get('subcategory', '?')
    key = f"{cat} > {sub}"
    cats[key] = cats.get(key, 0) + 1

print("\n=== CATEGORIES ===")
for k, v in sorted(cats.items()):
    print(f"  {k}: {v}")

# Radar chart check
has_radar = sum(1 for p in products if p.get('radar'))
no_radar = [p for p in products if not p.get('radar')]
print(f"\n=== RADAR CHARTS ===")
print(f"  With radar: {has_radar}/{len(products)}")
print(f"  Missing radar: {len(no_radar)}")
if no_radar[:5]:
    print("  Examples missing radar:")
    for p in no_radar[:5]:
        print(f"    - {p.get('name', p.get('name_en', '?'))[:50]}")

# Buy link check
has_buy = sum(1 for p in products if p.get('buyUrl'))
has_rakuten = sum(1 for p in products if 'rakuten' in str(p.get('buyUrl', '')).lower())
has_amazon = sum(1 for p in products if 'amazon' in str(p.get('buyUrl', '')).lower())
has_retailers = sum(1 for p in products if p.get('retailers'))
print(f"\n=== BUY LINKS ===")
print(f"  With buyUrl: {has_buy}/{len(products)}")
print(f"  Rakuten links: {has_rakuten}")
print(f"  Amazon links: {has_amazon}")
print(f"  With retailers obj: {has_retailers}")

# Suspicious categorizations
print(f"\n=== SUSPICIOUS CATEGORIES ===")
suspicious = []
for p in products:
    name = (p.get('name', '') + ' ' + p.get('name_en', '')).lower()
    cat = p.get('category', '')
    sub = p.get('subcategory', '')
    typ = p.get('type', '')
    slug = p.get('_file', '')

    issues = []
    # Tech products in wrong categories
    if any(w in name for w in ['wifi', 'sim', 'router', 'cable', 'harness', 'smartwatch', 'gps']):
        if cat not in ('Electronics', 'Tech'):
            issues.append(f"tech product in {cat}")
    # Baby clothes/fashion
    if any(w in name for w in ['cloth', 'shirt', 'pants', 'dress', 'shoe', 'fashion']):
        if cat == 'Baby':
            issues.append("fashion item in Baby")
    # Food in wrong category
    if any(w in name for w in ['coffee', 'tea', 'water', 'snack', 'chocolate', 'candy']):
        if cat not in ('Food', 'Food & Drink'):
            issues.append(f"food item in {cat}")
    # Supplements in wrong category
    if any(w in name for w in ['supplement', 'vitamin', 'protein']):
        if cat != 'Health':
            issues.append(f"supplement in {cat}")

    if issues:
        suspicious.append((slug, name[:60], ', '.join(issues)))

for slug, name, issue in suspicious:
    print(f"  {slug}: {name} -- {issue}")

if not suspicious:
    print("  None found (basic check only)")

print(f"\n=== SUMMARY ===")
print(f"  Products: {len(products)}")
print(f"  Categories: {len(cats)}")
print(f"  Missing radar: {len(no_radar)}")
print(f"  Missing buyUrl: {len(products) - has_buy}")
print(f"  Suspicious categories: {len(suspicious)}")
