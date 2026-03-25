# ADR-004: Image Processing Pipeline

## Status
**Accepted** — 2026-03-24

## Context
Chartedly displays product images from Rakuten and Amazon. Currently, `sync-products.mjs` downloads images to `public/images/products/` as-is (JPG/PNG/WebP). Images are not resized or converted to modern formats. Phase 05 specs require responsive images, WebP/AVIF, and multiple sizes for cards, detail pages, and hero sections.

## Decision
Use Astro's built-in `<Image />` component (backed by Sharp) for build-time image optimization. Keep the existing download pipeline but add a preprocessing step with Sharp for source normalization.

## Alternatives Considered

### Cloudflare Images (or Imgix, Cloudinary)
- **Pros:** On-the-fly transforms, CDN-served, no build cost.
- **Cons:** Monthly cost ($5-50+/mo). External dependency. 116 products x ~3 sizes = 348 transforms/month minimum, growing with traffic. Adds latency on first request (transform + cache). Overkill at current scale.
- **Verdict:** Rejected for launch. Reconsider at 1000+ products.

### Manual Sharp script (no Astro Image)
- **Pros:** Full control over output sizes and formats.
- **Cons:** Duplicates what Astro Image already does. Must maintain custom responsive image markup. No integration with Astro's build cache.
- **Verdict:** Rejected. Reinventing the wheel.

### Astro `<Image />` + Sharp (chosen)
- **Pros:**
  - Built into Astro. Zero additional dependencies (Sharp is already an Astro dependency).
  - Automatic WebP/AVIF generation at build time.
  - Responsive `srcset` generation with `widths` prop.
  - Lazy loading and proper `width`/`height` attributes for CLS prevention.
  - Build-time only — no runtime cost.
  - Cached between builds — only processes changed images.

## Implementation

### Phase 1: Source Normalization (pre-build script)

Add `scripts/optimize-images.mjs`:

```javascript
/**
 * Pre-process downloaded product images:
 * 1. Convert to WebP if not already
 * 2. Resize to max 800px width (source quality)
 * 3. Strip EXIF metadata
 *
 * Usage: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const IMAGES_DIR = './public/images/products';
const MAX_WIDTH = 800;

const files = fs.readdirSync(IMAGES_DIR)
  .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));

for (const file of files) {
  const input = path.join(IMAGES_DIR, file);
  const output = path.join(IMAGES_DIR, file.replace(/\.\w+$/, '.webp'));

  await sharp(input)
    .resize(MAX_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);

  // Remove original if different format
  if (input !== output) fs.unlinkSync(input);

  // Update product JSON to reference .webp
  // (handled by sync-products.mjs on next run)
}
```

### Phase 2: Astro Image Component Usage

```astro
---
// ProductCard.astro
import { Image } from 'astro:assets';

const { product } = Astro.props;
---

<Image
  src={product.image}
  alt={product.name}
  widths={[200, 400]}
  sizes="(max-width: 768px) 200px, 400px"
  format="webp"
  quality={80}
  loading="lazy"
  decoding="async"
  class="rounded-md object-cover"
/>
```

For hero images (LCP critical):
```astro
<Image
  src={featuredProduct.image}
  alt={featuredProduct.name}
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
  format="webp"
  quality={85}
  loading="eager"
  fetchpriority="high"
/>
```

### Phase 3: Multi-Image Support (future)

Current schema has a single `image` field. When multi-image is implemented:

```typescript
// content.config.ts addition
images: z.array(z.object({
  src: z.string(),
  alt_en: z.string(),
  alt_ja: z.string(),
  isPrimary: z.boolean().default(false),
})).default([]),
```

### Image Size Targets

| Context | Max Width | Format | Quality |
|---|---|---|---|
| Product card thumbnail | 400px | WebP | 80 |
| Product detail hero | 800px | WebP | 85 |
| Hero carousel | 1200px | WebP | 85 |
| Comparison table | 200px | WebP | 75 |
| OG/social sharing | 1200x630 | PNG | 90 |

## Consequences
- All product images served as WebP with proper `srcset` for responsive loading.
- Build time increases slightly (~5-10s for 116 images, cached after first build).
- `sharp` is already a transitive dependency of Astro — no new dependency.
- Image download pipeline (`sync-products.mjs`, `fetch-images.mjs`) continues to work as-is. The optimization step is additive.
- CLS is prevented by explicit `width`/`height` on all `<Image />` components.
