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

The mansion floor plan is structured as a vertical narrative journey across two levels (`1280 × 960 px` / 40 × 30 tiles of 32px), comprising five distinct story-driven zones connected by a hero central staircase:

### Upper Floor (Private Realm)
1. **Death's Bedchamber / Dressing Chamber (North-West, x: 48..448, y: 72..320)**:
   - Dark patterned stone blocks floor (`floor_stone_blocks_dark`) with deep violet rug (`rug_dressing`).
   - Ornate Gothic Mirror (`dressing_mirror`) framed by fluted wood columns (`column_wood_fluted`), egg-and-dart carved cornice (`trim_cornice_wood_a`), and fleur-de-lis wall ornament (`ornament_fleur_de_lis`). Carved vanity console, antique wardrobe, bedside nightstand, armchair, and tall window with interior-masked rain.
   - Death spawns here in front of his mirror on New Year's Eve, facing north.
2. **Upper Landing & Balustrade Overlook (North-East, x: 448..832, y: 72..288)**:
   - Polished dark mahogany planks (`floor_wood_planks_dark`) with ceremonial bordered crimson runner (`carpet_crimson_border`).
   - Carved wood wall panels (`wall_panel_fleur_ornate`, `wall_panel_fleur_small`), studded cornice moulding (`trim_cornice_studded`), wall sconces with soft flickering light halos, aristocratic silhouette portrait, and memento mori study.
   - Production turned balustrade overlook (`balustrade_section`) with large newel posts (`newel_post_large`) looking down over the Great Hall below.

### Connector
3. **Grand Central Staircase (Hero Traversal, x: 560..720, y: 260..548)**:
   - 9 broad steps with production stepped treads (`stair_tread_wide`), crimson stair-runner carpet (`stair_runner_carpet_wide`), polished brass stair rods (`stair_rod_brass`), and stepped stringers (`stair_stringer_step_left/right`).
   - Turned wooden balustrades on both flanks topped with newel posts and brass finials.
   - Physical collision barriers along left and right balustrades constrain traversal strictly to the walkable runner.
   - Dynamic camera follow smoothly tracks Death's descent, revealing the immense Great Hall.

### Ground Floor (Public & Intimate Realm)
4. **Great Hall / Central Gallery (Ground Center, x: 448..832, y: 520..920)**:
   - Vast polished black-veined marble floor (`floor_marble_black_veined`) centered with an octagonal ornamental compass medallion in gold frame (`floor_medallion_octagonal`).
   - Massive stone columns (`column_stone_massive`), pointed gothic arches (`arch_gothic_pointed_stone`), foliate spandrels (`arch_spandrel_left/right`), arched bust niche (`wall_niche_bust`), and heraldic crest (`ornament_foliage_crest_a`).
   - Grand gothic bronze chandelier (`decor_chandelier`) with 6 burning tapers floating overhead at foreground arch depth.
   - Curated fine artwork collection: *Celestial Chart of the Spheres* and *Study of a Distant Battlefield*.
5. **Hero Dining Room (Ground West, x: 48..448, y: 520..920)**:
   - Emotional centerpiece of the game. Dark mahogany wood plank floor (`floor_wood_planks_dark`) with deep crimson velvet area rug (`rug_dining`, 288×256).
   - Rich crimson damask fabric wall panels (`wall_panel_damask_crimson`), gold-framed stone insets (`wall_panel_stone_framed_gold`), ribbed horizontal moulding (`trim_moulding_ribbed_h`), and Corinthian fluted columns (`column_wood_corinthian`).
   - Hero Banquet Table (`dining_table`, 176×68) set for two:
     - Rich crimson velvet runner with gold filigree hems.
     - Centerpiece vintage wine bottle with ivory label and cork, plus crystal decanter with crimson wine.
     - Two silver 3-branch candelabras with flickering teardrop flames.
     - Love's setting (left): fine bone china plate with gold rim and crimson well, polished silverware, crystal goblet with red wine, neatly folded ivory linen napkin, and Love's waiting carved high-back chair pulled out slightly.
     - Death's setting (right): matching plate, cutlery, filled wine goblet, folded napkin, and Death's dark gothic chair.
     - Wine credenza sideboard along north wall.
6. **Lounge & Hearth Area (Ground East, x: 832..1232, y: 520..920)**:
   - Dark herringbone parquet flooring (`floor_herringbone_dark`) with fireside velvet rug (`rug_lounge`, 240×208).
   - Recessed stone niche backing (`wall_niche_empty`), ornate grotesque/shield corbels (`corbel_shield_fleur`, `corbel_ornate_foliage`), gold-accented wood panels (`panel_inset_wood_gold`), and fluted stone columns (`column_stone_fluted`).
   - Carved stone fireplace hearth featuring a 4-layer animated hearth fire and rising ambient embers.
   - Tufted burgundy velvet sofa, plush armchair, coffee table with leather-bound book and crystal ashtray, tall ancient bookshelf with multi-colored tome spines, and retro television console.

---

## 3. Depth Sorting Standards

