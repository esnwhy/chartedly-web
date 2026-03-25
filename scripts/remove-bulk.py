"""Remove bulk/multi-pack products that slipped through dedup."""
import json, glob, os, re

removed = 0
kept = 0
for f in sorted(glob.glob("src/content/products/*.json")):
    if "_template" in f:
        continue
    d = json.load(open(f, encoding="utf-8"))
    name = (d.get("name", "") + " " + d.get("name_en", "")).lower()
    slug = os.path.basename(f)

    # Bulk patterns
    is_bulk = bool(re.search(r"x\d{2,}", name))
    is_bulk = is_bulk or bool(re.search(r"\d{2,}\s*(本|個|枚|袋|箱|缶|瓶)", name))
    is_bulk = is_bulk or bool(re.search(r"(\d{2,})\s*pack", name))
    is_bulk = is_bulk or any(w in name for w in [
        "48本", "24本", "12本", "36本", "x48", "x24", "x12", "x36",
        "ケース買い", "箱買い", "まとめ買い", "ケース販売",
        "1箱", "2箱", "case sale", "bulk pack",
    ])

    if is_bulk:
        os.remove(f)
        removed += 1
        print(f"REMOVED: {slug}: {name[:70]}")
    else:
        kept += 1

print(f"\nRemoved: {removed}, Kept: {kept}")
