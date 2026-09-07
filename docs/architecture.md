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
    config.ts              # Virtual resolution (384x216), pixelArt, arcade physics
    scenes/
      BootScene.ts         # Asset loading & animation registration
      TitleScene.ts        # Title screen & New Game start (L key -> Asset Lab)
      PrototypeScene.ts    # Main prototype room with Player and collision bounds
      AssetLabScene.ts     # Developer QA scene for inspecting character assets
    entities/
      CharacterManifest.ts # Type schemas for character metadata and animations
      deathManifest.ts     # Compiled runtime manifest for Death
      Actor.ts             # Base overworld character sprite with facing & walk cycles
      Player.ts            # Player entity mapping InputManager to Actor movement
    systems/
      InputManager.ts      # Abstract action mapper (keyboard / future touch)

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

### Actor & Player Runtime Abstraction (v0.0.4)
- `Actor`: Standardized character sprite wrapping Phaser Arcade physics. Manages facing direction (`down`, `left`, `right`, `up`), walk animation playback, and idle frame holding. Establishes a 16×10 foot-level collision box.
- `Player`: Combines `Actor` with `InputManager` to provide normalized 4-direction walking at 75 px/sec.

### Asset Pipeline (v0.0.4)
- Non-destructive processing in `tools/assets/` consumes `art/manifests/*.json` and `art/source/` to produce production assets in `public/game-assets/` and QA previews in `art/previews/`.

### InteractionSystem (Planned for v0.0.5)
- Evaluates the tile or object directly in front of the player based on facing direction.
- Dispatches interaction triggers to inspectable objects (mirrors, dinner table, wine bottle) or characters.

### DialogueSystem (Planned for v0.0.5)
- Consumes structured dialogue nodes and renders text with a typewriter effect and expressive character portraits.

### CutsceneRunner (Planned for v0.0.7)
- Executes sequential asynchronous commands using promises without callback spaghetti.

### Character Portrait System (Planned for v0.0.6)
- Maps logical expressions (`death + annoyed`, `love + amused`, `fear + manic`) to extracted portrait assets via character manifests.

### AudioManager (Planned for v0.1)
- Manages background music tracks and sound effects with graceful fading and browser autoplay compliance.

### SaveManager (Planned for v0.1)
- Persists narrative progress and choices to browser `localStorage`.
