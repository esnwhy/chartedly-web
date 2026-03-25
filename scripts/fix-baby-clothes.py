"""Fix clothing/sportswear incorrectly categorized as Baby products."""
import json, glob, os

PRODUCTS_DIR = 'src/content/products'

# Keywords that indicate sportswear/fashion (NOT baby products)
SPORTSWEAR_KEYWORDS = [
    'tracksuit', 'hoodie', 'jersey', 'crewneck', 'pants set',
    'recovery wear', 'men\'s', 'mens', 'women\'s', 'womens', 'unisex',
    'leather design', 'trackpant', 'sweatsuit',
]

# Sports/fashion brands
FASHION_BRANDS = [
    'adidas', 'nike', 'fila', 'under armour', 'hugo boss',
    'puma', 'asics', 'descente', 'sixpad', 'champion',
    'eslad', 'manhattan store', 'woody house',
]

deleted = 0
recategorized = 0

for f in sorted(glob.glob(os.path.join(PRODUCTS_DIR, '*.json'))):
    if '_template' in f:
        continue

    with open(f, encoding='utf-8') as fh:
        d = json.load(fh)

    name = (d.get('name', '') + ' ' + d.get('name_en', '')).lower()
    brand = d.get('brand', '').lower()
    cat = d.get('category', '')
    sub = d.get('subcategory', '')
    slug = os.path.basename(f).replace('.json', '')

    # Delete sportswear/tracksuits that are in Baby category
    is_sportswear = any(kw in name for kw in SPORTSWEAR_KEYWORDS)
    is_fashion_brand = any(b in brand for b in FASHION_BRANDS)

    if cat == 'Baby' and (is_sportswear or is_fashion_brand):
        os.remove(f)
        print(f"  DELETED: {slug} ({d.get('name', d.get('name_en', ''))[:50]})")
        deleted += 1
        continue

    # Also check other categories for misplaced sportswear
    if is_sportswear and cat not in ('Fashion', 'Sports'):
        if is_fashion_brand:
            os.remove(f)
            print(f"  DELETED: {slug} ({d.get('name', d.get('name_en', ''))[:50]}) - sportswear in {cat}")
            deleted += 1
            continue

print(f"\nDeleted: {deleted} sportswear/fashion items from wrong categories")
print(f"Remaining Baby products: {sum(1 for f in glob.glob(os.path.join(PRODUCTS_DIR, '*.json')) if json.load(open(f, encoding='utf-8')).get('category') == 'Baby')}")
