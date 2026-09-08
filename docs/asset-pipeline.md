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

## 2. Implemented Character: Death (`v0.0.5`)

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
3. **High-Fidelity Lanczos Resampling**: Preserves crisp pixel contours, hair spikes, and facial features using Lanczos3 filtering.
4. **Uniform Character Scale**: Scaled to ~92px character height within a 128 × 128 cell to prevent visual jitter.
5. **Foot Baseline Anchor**: Every frame anchors Death's shoes exactly at `Y = 112` within each 128 × 128 cell, with the bounding box horizontally centered around `X = 64`.

### Production Output
- **Sprite Sheet**: `public/game-assets/characters/death/overworld/walk.png` (512 × 512 PNG, 128 × 128 cells, transparent background).
- **Runtime Manifest**: `public/game-assets/characters/death/manifest.json`:
  - Row 0 (Frames 0–3): `walk_down` (Idle frame: 3)
  - Row 1 (Frames 4–7): `walk_left` (Idle frame: 7)
  - Row 2 (Frames 8–11): `walk_right` (Idle frame: 11)
  - Row 3 (Frames 12–15): `walk_up` (Idle frame: 15)

### Visual QA Artifacts
- Contact preview sheet with 128×128 grid lines and red foot baseline:
  `art/previews/death/death-walk-sheet-preview.png`
- Synchronized 4-direction animated walk GIF:
  `art/previews/death/death-walk-preview.gif`
- Directional strips and individual loop GIFs:
  `art/previews/death/walk_down.gif`, `walk_left.gif`, `walk_right.gif`, `walk_up.gif`

---

## 3. Runtime Contract

Every primary character implements:
- Frame size: 128 × 128 pixels.
- Foot collision body: 32 × 20 pixels at offset `(48, 96)` within the cell.
- Standard 4-direction walk cycles matching `Actor` and `Player` interfaces.

---

## 4. Environment Architecture Pipeline (`v0.0.6.2`)

### Source Assets
- Source file: `art/source/environment/mansion/DDWD_ENV_01 — Mansion Architecture.png` (1448 × 1086 RGBA, transparent background).
- Manifest: `art/manifests/mansion-architecture.json`.

### Pipeline Execution
Regenerate all architectural assets and the contact sheet preview with:
```bash
npm run assets:mansion-architecture
```
Or execute both character and environment pipelines:
```bash
npm run assets
```

### Extraction Architecture & Categorization
The source sheet contains 80 distinct components organized across 7 functional categories:
1. `floors` (13): Mahogany planks, dark herringbone, black veined marble, slate/ashlar blocks, ornamental inlays, borders, and large octagonal compass medallion.
2. `carpets` (2): Crimson damask bordered rugs and runners.
3. `walls` (12): Horizontal wood panels, crimson damask insets, ashlar masonry, coffered wainscot, fleur panels, and arched bust niche.
4. `trims` (9): Heavy dentil and egg-and-dart cornices, acanthus friezes, horizontal mouldings, and corner profiles.
5. `columns_arches` (17): Corinthian, fluted, and Solomonic columns; pointed gothic arches, foliate spandrels, and grotesque/leaf corbels.
6. `stairs_balustrade` (15): Stepped treads, crimson runners, brass carpet rods, stringers, turned balustrade rails, and newel posts with finials.
7. `ornaments` (12): Fleur-de-lis carvings, heraldic crests, rosette ceiling bosses, and medallions.

### Production Output
- Individual cropped PNGs placed under `public/game-assets/environment/mansion/architecture/<category>/<id>.png`.
- High-resolution QA Contact Sheet: `art/previews/environment/mansion/architecture/contact-sheet.png`.

