"""
Fix product issues:
1. Fix miscategorized products
2. Add missing radar charts
3. Add Amazon search links (prioritized over Rakuten)
4. Remove non-product items (car harnesses, wifi routers, etc.)
"""
import os, json, glob, re, urllib.parse

PRODUCTS_DIR = 'src/content/products'

# Products to DELETE (not actual consumer products for our audience)
DELETE_SLUGS = {
    'carmate-engine-starter-harness-te105',
    'suzuki-20p-audio-harness-kit',
    'suzuki-20p-audio-harness-kit-2',
    'pioneer-dct-wr200d-wifi-router',
    'zeus-wifi-30day-unlimited-docomo',
    'waterproof-name-labels-849-designs',
    'asics-crosswear-hoodie-pants-set',
}

# Category fixes: slug -> correct category/subcategory/type
CATEGORY_FIXES = {
    # Supplements should be in Health, not Beauty
    'astaxanthin-white-shield-uv-supplement': ('Health', 'Supplements', 'UV Supplement'),
    'astaxanthin-whiteshield-supplement': ('Health', 'Supplements', 'UV Supplement'),
    'hakua-internal-uv-defense-supplement': ('Health', 'Supplements', 'UV Supplement'),
    'hakua-internal-uv-supplement-30day': ('Health', 'Supplements', 'UV Supplement'),
    'sbc-medispa-white-supplement': ('Health', 'Supplements', 'Beauty Supplement'),
    'karorin-pure-weight-management': ('Health', 'Supplements', 'Weight Management'),
    # Water filters -> Home > Kitchen, not Electronics
    'aqualife-raku-raku-smart-plus-water': ('Home', 'Kitchen', 'Water Filter'),
    'brita-lisqui-maxtra-pro-pitcher': ('Home', 'Kitchen', 'Water Filter'),
    'brita-style-essential-pitcher': ('Home', 'Kitchen', 'Water Filter'),
    'etec-uleau-water-filter-cartridge': ('Home', 'Kitchen', 'Water Filter'),
    'toray-trevino-cartridge-replacement': ('Home', 'Kitchen', 'Water Filter'),
    # Coffee maker -> Electronics > Kitchen
    'zojirushi-coffee-maker-ec-sa40': ('Electronics', 'Kitchen', 'Coffee Maker'),
    'toshiba-er-d3000b-steam-oven': ('Electronics', 'Kitchen', 'Oven'),
    # Protein -> Health > Supplements
    'sabas-whey-protein-100-chocolate': ('Health', 'Supplements', 'Protein'),
    'x-plosion-whey-protein-3kg': ('Health', 'Supplements', 'Protein'),
    'bambi-water-diet-protein-shake': ('Health', 'Diet', 'Protein Shake'),
    'slimore-coffee-diet': ('Health', 'Diet', 'Diet Coffee'),
    # Diapers stay in Baby but fix type
    'mamy-poko-pants-doraemon-diapers': ('Baby', 'Baby Care', 'Diapers'),
    'merries-air-through-pants-diapers': ('Baby', 'Baby Care', 'Diapers'),
    'pampers-sweat-dry-pants-diapers': ('Baby', 'Baby Care', 'Diapers'),
}

# Default radar values for products missing them
DEFAULT_RADAR = {
    'quality': 75,
    'value': 70,
    'popularity': 70,
    'ease': 70,
    'innovation': 65,
}

def make_amazon_search_url(name, brand):
    """Generate Amazon JP search URL for a product."""
    # Clean up name for search
    clean = re.sub(r'[^\w\s\-]', '', name)
    query = f"{brand} {clean}".strip()[:80]
    encoded = urllib.parse.quote(query)
    return f"https://www.amazon.co.jp/s?k={encoded}&tag=chartedly-22"

def make_rakuten_search_url(name, brand):
    """Generate Rakuten search URL for a product."""
    query = f"{brand} {name}".strip()[:80]
    encoded = urllib.parse.quote(query)
    return f"https://search.rakuten.co.jp/search/mall/{encoded}/"

deleted = 0
fixed_cat = 0
fixed_radar = 0
fixed_links = 0

for f in sorted(glob.glob(os.path.join(PRODUCTS_DIR, '*.json'))):
    if '_template' in f:
        continue

    slug = os.path.basename(f).replace('.json', '')

    # Delete non-products
    if slug in DELETE_SLUGS:
        os.remove(f)
        print(f"  DELETED: {slug}")
        deleted += 1
        continue

    with open(f, encoding='utf-8') as fh:
        d = json.load(fh)

    changed = False
    name = d.get('name', d.get('name_en', ''))
    brand = d.get('brand', '')

    # Fix categories
    if slug in CATEGORY_FIXES:
        cat, sub, typ = CATEGORY_FIXES[slug]
        if d.get('category') != cat or d.get('subcategory') != sub:
            d['category'] = cat
            d['subcategory'] = sub
            d['type'] = typ
            changed = True
            fixed_cat += 1
            print(f"  RECAT: {slug} -> {cat} > {sub} > {typ}")

    # Add missing radar
    if not d.get('radar'):
        # Generate radar based on score
        score = d.get('score', 70)
        d['radar'] = {
            'quality': min(100, max(40, score + (-5 if score > 80 else 5))),
            'value': min(100, max(40, score + (-3 if score > 75 else 3))),
            'popularity': min(100, max(40, score + (-2 if score > 70 else 2))),
            'ease': min(100, max(40, score + (0))),
            'innovation': min(100, max(40, score + (-8 if score > 85 else -3))),
        }
        changed = True
        fixed_radar += 1

    # Add Amazon search URL if not already Amazon
    buy_url = d.get('buyUrl', '')
    retailers = d.get('retailers', {})

    if not retailers:
        retailers = {}

    # Set Amazon as primary
    if 'amazon' not in buy_url.lower() and not retailers.get('amazon'):
        retailers['amazon'] = make_amazon_search_url(name, brand)
        changed = True

    # Keep Rakuten link
    if 'rakuten' in buy_url.lower() and not retailers.get('rakuten'):
        retailers['rakuten'] = buy_url
        changed = True
    elif not retailers.get('rakuten'):
        retailers['rakuten'] = make_rakuten_search_url(name, brand)
        changed = True

    if retailers and d.get('retailers') != retailers:
        d['retailers'] = retailers
        # Set buyUrl to Amazon (prioritized)
        if retailers.get('amazon'):
            d['buyUrl'] = retailers['amazon']
        changed = True
        fixed_links += 1

    if changed:
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(d, fh, indent=2, ensure_ascii=False)
            fh.write('\n')

print(f"\n=== FIX SUMMARY ===")
print(f"  Deleted: {deleted}")
print(f"  Recategorized: {fixed_cat}")
print(f"  Added radar: {fixed_radar}")
print(f"  Updated buy links: {fixed_links}")
print(f"  Remaining products: {len(glob.glob(os.path.join(PRODUCTS_DIR, '*.json'))) - 1}")
