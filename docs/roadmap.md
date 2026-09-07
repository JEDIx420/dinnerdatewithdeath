# Production Roadmap & Milestones

This document tracks engineering and narrative production milestones for **A Dinner Date with Death**.

---

## Completed Milestones

### `v0.0.1` — Engine Initialization ✅
- Phaser 3, TypeScript, and Vite configured.
- ESLint, Prettier, and Vitest established.
- Strict TypeScript compilation and verification command (`npm run verify`).

### `v0.0.2` — GitHub Pages CI & Deployment ✅
- GitHub Pages enabled via workflow build type.
- GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) deploying `dist/` on push to `main`.
- Live and verified at [https://jedix420.github.io/dinnerdatewithdeath/](https://jedix420.github.io/dinnerdatewithdeath/).

### `v0.0.3` — Prototype Room & Input Abstraction ✅
- Centralized logical resolution (384 × 216) with pixel-art integer scaling and letterboxing.
- `InputManager` abstracting directional and action inputs.
- Prototype room with perimeter wall boundaries, multiple test obstacles (dining table, mirror, candelabra pillar).

### `v0.0.4` — Character Asset Pipeline & Death Overworld Sprite ✅
- Deterministic extraction tool in `tools/assets/process-death.ts` driven by `art/manifests/death.json`.
- Halo-free background removal and uniform foot baseline alignment (`Y=56`) in 64×64 cells.
- Generated production sprite sheet (`public/game-assets/characters/death/overworld/walk.png`) and runtime manifest.
- Reusable `Actor` and `Player` entities replacing the temporary prototype marker with Death's animated sprite.
- Visual QA preview sheets and animated GIFs in `art/previews/death/`.
- Developer Asset Lab scene (`AssetLabScene.ts`) for interactive visual inspection (`[L]` key or `?scene=asset-lab`).

---

## Upcoming Milestones

### `v0.0.5` — Object Interaction & Basic Dialogue
- Interaction raycasting: inspect mirror, inspect dining table, inspect phone.
- Dialogue box UI with typewriter text rendering and confirm-to-advance input.

### `v0.0.6` — Expressive Portrait System
- Crop and normalize character expressions from `detailed-source.png`.
- Character manifest mapping logical emotional states (`neutral`, `annoyed`, `smirking`, `pensive`) to dialogue portrait displays.

### `v0.0.7` — Cutscene Runner & Fear Entrance
- Promise-based sequential cutscene runner.
- Scripted event: Fear materializes, walks into the room, faces Death, and initiates conversation.

### `v0.1` — Vertical Slice: "The Waiting Table"
- Complete Act I playable slice:
  - Death explores mansion room on New Year's Eve.
  - Fear arrives with disturbing news regarding The General.
  - Dialogue and emotional tone established.
  - Audio integration (Death's theme, ambient mansion soundscape).
  - Transition trigger into Death's flashback memory.

### `v0.2` — Act II: The Cemetery & How Death Met Love
- Exterior cemetery environment.
- Love's overworld sprite and expressive portraits.
- The meeting on the tombstone.

### `v0.3` — Act III: The Dinner Interrupted
- The feast in the mansion.
- The tremor and fire effects.
- The General arrives with his pitch.

### `v0.4` — Act IV: Defiance & The New Year
- Love refuses The General.
- Death makes his choice, rebuking Fear and rejecting The General.
- The ejection and New Year transition.

### `v0.5` — Full Story Playable Alpha
- Complete end-to-end playthrough of all 32 story beats.

### `v0.9` — Audio, Visual Polish & Performance QA
- Sound design, particle polish, mobile touch QA, and final tuning.

### `v1.0` — Public Release
- Polished, web-native release on GitHub Pages.
