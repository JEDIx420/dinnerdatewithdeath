# Death's Mansion Visual Language & World Building Specification

This document establishes the canonical visual rules, architectural conventions, depth standards, and ambient systems for Death's mansion in **A Dinner Date with Death**.

---

## 1. Aesthetic Identity & Core Palette

Death's residence is an ancient, lived-in sanctuary of an immortal being who has witnessed millennia of mortal civilization. It is gothic, romantic, sophisticated, lonely, and subtly supernatural—never a generic horror dungeon or dusty ruined castle.

### Palette Family
- **Void & Midnight**: `#07060e`, `#0a0812` (ambient darkness and night sky)
- **Gothic Stone**: `#1c1624`, `#282034`, `#382e46` (walls, pilasters, hearth trim)
- **Deep Velvet**: `#3a0c14`, `#48101a`, `#22122c` (rugs, drapery, upholstery)
- **Dark Mahogany & Oak**: `#1a1214`, `#241416`, `#321e22` (wood plank floors, banquet table, credenza)
- **Candlelight Amber**: `#ffb444`, `#ffa834`, `#ff8c20` (warm flickering light pools)
- **Hearth Flame**: `#e86814`, `#ba2418`, `#ffd038` (crackling fire and embers)
- **Cool Moonlight**: `#5c729a`, `#8aa0b8` (window shafts and rain streaks)
- **Antique Gold & Brass**: `#8a6e2e`, `#9a7a32`, `#bca046` (frames, candelabras, rug borders)

---

## 2. Architectural Proportions & World Geometry

The mansion floor plan is structured as a contiguous, interconnected world (`1152 × 640 px`) comprised of three principal zones:

1. **Dressing / Mirror Area (North-West)**:
   - Dark slate tile floor (`tile_stone_dressing`) with ornate violet rug (`rug_dressing`).
   - Grand gothic mirror (`furniture_mirror_ornate`), carved vanity console, and antique wardrobe.
2. **Grand Dining Hall (Central)**:
   - Dark mahogany wood plank floor (`tile_wood_floor`) with crimson gold-fringed area rug (`rug_dining`).
   - The Hero Dining Table (`furniture_dining_table`, 160×64) set for two: fine porcelain plates, silverware, wine glasses, vintage wine bottle, and candelabras.
   - High-backed chairs for Love (empty) and Death.
   - Tall arched windows showing rainy night sky.
3. **Lounge & Hearth Area (East)**:
   - Hardwood parquet floor with fireside velvet rug (`rug_lounge`).
   - Carved stone fireplace hearth (`furniture_fireplace`, 96×80) with crackling flames.
   - Plush burgundy velvet sofa and armchair, coffee table with book and ashtray, tall ancient bookshelf, and vintage television console.

---

## 3. Depth Sorting Standards

All entities and world elements follow standardized depth tiers defined in `src/game/systems/DepthSystem.ts`:

| Layer Name | Z-Index Range | Elements |
|---|---|---|
| `BACKGROUND` | 0 | Room base canvas and sky backdrop |
| `FLOOR` | 100 | Hardwood and stone tile floors |
| `RUGS` | 200 | Area rugs, velvet runners, floor trims |
| `CONTACT_SHADOWS` | 300 | Soft elliptical grounding shadows for actors and furniture |
| `DYNAMIC_Y_BASE` | 1000..5999 | Actors and depth-sorted furniture (`depth = 1000 + y + anchorOffset`) |
| `UPPER_WALLS` | 6000 | North wall cornice molding, wallpaper, window frames |
| `FOREGROUND_ARCHES`| 7000 | Archway headers, foreground pilasters, chandeliers |
| `LIGHTING_OVERLAY` | 8000 | Ambient darkness wash and light cutouts |
| `FOREGROUND_AMBIENT`| 9000 | Floating dust motes, window rain streaks, exterior silhouettes |
| `UI` | 10000 | Diagnostics overlay, menus, future dialogue boxes |

---

## 4. Player Visual Safe Bounds

To prevent characters from clipping out of the room or through the architectural north wall:
- **Foot Collision Box**: Standardized `32 × 20 px` at offset `(48, 96)` within 128×128 sprite cell.
- **Safe Bounds**: Clamps Death's foot position within `minX: 64, maxX: 1088, minY: 104, maxY: 572`.
- The north wall has visual architectural height (`y = 0..96`). Physical collision stops Death's feet at `y = 104`, ensuring his upper body and head (`~80px` above feet) cleanly overlap the wall face below the cornice molding.

---

## 5. Lighting & Ambient Systems

- **LightingSystem**:
  - Maintains ambient darkness overlay with light sources cutting out darkness and adding warm additive glow halos.
  - Candles feature organic, desynchronized flicker noise.
  - Fireplace hearth provides undulating warm glow.
- **AmbientFXSystem**:
  - **Dust Motes**: Sparse, tiny particles drifting slowly in warm candle light cones.
  - **Fireplace Embers**: Multi-layer flame shapes and rising spark particles.
  - **Window Rain**: Slanted translucent rain streaks masked to gothic window glass.
  - **Window Curtains**: Gentle sinusoidal breeze displacement.
  - **Exterior Silhouettes**: Rare nocturnal bat silhouette traversing window panes every 22–38s.

---

## 6. Future Expansion Interfaces

- **Fireplace State**: Supports `setFireplaceState('idle' | 'surge' | 'portal')` for future Act III arrival sequences.
- **Weather Intensity**: Windows and rain streaks support future transition from calm evening rain into the Act III supernatural storm.
