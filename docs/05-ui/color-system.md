# Chartedly Color System

All color pairings with WCAG 2.1 contrast ratios. Minimum AA compliance required.

---

## Contrast Ratio Reference

| Level | Normal Text (≥16px) | Large Text (≥18px bold / ≥24px) | UI Components |
|-------|---------------------|----------------------------------|---------------|
| AA    | 4.5:1               | 3:1                              | 3:1           |
| AAA   | 7:1                 | 4.5:1                            | N/A           |

---

## Background + Text Pairings

### On `bg-base` (#0A0A0F)

| Foreground          | Hex       | Ratio  | AA Text | AA Large | AA UI |
|---------------------|-----------|--------|---------|----------|-------|
| text-primary        | #FFFFFF   | 19.4:1 | PASS    | PASS     | PASS  |
| text-secondary      | #9CA3AF   | 7.5:1  | PASS    | PASS     | PASS  |
| text-tertiary       | #6B7280   | 4.6:1  | PASS    | PASS     | PASS  |
| text-disabled       | #4B5563   | 2.9:1  | FAIL    | FAIL     | FAIL* |
| primary             | #4F7DF7   | 5.2:1  | PASS    | PASS     | PASS  |
| secondary           | #F7A94F   | 9.1:1  | PASS    | PASS     | PASS  |
| score-excellent     | #22C55E   | 8.2:1  | PASS    | PASS     | PASS  |
| score-good          | #F59E0B   | 8.6:1  | PASS    | PASS     | PASS  |
| score-poor          | #EF4444   | 4.6:1  | PASS    | PASS     | PASS  |

*Disabled text intentionally below AA — it communicates non-interactive state.

### On `bg-charcoal` (#1A1A2E)

| Foreground          | Hex       | Ratio  | AA Text | AA Large | AA UI |
|---------------------|-----------|--------|---------|----------|-------|
| text-primary        | #FFFFFF   | 15.2:1 | PASS    | PASS     | PASS  |
| text-secondary      | #9CA3AF   | 5.9:1  | PASS    | PASS     | PASS  |
| text-tertiary       | #6B7280   | 3.6:1  | FAIL    | PASS     | PASS  |
| primary             | #4F7DF7   | 4.1:1  | FAIL    | PASS     | PASS  |
| secondary           | #F7A94F   | 7.1:1  | PASS    | PASS     | PASS  |

### On `surface-card` (#16162A)

| Foreground          | Hex       | Ratio  | AA Text | AA Large | AA UI |
|---------------------|-----------|--------|---------|----------|-------|
| text-primary        | #FFFFFF   | 16.1:1 | PASS    | PASS     | PASS  |
| text-secondary      | #9CA3AF   | 6.3:1  | PASS    | PASS     | PASS  |
| text-tertiary       | #6B7280   | 3.8:1  | FAIL    | PASS     | PASS  |
| primary             | #4F7DF7   | 4.3:1  | FAIL    | PASS     | PASS  |
| secondary           | #F7A94F   | 7.5:1  | PASS    | PASS     | PASS  |
| score-excellent     | #22C55E   | 6.9:1  | PASS    | PASS     | PASS  |
| score-good          | #F59E0B   | 7.2:1  | PASS    | PASS     | PASS  |
| score-poor          | #EF4444   | 3.9:1  | FAIL    | PASS     | PASS  |

### On `surface-elevated` (#1E1E38)

| Foreground          | Hex       | Ratio  | AA Text | AA Large | AA UI |
|---------------------|-----------|--------|---------|----------|-------|
| text-primary        | #FFFFFF   | 14.0:1 | PASS    | PASS     | PASS  |
| text-secondary      | #9CA3AF   | 5.5:1  | PASS    | PASS     | PASS  |
| text-tertiary       | #6B7280   | 3.4:1  | FAIL    | PASS     | PASS  |
| primary             | #4F7DF7   | 3.8:1  | FAIL    | PASS     | PASS  |

### On `primary` (#4F7DF7) — Buttons, badges

| Foreground          | Hex       | Ratio  | AA Text | AA Large | AA UI |
|---------------------|-----------|--------|---------|----------|-------|
| text-primary        | #FFFFFF   | 3.7:1  | FAIL    | PASS     | PASS  |
| text-inverse        | #0A0A0F   | 5.2:1  | PASS    | PASS     | PASS  |

### On `secondary` (#F7A94F) — Award badges, highlights

| Foreground          | Hex       | Ratio  | AA Text | AA Large | AA UI |
|---------------------|-----------|--------|---------|----------|-------|
| text-inverse        | #0A0A0F   | 9.1:1  | PASS    | PASS     | PASS  |
| text-primary        | #FFFFFF   | 2.1:1  | FAIL    | FAIL     | FAIL  |

---

## Border Contrast on Backgrounds

| Border              | Hex       | On bg-base | On card  | Meets 3:1 UI? |
|---------------------|-----------|------------|----------|----------------|
| border-subtle       | #2D2D4A   | 1.8:1      | 1.5:1    | NO (decorative)|
| border-default      | #3D3D5C   | 2.6:1      | 2.1:1    | NO (decorative)|
| border-strong       | #4D4D6A   | 3.4:1      | 2.8:1    | YES on bg-base |
| border-focus        | #4F7DF7   | 5.2:1      | 4.3:1    | YES            |

Note: `border-subtle` and `border-default` are decorative separators, not interactive indicators. Focus rings use `border-focus` which passes 3:1.

---

## Usage Rules

1. **Primary text (#FFFFFF)** — Use on all backgrounds. Always passes.
2. **Secondary text (#9CA3AF)** — Safe on all backgrounds for body text.
3. **Tertiary text (#6B7280)** — Only for captions, timestamps, metadata. Use at 18px+ or as non-critical annotation.
4. **Primary accent (#4F7DF7) as text** — Use on bg-base (5.2:1). On cards, use only for large text or UI elements.
5. **Primary accent as button background** — Use dark text (#0A0A0F) for label, NOT white.
6. **Secondary accent (#F7A94F)** — Always use dark text (#0A0A0F) on amber backgrounds.
7. **Score colors as text** — Excellent and Good pass everywhere. Poor (#EF4444) only passes AA on bg-base; on cards use as badge background with dark or white text.
8. **Score-poor on cards** — Use as background pill with white text inside (white on #EF4444 = 4.0:1, passes AA large). Or use the score-poor-bg tinted background with #EF4444 text.

---

## Color Blindness Considerations

Score colors are NOT distinguished by color alone:
- Score badges always include the numeric value (e.g., "87", "64", "42")
- Radar chart axes are labeled with text
- Comparison table uses icons alongside color (checkmark, dash, cross)
- Charts use patterns/textures in addition to color fills
