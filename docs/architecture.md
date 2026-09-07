# Architecture & Technical Design

## 1. Architectural Philosophy

**A Dinner Date with Death** is engineered around three guiding principles:
1. **Small Codebase**: Avoid boilerplate-heavy frameworks or unnecessary game engine bloat.
2. **Decoupled Content**: Story dialogue, cutscenes, and character portraits are data-driven. Adding a new scene should require writing content data, not authoring 500 lines of Phaser scene code.
3. **Crisp Pixel Presentation**: Strict pixel-art rendering rules, centralized resolution, and responsive letterboxing.

---

## 2. Directory Layout

```
src/
  main.ts                  # Entrypoint: instantiates Phaser.Game
  style.css                # Minimal dark canvas viewport wrapper

  game/
    config.ts              # Virtual resolution (384x216), pixelArt, arcade physics
    scenes/
      BootScene.ts         # Asset loading & procedural test texture generation
      TitleScene.ts        # Title screen & New Game start
      PrototypeScene.ts    # Collision, movement, & camera validation room
    systems/
      InputManager.ts      # Abstract action mapper (keyboard / future touch)

  content/                 # Future narrative data files (pure JSON / TypeScript)
    characters/            # Manifests mapping expressions to portrait files
    dialogue/              # Branching dialogue node trees
    cutscenes/             # Sequential command scripts
    story/                 # Act definitions and checkpoint flags
```

---

## 3. Subsystem Boundaries (Roadmap)

### InputManager (Implemented in v0.0.3)
- Maps physical keys (WASD, Arrows, Enter, Space, Z, Escape, X) to abstract actions (`UP`, `DOWN`, `LEFT`, `RIGHT`, `CONFIRM`, `CANCEL`, `PAUSE`).
- Provides synthetic action setters so mobile touch D-pads and on-screen A/B buttons can feed the exact same action pipeline.

### InteractionSystem (Planned for v0.0.5)
- Evaluates the tile or object directly in front of the player based on facing direction.
- Dispatches interaction triggers to inspectable objects (mirrors, dinner table, wine bottle) or characters without hardcoding object callbacks in the movement loop.

### DialogueSystem (Planned for v0.0.5)
- Consumes structured dialogue nodes:
```json
{
  "id": "fear_entrance",
  "speaker": "fear",
  "expression": "smirk",
  "text": "The General called a meeting. Love's still not here.",
  "choices": [
    { "text": "Ask what happened.", "next": "fear_explains" },
    { "text": "Ignore him.", "set": { "avoidance": 1 }, "next": "fear_pushes" }
  ]
}
```
- Renders text incrementally with a typewriter effect and displays character portraits mapped by logical expression.

### CutsceneRunner (Planned for v0.0.7)
- Executes sequential asynchronous commands using promises:
```json
[
  { "action": "lockPlayer" },
  { "action": "walk", "actor": "fear", "to": [12, 7] },
  { "action": "face", "actor": "fear", "direction": "left" },
  { "action": "dialogue", "id": "fear_entrance" },
  { "action": "wait", "ms": 500 },
  { "action": "unlockPlayer" }
]
```
- Guarantees sequential execution without nested callback spaghetti.

### Character Portrait System (Planned for v0.0.6)
- Maps logical expressions (`death + annoyed`, `love + amused`, `fear + manic`) to extracted portrait assets via character manifests.
- Prevents narrative scripts from depending on explicit image paths.

### AudioManager (Planned for v0.1)
- Manages background music tracks and sound effects with graceful fading.
- Respects browser autoplay restrictions by initializing or resuming the audio context upon the first user interaction (Title Screen "NEW GAME").

### SaveManager (Planned for v0.1)
- Persists narrative progress to browser `localStorage`:
```json
{
  "version": 1,
  "checkpoint": "act1_the_waiting_table",
  "flags": { "examined_mirror": true, "spoke_to_fear": true },
  "choices": { "fear_attitude": "cold" },
  "settings": { "musicVolume": 0.8, "sfxVolume": 1.0 }
}
```
- Never serializes live Phaser game objects or engine internals.
