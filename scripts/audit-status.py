"""Quick audit of product images and categories."""
import json, glob, os

cats = {}
small_imgs = []
no_img = []
total = 0

for f in sorted(glob.glob("src/content/products/*.json")):
    if "_template" in f:
        continue
    d = json.load(open(f, encoding="utf-8"))
    total += 1
    cat = d.get("category", "?")
    sub = d.get("subcategory", "?")
    cats[cat] = cats.get(cat, 0) + 1

    img = d.get("image", "")
    slug = os.path.basename(f).replace(".json", "")
    name = d.get("name", d.get("name_en", ""))[:40]

    if not img or not img.startswith("/images/"):
        no_img.append(f"{slug}: {name}")
    else:
        p = os.path.join("public", img.lstrip("/"))
        if os.path.exists(p) and os.path.getsize(p) < 15000:
            small_imgs.append(f"{slug}: {name} ({os.path.getsize(p)//1024}KB)")

print(f"Total products: {total}")
print(f"Missing images: {len(no_img)}")
print(f"Small images (<15KB): {len(small_imgs)}")
print(f"\nCategories:")
for k, v in sorted(cats.items()):
    print(f"  {k}: {v}")

if no_img:
    print(f"\nProducts without images (first 10):")
    for x in no_img[:10]:
        print(f"  {x}")

if small_imgs:
    print(f"\nSmall images (first 10):")
    for x in small_imgs[:10]:
        print(f"  {x}")
