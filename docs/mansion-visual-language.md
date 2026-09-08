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
   - Hero Grand Gothic Bed (`bed03_bed_grand_gothic`), focal vanity and mirror (`bed03_vanity_ornate`) framed by fluted wood columns (`column_wood_fluted`) and carved cornice (`trim_cornice_wood_a`), antique carved wardrobe (`bed03_wardrobe_tall`), bedside nightstand (`bed03_bedside_cabinet`) with surface-attached candelabra fixture (`dining05_candelabra_three_branch`), upholstered crimson armchair (`bed03_armchair_crimson`), and tall gothic window (`env02_window_gothic_tall`) with masked rain.
   - Death spawns here in front of his mirror on New Year's Eve, facing north.
2. **Upper Landing & Balustrade Overlook (North-East, x: 448..832, y: 72..288)**:
   - Polished dark mahogany planks (`floor_wood_planks_dark`) with ceremonial bordered crimson runner (`carpet_crimson_border`).
   - Carved wood wall panels, bronze wall sconce fixtures (`env02_sconce_bronze`) with attached candles, aristocratic silhouette portrait, and memento mori skull study (`art07_paintings_03`).
   - Production turned balustrade overlook (`balustrade_section`) with large newel posts (`newel_post_large`) looking down over the Great Hall below.
   - Clean portal doorway framing (`env02_door_jamb_portal`) opening naturally into the private wing without awkward front-facing doors blocking horizontal passage.

### Connector
3. **Grand Central Staircase (Hero Traversal, x: 560..720, y: 260..548)**:
   - 9 broad steps with production stepped treads (`stair_tread_wide`), crimson stair-runner carpet (`stair_runner_carpet_wide`), polished brass stair rods (`stair_rod_brass`), and stepped stringers (`stair_stringer_step_left/right`).
   - Turned wooden balustrades on both flanks topped with newel posts and brass finials.
   - Physical collision barriers along left and right balustrades constrain traversal strictly to the walkable runner.
   - Dynamic camera follow smoothly tracks Death's descent, revealing the immense Great Hall.

### Ground Floor (Public & Intimate Realm)
4. **Great Hall / Central Gallery (Ground Center, x: 448..832, y: 520..920)**:
   - Vast polished black-veined marble floor (`floor_marble_black_veined`) centered with an octagonal ornamental compass medallion in gold frame (`floor_medallion_octagonal`).
   - Massive stone columns (`column_stone_massive`), pointed gothic arches (`arch_gothic_pointed_stone`), arched bust niche (`wall_niche_bust`), heraldic crests, and classical marble bust sculptures (`hall04_statue_bust_marble`).
   - Grand gothic bronze chandelier (`hall04_chandelier_grand`) with 5 burning tapers floating overhead at foreground structure depth (`6000`), casting light downward.
   - Curated fine artwork collection: *Study of a Distant Tempest* (`art07_paintings_04`) and *Celestial Astrological Chart* (`art07_paintings_01`).
5. **Hero Dining Room (Ground West, x: 48..448, y: 520..920)**:
   - Emotional centerpiece of the game. Dark mahogany wood plank floor (`floor_wood_planks_dark`) with deep crimson velvet area rug (`rug_dining`, 288×256).
   - Rich crimson damask fabric wall panels, gold-framed stone insets, ribbed horizontal moulding, and Corinthian fluted columns (`column_wood_corinthian`).
   - Production Banquet Table (`dining05_table_banquet_runner`) set for two:
     - Crimson velvet table runner with gold filigree hems.
     - Centerpiece silver 3-branch candelabras (`dining05_candelabra_three_branch`) with teardrop flames anchored precisely to wicks.
     - Surface-attached tableware: porcelain dinner plates (`dining05_tableware_02`) and vintage wine bottle / crystal goblet settings (`dining05_tableware_10`).
     - Tufted high-backed dining chairs (`dining05_chair_tufted`) for Love (left) and Death (right).
     - Carved oak sideboard credenza (`dining05_sideboard_oak`) along north wall.
6. **Lounge & Hearth Area (Ground East, x: 832..1232, y: 520..920)**:
   - Dark herringbone parquet flooring (`floor_herringbone_dark`) with fireside velvet rug (`rug_lounge`, 240×208).
   - Recessed stone niche backing, grotesque/shield corbels, gold-accented wood panels, and fluted stone columns (`column_stone_fluted`).
   - Massive carved stone fireplace hearth (`lounge06_fireplace_stone`) with animated hearth fire and rising ember sparks.
   - Tufted burgundy velvet sofa (`lounge06_sofa_ornate`), plush armchair (`lounge06_armchair_velvet`), wooden coffee table (`lounge06_coffee_table_wood`), tall ancient bookshelf with multi-colored tome spines (`lounge06_bookshelf_tall`), and retro console (`lounge06_tv_retro`).
   - Zero naked hovering flames: every candle flame in the mansion is anchored to a physical candlestick, sconce, candelabra, chandelier, or fireplace.

---

## 3. Depth Sorting Standards

All entities and world elements follow standardized depth tiers defined in `src/game/systems/DepthSystem.ts`:

| Layer Name | Z-Index Range | Elements |
|---|---|---|
| `BACKGROUND` | 0 | Room base canvas and nocturnal sky backdrop |
| `FLOOR` | 100 | Hardwood, stone block, and marble floors |
| `FLOOR_DECOR` (`RUGS`) | 200 | Area rugs, runners, compass rose floor medallion |
| `BACK_WALL` | 300 | Structural north wall surfaces, wallpaper, wainscot panels |
| `BACK_WALL_DETAIL` | 400 | Wall-mounted cornices, mouldings, niches, crests, window frames |
| `CONTACT_SHADOWS` | 500 | Soft elliptical grounding shadows for actors and furniture |
| `DYNAMIC_Y_BASE` | 1000..5999 | Actors, furniture, floor-standing columns, newel posts (`depth = 1000 + groundY + offset`) |
| `FOREGROUND_STRUCTURE` | 6000 | True overhead archway headers, balcony fascias, grand chandelier |
| `LIGHTING_OVERLAY` | 8000 | Ambient darkness wash and additive light halos |
| `FOREGROUND_AMBIENT` | 9000 | Floating dust motes, window rain streaks, chimney soot |
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

