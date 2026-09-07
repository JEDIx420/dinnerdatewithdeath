# Character Asset Pipeline & Normalization Specification

This document details the deterministic, non-destructive pipeline for converting raw character artwork in `art/source/` into runtime production assets under `public/game-assets/`.

---

## 1. Pipeline Principles

1. **Non-Destructive Sourcing**: Raw source images in `art/source/` must never be modified, cropped in-place, or overwritten.
2. **Deterministic Manifests**: Regions of interest, background thresholds, and directional mappings are defined in human-readable JSON manifests (`art/manifests/<character>.json`).
3. **Automated Processing**: Scripts under `tools/assets/` parse manifests, extract frames, remove background halos, normalize dimensions, align baselines, and compile uniform runtime sheets.
4. **Committed Derived Assets**: Derived production assets (`public/game-assets/`) and QA previews (`art/previews/`) are generated deterministically and committed to version control so GitHub Pages and other agents can inspect stable output diffs without requiring local image processing.

```
SOURCE SHEET (art/source/characters/<name>/...)
    │
    ▼
EXTRACTION MANIFEST (art/manifests/<name>.json)
    │
    ▼
PROCESSING SCRIPT (tools/assets/process-<name>.ts)
    │
    ▼
RUNTIME ASSET (public/game-assets/characters/<name>/...)
    +
QA PREVIEWS (art/previews/<name>/...)
```

---

## 2. Implemented Character: Death (`v0.0.4`)

### Source Assets
- Source file: `art/source/characters/death/walk-source.png` (1254 × 1254, 4×4 nominal arrangement).
- Manifest: `art/manifests/death.json`.

### Pipeline Execution
Regenerate Death's production assets and QA previews with:
```bash
npm run assets:death
```

### Background Removal & Normalization
1. **Halo-Free Flood Fill**: 8-connected flood fill from image borders with a threshold of 185 eliminates grey anti-aliasing rings around Death's jet-black spiky hair while completely preserving pale skin tones (`RGB ~ 180-195`), white eye highlights, and collar details.
2. **Artifact Cleaning**: Cleans residual generative noise below Row 2's foot level.
3. **Uniform Character Scale**: A single scaling factor (`0.1643`) is applied across all 16 frames to prevent visual jitter.
4. **Foot Baseline Anchor**: Every frame anchors Death's shoes exactly at `Y = 56` within each 64×64 cell, with the bounding box horizontally centered around `X = 32`.

### Production Output
- **Sprite Sheet**: `public/game-assets/characters/death/overworld/walk.png` (256 × 256 PNG, 64 × 64 cells, transparent background).
- **Runtime Manifest**: `public/game-assets/characters/death/manifest.json`:
  - Row 0 (Frames 0–3): `walk_down` (Idle frame: 3)
  - Row 1 (Frames 4–7): `walk_left` (Idle frame: 7)
  - Row 2 (Frames 8–11): `walk_right` (Idle frame: 11)
  - Row 3 (Frames 12–15): `walk_up` (Idle frame: 15)

### Visual QA Artifacts
- Contact preview sheet with 64×64 grid lines and red foot baseline:
  `art/previews/death/death-walk-sheet-preview.png`
- Synchronized 4-direction animated walk GIF:
  `art/previews/death/death-walk-preview.gif`
- Directional strips and individual loop GIFs:
  `art/previews/death/walk_down.gif`, `walk_left.gif`, `walk_right.gif`, `walk_up.gif`

---

## 3. Runtime Contract

Every primary character implements:
- Frame size: 64 × 64 pixels.
- Foot collision body: 16 × 10 pixels at offset `(24, 48)` within the cell.
- Standard 4-direction walk cycles matching `Actor` and `Player` interfaces.
