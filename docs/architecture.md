# Architecture & Technical Design

## 1. Architectural Philosophy

**A Dinner Date with Death** is engineered around three guiding principles:
1. **Small Codebase**: Avoid boilerplate-heavy frameworks or unnecessary game engine bloat.
2. **Decoupled Content**: Story dialogue, cutscenes, and character portraits are data-driven. Adding a new scene should require authoring content data, not writing 500 lines of Phaser scene code.
3. **Crisp Pixel Presentation**: Strict pixel-art rendering rules, centralized resolution, and responsive letterboxing.

---

## 2. Directory Layout

```
src/
  main.ts                  # Entrypoint: instantiates Phaser.Game with all scenes
  style.css                # Minimal dark canvas viewport wrapper

  game/
    constants.ts         # Core logical resolution (768x432), tile units (32px), cell sizes (128px)
    config.ts            # Phaser GameConfig with Scale.FIT, pixelArt: true, roundPixels: true
    scenes/
      BootScene.ts         # Procedural texture compilation & asset preloading
      TitleScene.ts        # Cinematic gothic opening scene & New Game prompt
      MansionScene.ts      # Contiguous 3-zone mansion environment with camera tracking & Visual QA
      AssetLabScene.ts     # Developer QA scene for inspecting character assets
    entities/
      CharacterManifest.ts # Type schemas for character metadata and animations
      deathManifest.ts     # Compiled runtime manifest for Death
      Actor.ts             # Base overworld character sprite with facing, walk cycles & contact shadow
      Player.ts            # Player entity enforcing safe bounds & movement input
    world/
      RoomDefinition.ts    # Data-driven definitions for room geometry, furniture, lights, safe bounds
      MansionRoom.ts       # Room builder instantiating floors, walls, furniture colliders, and zones
      MansionTextures.ts   # Procedural gothic texture library (floors, walls, furniture, shadows, glow)
    systems/
      InputManager.ts      # Abstract action mapper (keyboard / future touch)
      DepthSystem.ts       # Centralized depth layering constants & dynamic Y-depth calculation
      LightingSystem.ts    # Ambient darkness overlay & candle/hearth light cutouts
      AmbientFXSystem.ts   # Ambient dust motes, window rain, fireplace flames, and exterior silhouettes

  content/                 # Future narrative data files (pure JSON / TypeScript)
    characters/            # Manifests mapping expressions to portrait files
    dialogue/              # Branching dialogue node trees
    cutscenes/             # Sequential command scripts
    story/                 # Act definitions and checkpoint flags
```

---

## 3. Subsystem Boundaries

### InputManager (v0.0.3)
- Maps physical keys (WASD, Arrows, Enter, Space, Z, Escape, X) to abstract actions (`UP`, `DOWN`, `LEFT`, `RIGHT`, `CONFIRM`, `CANCEL`, `PAUSE`).
- Provides synthetic action setters so mobile touch D-pads and on-screen buttons can feed the exact same action pipeline.

### Actor & Player Runtime Abstraction (v0.0.6)
- `Actor`: Standardized character sprite wrapping Phaser Arcade physics. Manages facing direction (`down`, `left`, `right`, `up`), walk animation playback, idle frame holding, 32×20 foot-level collision box, and attached grounding contact shadow.
- `Player`: Combines `Actor` with `InputManager` to provide normalized 4-direction walking at 150 px/sec and enforces visual safe bounds to prevent character clipping.

### World & Environment Architecture (v0.0.6)
- `RoomDefinition`: Data-driven schema for multi-zone mansion rooms containing floors, architectural walls, furniture with custom collision boxes, windows, candles, and safe bounds.
- `MansionRoom`: Assembles geometry, registers physics colliders, and integrates lighting/ambient systems.
- `MansionTextures`: Generates high-detail procedural gothic textures without external image bloat.

