"""
Remove white backgrounds from product images → transparent PNG
Products will float beautifully on the dark theme.

Usage:
  python scripts/remove-backgrounds.py              # all images
  python scripts/remove-backgrounds.py --limit 10   # first 10
  python scripts/remove-backgrounds.py --force       # redo all
"""

import os
import sys
import json
from pathlib import Path
from rembg import remove
from PIL import Image
import io

IMAGES_DIR = Path(__file__).parent.parent / "public" / "images" / "products"
PRODUCTS_DIR = Path(__file__).parent.parent / "src" / "content" / "products"
PROGRESS_FILE = Path(__file__).parent.parent / ".rembg-progress.json"

# Parse args
args = sys.argv[1:]
limit = None
force = "--force" in args
if "--limit" in args:
    idx = args.index("--limit")
    limit = int(args[idx + 1])

# Load progress
progress = {}
if PROGRESS_FILE.exists() and not force:
    progress = json.loads(PROGRESS_FILE.read_text())

# Get all product JSON files
products = sorted(PRODUCTS_DIR.glob("*.json"))
products = [p for p in products if not p.name.startswith("_")]

print(f"\n🎨 Background Removal (rembg AI)\n")
print(f"   📂 {len(products)} products found")
print(f"   🔧 Limit: {limit or 'ALL'} | Force: {force}")
print(f"   ─────────────────────────────────────────\n")

done = 0
skipped = 0
failed = 0
processed = 0

for product_file in products:
    if limit and processed >= limit:
        break

    slug = product_file.stem
    processed += 1
    pad = f"[{processed:3d}]"

    # Skip if already done
    if slug in progress and not force:
        print(f"   {pad} {slug[:45]:45s} ⏭️  already done")
        skipped += 1
        continue

    # Find the current image file
    data = json.loads(product_file.read_text(encoding="utf-8"))
    img_path_str = data.get("image", "")

    if not img_path_str or not img_path_str.startswith("/images/"):
        print(f"   {pad} {slug[:45]:45s} ⏭️  no local image")
        skipped += 1
        continue

    # Resolve image path
    img_path = Path(__file__).parent.parent / "public" / img_path_str.lstrip("/")
    if not img_path.exists():
        print(f"   {pad} {slug[:45]:45s} ❌ image not found")
        failed += 1
        continue

    try:
        # Read image
        input_bytes = img_path.read_bytes()

        # Remove background
        output_bytes = remove(input_bytes)

        # Save as PNG with transparency
        output_path = IMAGES_DIR / f"{slug}.png"
        output_path.write_bytes(output_bytes)

        size_kb = len(output_bytes) // 1024

        # Update product JSON to point to new PNG
        data["image"] = f"/images/products/{slug}.png"
        product_file.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

        # Remove old non-PNG file if different
        if img_path.suffix.lower() != ".png" and img_path.exists():
            img_path.unlink()

        progress[slug] = "done"
        PROGRESS_FILE.write_text(json.dumps(progress, indent=2))

        print(f"   {pad} {slug[:45]:45s} ✅ {size_kb}KB")
        done += 1

    except Exception as e:
        print(f"   {pad} {slug[:45]:45s} ❌ {str(e)[:40]}")
        progress[slug] = f"failed: {str(e)[:60]}"
        PROGRESS_FILE.write_text(json.dumps(progress, indent=2))
        failed += 1

print(f"""
╔══════════════════════════════════════════════════════╗
║  🎨 Background Removal Summary                      ║
╠══════════════════════════════════════════════════════╣
║  ✅ Processed:       {done:3d}                           ║
║  ⏭️  Skipped:         {skipped:3d}                           ║
║  ❌ Failed:          {failed:3d}                           ║
║  📦 Total:           {processed:3d}                           ║
╚══════════════════════════════════════════════════════╝
""")
