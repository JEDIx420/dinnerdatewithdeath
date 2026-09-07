# Character Asset Pipeline & Normalization Specification

This document details the non-destructive pipeline for converting raw generative character artwork in `art/source/` into runtime production assets under `public/game-assets/`.

---

## 1. Pipeline Principles

1. **Non-Destructive Sourcing**: Raw source images in `art/source/` must never be directly modified, cropped in-place, or overwritten.
2. **Deterministic Manifests**: Regions of interest (walk frames, emotional portraits, actions) are defined in human-readable JSON manifests (`art/manifests/<character>.json`).
3. **Automated Processing**: Scripts under `tools/assets/` parse manifests, extract regions, normalize dimensions, strip backgrounds, and compile uniform runtime sheets.

```
SOURCE SHEET (art/source/...)
    │
    ▼
EXTRACTION MANIFEST (art/manifests/*.json)
    │
    ▼
PROCESSING SCRIPT (tools/assets/*.ts)
    │
    ▼
NORMALIZED RUNTIME ASSET (public/game-assets/...)
```

---

## 2. Overworld Sprite Standard

All primary overworld characters (Death, Love, Fear, The General) share a single runtime animation interface:

- **Frame Cell**: 64 × 64 pixels
- **Sheet Dimensions**: 256 × 256 pixels (4 columns × 4 rows)
- **Animation Rows**:
  - Row 0: `WALK_DOWN` (4 frames)
  - Row 1: `WALK_LEFT` (4 frames)
  - Row 2: `WALK_RIGHT` (4 frames)
  - Row 3: `WALK_UP` (4 frames)

### Runtime Contract
The gameplay engine consumes any character without character-specific animation logic:
```typescript
playWalk(characterId: 'death' | 'love' | 'fear' | 'general', direction: Direction);
```

---

## 3. Frame Normalization Rules

1. **Character-Wide Fixed Scale**: Never scale frames individually. All frames for a given character must use an identical scaling factor to prevent visual jitter.
2. **Ground / Foot Baseline Anchor**: Align every frame along a consistent bottom foot baseline within the 64×64 cell (e.g. Y = 56).
3. **Horizontal Centering**: Center the character's bounding mass horizontally around X = 32.
4. **Padding & Clipping Guard**: Leave a safety border around the sprite to prevent wide poses (swishing coats, raised arms) from clipping into neighboring cells.
5. **Background Removal**:
   - For transparent source sheets (Love, Fear, General): Preserve clean alpha edges.
   - For opaque white source sheets (Death walk sheet): Threshold and remove white/near-white backgrounds cleanly without eroding dark outlines.

---

## 4. Portrait & Expression System

Detailed character sheets contain expressive face artwork. These are extracted into square portrait assets:

- **Dimensions**: 64 × 64 or 80 × 80 pixels.
- **Location**: `public/game-assets/characters/<character>/portraits/<expression>.png`
- **Manifest Mapping**:
```json
{
  "character": "death",
  "portraits": {
    "neutral": "portraits/neutral.png",
    "annoyed": "portraits/annoyed.png",
    "smirk": "portraits/smirk.png",
    "thoughtful": "portraits/thoughtful.png"
  }
}
```

---

## 5. Development Asset Lab (Planned for v0.0.4)

A developer-only debug scene will be provided to visually inspect extracted sheets:
- Step through individual animation frames.
- Toggle ground anchor baseline and 64×64 cell grid lines.
- Preview 4-direction walk cycles at various playback speeds.