All entities and world elements follow standardized depth tiers defined in `src/game/systems/DepthSystem.ts`:

| Layer Name | Z-Index Range | Elements |
|---|---|---|
| `BACKGROUND` | 0 | Room base canvas and nocturnal sky backdrop |
| `FLOOR` | 100 | Hardwood and stone tile floors |
| `RUGS` | 200 | Area rugs, runners, compass rose floor medallion |
| `CONTACT_SHADOWS` | 300 | Soft elliptical grounding shadows for actors and furniture |
| `DYNAMIC_Y_BASE` | 1000..5999 | Actors, staircase steps, and depth-sorted furniture (`depth = 1000 + y + anchorOffset`) |
| `UPPER_WALLS` | 6000 | North wall cornice molding, wallpaper, window frames |
| `FOREGROUND_ARCHES`| 7000 | Overhead grand chandelier, archway headers, pilaster capitals |
| `LIGHTING_OVERLAY` | 8000 | Ambient darkness wash and additive light halos |
| `FOREGROUND_AMBIENT`| 9000 | Floating dust motes, window rain streaks, chimney soot |
| `UI` | 10000 | Diagnostics overlay, menus, title typography |

---

## 4. Player Visual Safe Bounds & Physics

To prevent characters from clipping out of the room or through the architectural north wall:
- **Foot Collision Box**: Standardized `32 × 20 px` at offset `(48, 96)` within 128×128 sprite cell.
- **Physics World Bounds**: Configured to `(0, 0, 1280, 960)`.
- **Safe Bounds**: Clamps Death's foot position within `minX: 48, maxX: 1232, minY: 72, maxY: 912`.
- **Dynamic Occlusion**: Walking behind the Banquet Table (`y = 660`) sorts Death (`depth = 1708`) behind the table (`depth = 1736`), allowing his torso and head to peek over the table while the lower body is occluded by the table surface and place settings.

---

## 5. Lighting & Ambient Systems

- **LightingSystem**:
  - Restrained, soft radial glow halos (`light_glow_warm`, `light_glow_fire`, `light_glow_cool`, radius: ~44px) eliminate harsh stepped concentric disc artifacts.
  - Smooth ambient darkness wash (`0x07060e` at 0.72 alpha) over the mansion with soft circular aperture cutouts.
  - Distant lightning flash controller (`triggerLightning()`) generating 1–2 rapid flashes every 14–28 seconds.
- **Tapered Teardrop Candle Flames**:
  - Custom pixel-art flame geometry (`decor_flame_teardrop`, 6×12 px) with bright yellow/white core, amber body, and warm outer rim.
  - Desynchronized micro-flicker and subtle horizontal sway (`scaleX: 0.9..1.1`, `scaleY: 0.88..1.12`, `x: ±0.75px`).
- **AmbientFXSystem**:
  - **Window Rain Containment**: Rain streaks are strictly clipped to interior window glass using Phaser GPU geometry masks (`createGeometryMask`), preventing rain streaks from bleeding onto wallpaper or moldings.
  - **4-Layer Animated Fireplace Fire**: Layered animated polygons with independent sinusoidal frequencies, plus rising floating ember sparks.
  - **Zoned Ambient Dust Motes**: 60 floating ambient motes with room-appropriate drift and alpha pulsing across all 5 story zones.
  - **Window Curtains**: Gentle sinusoidal breeze displacement.

---

## 6. Title Screen Choreography & Storm Experience (v0.0.6.3)

The title sequence delivers an immediate, fast-first-impression staged reveal (~1.65s unskipped) that avoids blank screens while establishing the gothic, storm-tossed nocturnal mood:

1. **0.00s (Immediate First Impression)**: Faint gothic window silhouettes, table silhouette, and active interior window rain are immediately readable within the first frame (no dead black canvas).
2. **0.12s (Hero Lightning Bolt)**: Multi-phase layered procedural lightning bolt cuts across the upper atmosphere, momentarily illuminating the architecture and storm with electrical white/blue glow.
3. **0.25s**: Left candle ignites sharply on the banquet table; warm radial bloom begins.
4. **0.45s**: Banquet table surface, runner, and place settings reveal cleanly.
5. **0.60s**: Second candle ignites on the right; warm glowing pools connect across the table.
6. **0.75s**: Title typography ("A DINNER DATE WITH DEATH") emerges with a subtle 3px upward settle.
7. **1.05s**: Love's and Death's high-backed chairs settle into gothic silhouettes; secondary distant lightning fork strikes near left window.
8. **1.40s**: Interactive prompt ("▶ NEW GAME") and instruction text appear.
9. **1.65s**: Intro complete; prompts begin gentle sinusoidal breathing; idle atmospheric storm loop armed (strikes every 5–11s; 55% distant, 35% medium, 10% hero).
10. **Skip & Transition**:
    - First click/confirm during intro instantly skips to the completed title screen.
    - Second click/confirm smoothly starts the game with a snappy 400ms fade transition into `MansionScene`.
    - Developer QA: `?intro=skip` skips directly on load; pressing `[T]` triggers a hero strike on demand.

