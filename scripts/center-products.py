"""
Center products in their images — crop to content bounding box, add equal padding.
Products will appear perfectly centered on cards.

Usage:
  python scripts/center-products.py
  python scripts/center-products.py --limit 10
  python scripts/center-products.py --force
"""

import sys
import json
from pathlib import Path
from PIL import Image

IMAGES_DIR = Path(__file__).parent.parent / "public" / "images" / "products"
PRODUCTS_DIR = Path(__file__).parent.parent / "src" / "content" / "products"
PROGRESS_FILE = Path(__file__).parent.parent / ".center-progress.json"

args = sys.argv[1:]
limit = None
force = "--force" in args
if "--limit" in args:
    idx = args.index("--limit")
    limit = int(args[idx + 1])

progress = {}
if PROGRESS_FILE.exists() and not force:
    progress = json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))

products = sorted(PRODUCTS_DIR.glob("*.json"))
products = [p for p in products if not p.name.startswith("_")]

print(f"\nCentering product images\n")
print(f"   {len(products)} products found")
print(f"   Limit: {limit or 'ALL'} | Force: {force}")
print(f"   ---\n")

done = 0
skipped = 0
failed = 0
processed = 0

PADDING_PERCENT = 0.10  # 10% padding around the product

for pf in products:
    if limit and processed >= limit:
        break

    slug = pf.stem
    processed += 1
    pad = f"[{processed:3d}]"

    if slug in progress and not force:
        skipped += 1
        continue

    data = json.loads(pf.read_text(encoding="utf-8"))
    img_str = data.get("image", "")
    if not img_str.startswith("/images/"):
        skipped += 1
        continue

    img_path = Path(__file__).parent.parent / "public" / img_str.lstrip("/")
    if not img_path.exists():
        skipped += 1
        continue

    try:
        img = Image.open(img_path).convert("RGBA")

        # Get bounding box of non-transparent content
        alpha = img.split()[3]
        bbox = alpha.getbbox()

        if not bbox:
            print(f"   {pad} {slug[:45]:45s} skip (empty)")
            skipped += 1
            continue

        # Crop to content
        cropped = img.crop(bbox)
        cw, ch = cropped.size

        # Calculate new canvas size with padding
        padding = int(max(cw, ch) * PADDING_PERCENT)
        canvas_size = max(cw, ch) + padding * 2

        # Create square canvas (transparent)
        canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

        # Paste centered
        x = (canvas_size - cw) // 2
        y = (canvas_size - ch) // 2
        canvas.paste(cropped, (x, y), cropped)

        # Save
        canvas.save(img_path, "PNG", optimize=True)
        size_kb = img_path.stat().st_size // 1024

        progress[slug] = "done"
        PROGRESS_FILE.write_text(json.dumps(progress, indent=2), encoding="utf-8")

        print(f"   {pad} {slug[:45]:45s} OK {size_kb}KB ({canvas_size}x{canvas_size})")
        done += 1

    except Exception as e:
        print(f"   {pad} {slug[:45]:45s} FAIL {str(e)[:40]}")
        failed += 1

print(f"\n   Done: {done} centered | {skipped} skipped | {failed} failed\n")
