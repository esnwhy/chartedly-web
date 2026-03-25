"""Add Amazon + Rakuten links to ALL products that are missing them."""
import json, glob, os, re, urllib.parse

PRODUCTS_DIR = 'src/content/products'

def make_amazon_url(name, brand):
    query = f"{brand} {re.sub(r'[^a-zA-Z0-9 ]', '', name)}".strip()[:80]
    return f"https://www.amazon.co.jp/s?k={urllib.parse.quote(query)}&tag=chartedly-22"

def make_rakuten_url(name, brand):
    query = f"{brand} {name}".strip()[:80]
    return f"https://search.rakuten.co.jp/search/mall/{urllib.parse.quote(query)}/"

fixed = 0
total = 0

for f in sorted(glob.glob(os.path.join(PRODUCTS_DIR, '*.json'))):
    if '_template' in f:
        continue
    total += 1

    with open(f, encoding='utf-8') as fh:
        d = json.load(fh)

    name = d.get('name', d.get('name_en', ''))
    brand = d.get('brand', '')
    buy_url = d.get('buyUrl', '')
    retailers = d.get('retailers', None)
    changed = False

    # Ensure retailers object exists
    if not retailers or not isinstance(retailers, dict):
        retailers = {}
        changed = True

    # Add Amazon if missing
    if not retailers.get('amazon'):
        if 'amazon' in buy_url.lower():
            retailers['amazon'] = buy_url
        else:
            retailers['amazon'] = make_amazon_url(name, brand)
        changed = True

    # Add Rakuten if missing
    if not retailers.get('rakuten'):
        if 'rakuten' in buy_url.lower():
            retailers['rakuten'] = buy_url
        else:
            retailers['rakuten'] = make_rakuten_url(name, brand)
        changed = True

    # Set buyUrl to Amazon (prioritized)
    if retailers.get('amazon') and 'amazon' not in buy_url.lower():
        d['buyUrl'] = retailers['amazon']
        changed = True

    if changed:
        d['retailers'] = retailers
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(d, fh, indent=2, ensure_ascii=False)
            fh.write('\n')
        fixed += 1

print(f"Total: {total}")
print(f"Fixed: {fixed}")
print(f"All products now have Amazon + Rakuten links")
