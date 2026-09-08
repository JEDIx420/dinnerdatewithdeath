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
   - Dark patterned stone slate floor (`tile_stone_dressing`) with deep violet rug (`rug_dressing`).
   - Ornate Gothic Mirror (`furniture_mirror_ornate`) as hero focal point, carved vanity console (`furniture_vanity`), antique wardrobe (`furniture_wardrobe`), bedside nightstand (`furniture_bedside`), plush armchair (`furniture_armchair`), and tall window with interior-masked rain.
   - Death spawns here in front of his mirror on New Year's Eve, facing north.
2. **Upper Landing & Balustrade Overlook (North-East, x: 448..832, y: 72..288)**:
   - Polished dark mahogany planks (`tile_wood_floor`) with ceremonial burgundy runner (`rug_landing`) edged in antique gold.
   - Wall sconces with soft flickering light halos, aristocratic silhouette portrait (`decor_art_portrait`), and memento mori study (`decor_art_memento_mori`).
   - Carved balustrade overlooking the Great Hall below.

### Connector
3. **Grand Central Staircase (Hero Traversal, x: 560..720, y: 260..548)**:
   - 9 broad stone/dark mahogany steps with stepped treads, deep burgundy runner carpet, and polished brass stair rods.
   - Turned wooden balustrades on both flanks topped with turned newel posts and brass finials.
   - Physical collision barriers along left and right balustrades constrain traversal strictly to the walkable runner.
   - Dynamic camera follow smoothly tracks Death's descent, revealing the immense Great Hall.

### Ground Floor (Public & Intimate Realm)
4. **Great Hall / Central Gallery (Ground Center, x: 448..832, y: 520..920)**:
   - Vast polished dark slate and marble floor (`tile_stone_hall`) centered with a four-point cardinal compass rose medallion (`floor_medallion`).
   - Grand gothic bronze chandelier (`decor_chandelier`) with 6 burning tapers floating overhead at foreground arch depth.
   - Curated fine artwork collection: *Celestial Chart of the Spheres* (`decor_art_celestial`) and *Study of a Distant Battlefield* (`decor_art_battlefield`).
5. **Hero Dining Room (Ground West, x: 48..448, y: 520..920)**:
   - Emotional centerpiece of the game. Dark mahogany wood plank floor with deep crimson velvet area rug (`rug_dining`, 288×256).
   - Hero Banquet Table (`furniture_dining_table`, 176×68) set for two:
     - Rich crimson velvet runner with gold filigree hems.
     - Centerpiece vintage wine bottle with ivory label and cork, plus crystal decanter with crimson wine.
     - Two silver 3-branch candelabras with flickering teardrop flames.
     - Love's setting (left): fine bone china plate with gold rim and crimson well, polished silverware, crystal goblet with red wine, neatly folded ivory linen napkin, and Love's waiting carved high-back chair (`furniture_chair_love`) pulled out slightly.
     - Death's setting (right): matching plate, cutlery, filled wine goblet, folded napkin, and Death's dark gothic chair (`furniture_chair_death`).
     - Wine credenza sideboard (`furniture_sideboard`) along north wall.
6. **Lounge & Hearth Area (Ground East, x: 832..1232, y: 520..920)**:
   - Mahogany plank flooring with fireside velvet rug (`rug_lounge`, 240×208).
   - Carved stone fireplace hearth (`furniture_fireplace`, 96×80) featuring a 4-layer animated hearth fire (crimson outer mantle, orange body, yellow core, pale needle tip) and rising ambient embers.
   - Tufted burgundy velvet sofa (`furniture_sofa`), plush armchair (`furniture_armchair`), coffee table (`furniture_coffee_table`) with leather-bound book and crystal ashtray, tall ancient bookshelf (`furniture_bookshelf`) with multi-colored tome spines, and retro television console (`furniture_tv`).

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

## 6. Title Screen Choreography

The title sequence presents a 0–4.5s staged reveal:
1. **0.0s**: Complete darkness, rain patter audio mood.
2. **0.5s**: Left candle ignites on the banquet table.
3. **1.0s**: First warm light halo expands, illuminating the banquet table surface and place settings.
4. **1.5s**: Second candle ignites on the right; warm glow links across the table.
5. **2.2s**: Tall gothic background windows become visible with interior rain.
6. **2.8s**: Love's empty waiting chair emerges on the left in soft candlelight.
7. **3.5s**: Title typography fades in: "A DINNER DATE WITH DEATH".
8. **4.2s**: Subtitle and blinking interactive prompt appear: "▶ NEW GAME (Press ENTER or SPACE to Begin)".
9. **Skip**: Immediate skip on any user keypress or click to fully revealed state.