### Depth & Occlusion System (v0.0.6.3)
- Defines discrete semantic depth layers:
  - `BACKGROUND (0)`: Black void background
  - `FLOOR (100)`: Stone, wood, and marble floors
  - `FLOOR_DECOR / RUGS (200)`: Rugs, ceremonial carpets, threshold medallions
  - `BACK_WALL (300)`: Structural north wall surfaces, wallpaper, wainscot panel fields
  - `BACK_WALL_DETAIL (400)`: Cornices, mouldings, wall niches, crests, window frames
  - `CONTACT_SHADOWS (500)`: Grounding elliptical contact shadows
  - `DYNAMIC_Y_BASE (1000)`: Ground-standing dynamic entities sorted by ground anchor foot Y (`1000 + groundY`)
  - `FOREGROUND_STRUCTURE / FOREGROUND_ARCHES (6000)`: Overhead arch headers, balcony fascias, chandeliers
  - `LIGHTING_OVERLAY (8000)`: Ambient darkness overlay with lighting cutouts
  - `FOREGROUND_AMBIENT (9000)`: Floating dust motes, storm flashes
  - `UI (10000)`: HUD, dialogue box, QA overlay
- Supports programmatic depth resolution via `resolveDepthForClass(depthClass, groundY, subLayerOffset)`.

### Environment & World Composition Architecture (v0.0.6.4)
- `EnvironmentAssetCatalog`: Standardized metadata catalog for 568 modular architectural, furniture, and prop assets across 9 texture packs. Defines native dimensions, texture keys/atlas frames, anchor presets (`bottom-center`, `top-left`, etc.), depth classes, physical classes (`none`, `floor-solid`, `barrier`, `overhead`), collision profiles, light sockets, window masks, and surface regions.
- `CollisionProfile`: Decouples visual graphic size (e.g. 73×160 massive column, 149×287 wardrobe) from physical collision footprint (e.g. 44×22 at ground base Y - 10), preventing player clipping while allowing free movement around architectural features and furnishings.
- `SymmetryHelpers`: Mathematical layout functions (`placeMirroredPair`, `placeRepeatedSpan`, `frameOpening`) guaranteeing exact symmetry around the central mansion axis `X = 640`.
- `EnvironmentComposer`: Instantiates Phaser sprites from placement descriptors or atlas frames, calculates exact ground/sort anchors, resolves parent-relative surface attachments (`parentPlacementId`, `surfaceName`), applies semantic depth sorting, and creates Arcade physics static zone colliders.
- `LightFixtureSystem`: Inspects physical fixtures (candelabras, sconces, chandeliers, fireplace hearth), transforms local `lightSockets` across sprite origin/scale/flip, adds dynamic lights to `LightingSystem`, and attaches animated desynchronized micro-flicker flame sprites (`decor_flame_teardrop`). Zero naked floating flames.
- `WindowSystem`: Coordinates gothic window panes, interior rain masks registered with `AmbientFXSystem`, and subtle moonlight halos.
- `WorldCompositionDebug`: Visual diagnostic tool toggled via `[V]` or `?debug=world` rendering collision footprints (green), ground sort anchors (yellow), sprite origins (cyan), light sockets (blue), surface attachment bounds (orange), and the symmetry axis (magenta).

### Lighting & Ambient FX Systems (v0.0.6.4)
- `LightingSystem`: Manages ambient darkness overlay with soft radial cutouts for fixtures and moonlit windows, with organic flicker noise.
- `AmbientFXSystem`: Manages floating dust motes clustered in warm light zones, window rain streaks constrained by geometry masks, animated fireplace hearth flames/embers, and exterior silhouettes.

### InteractionSystem (Planned for v0.0.7)
- Evaluates the tile or object directly in front of the player based on facing direction.
- Dispatches interaction triggers to inspectable objects (mirrors, dinner table, wine bottle) or characters.

### DialogueSystem (Planned for v0.0.7)
- Consumes structured dialogue nodes and renders text with a typewriter effect and expressive character portraits.

### Character Portrait System (Planned for v0.0.8)
- Maps logical expressions (`death + annoyed`, `love + amused`, `fear + manic`) to extracted portrait assets via character manifests.

### CutsceneRunner (Planned for v0.0.9)
- Executes sequential asynchronous commands using promises without callback spaghetti.

### AudioManager (Planned for v0.1)
- Manages background music tracks and sound effects with graceful fading and browser autoplay compliance.

### SaveManager (Planned for v0.1)
- Persists narrative progress and choices to browser `localStorage`.
