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

### Depth & Occlusion System (v0.0.6)
- Defines discrete depth layers (`BACKGROUND`, `FLOOR`, `RUGS`, `CONTACT_SHADOWS`, `DYNAMIC_Y_BASE`, `UPPER_WALLS`, `FOREGROUND_ARCHES`, `LIGHTING_OVERLAY`, `FOREGROUND_AMBIENT`, `UI`).
- Dynamically sorts actors and furniture based on foot baseline Y position (`1000 + y + depthOffset`).

### Lighting & Ambient FX Systems (v0.0.6)
- `LightingSystem`: Manages ambient darkness overlay with soft radial cutouts for candles, fireplace, and moonlit windows, with organic flicker noise.
- `AmbientFXSystem`: Manages floating dust motes in warm light cones, window rain streaks, animated fireplace hearth flames/embers, curtain breezes, and occasional exterior silhouettes.

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
