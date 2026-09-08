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
- Halo-free background removal and uniform foot baseline alignment.
- Generated production sprite sheet (`public/game-assets/characters/death/overworld/walk.png`) and runtime manifest.
- Reusable `Actor` and `Player` entities replacing the temporary prototype marker with Death's animated sprite.
- Visual QA preview sheets and animated GIFs in `art/previews/death/`.
- Developer Asset Lab scene (`AssetLabScene.ts`) for interactive visual inspection (`[L]` key or `?scene=asset-lab`).

### `v0.0.5` — Visual Foundation & HD Rendering Pass ✅
- Upgraded logical virtual resolution to 768 × 432 (exact 2× integer scale of 384 × 216, preserving 16:9).
- Upgraded overworld tile standard from 16px to 32px.
- Upgraded Death's overworld cell format to 128 × 128 (512 × 512 sheet, ~92px visual height, foot baseline Y=112) with high-fidelity Lanczos3 filtering.
- Modernized typography with scaled serif and monospace font stacks (28px title, 18px body, 15px subtitle).
- Integrated non-intrusive Visual QA overlay (`?debug=visual` or `V` key) displaying live viewport dimensions, scaling factor, logical coords, and rendering settings.
- Player title screen cleaned of developer affordances while preserving dev shortcut (`L` key).
- Documented blur root cause analysis and mitigation in `docs/visual-foundation.md`.

### `v0.0.6` — Title Experience & Mansion Visual Foundation ✅
- Solved player visual boundary clipping by separating physical obstacle collision from room visual safe bounds.
- Replaced prototype title screen with a cinematic gothic opening scene: dark dining hall, tall windows with rain, the waiting table set for two, flickering candelabras, tracked serif typography, and smooth fade transition into gameplay.
- Built initial 3-zone mansion environment (`1152 × 640 px`).
- Created data-driven environment architecture in `src/game/world/`.
- Established spatial depth sorting (`DepthSystem.ts`).
- Added grounding contact shadows for Death and furniture.
- Implemented initial ambient lighting overlay (`LightingSystem.ts`) and `AmbientFXSystem.ts`.

### `v0.0.6.1` — The Grand Mansion: Story-Driven Spatial & Visual Polish ✅
- Replaced flat procedural layout with an ancient, grand two-level gothic residence (`1280 × 960 px`) structured around a vertical narrative journey across 5 story-driven zones.
- **Upper Floor (Private Realm)**: Death's Bedchamber (grand ornate gothic mirror focal point, vanity console, antique wardrobe, nightstand, armchair, private violet rug, tall window with interior rain, New Year's Eve spawn point) and Upper Landing / Balustrade Overlook (ceremonial runner, wall sconces, aristocratic portrait, memento mori).
- **Connector**: Grand Central Staircase (hero feature with 9 stone/mahogany stepped treads, deep burgundy runner with brass rods, turned balustrades with physics barriers strictly keeping Death on the flight).
- **Ground Floor**: Great Hall / Central Gallery (vast slate/marble floor, cardinal compass medallion, overhead 6-taper bronze chandelier, celestial chart and battlefield study), Hero Dining Room (emotional centerpiece banquet table set for two with crimson runner, gold filigree hem, vintage wine bottle, decanter, bone china place settings, crystal goblets with red wine, folded napkins, and Love's waiting empty chair), and Lounge & Hearth (4-layer animated hearth fire, floating embers, tufted velvet sofa, armchair, coffee table with book, antique bookshelf with multi-colored tomes, and vintage TV).
- **Lighting & Ambiance Rework**: Replaced stepped circular discs with restrained, soft radial light halos (radius ~44px), tapered teardrop candle flames with desynchronized micro-flicker and horizontal sway, window rain strictly clipped to interior glass using Phaser GPU geometry masks, and periodic distant lightning (14–28s interval, occasional double flash).
- **Cinematic Title Intro**: Choreographed 0–4.5s staged reveal (darkness -> left candle ignites -> table revealed -> right candle ignites -> background windows/rain -> Love's chair -> title typography -> interactive start prompt) with instant skip on user input.
- **Traversal & Bounds**: Set physics world bounds to 1280×960, camera follow with centerOn initial position and cinematic lerp, verified dynamic depth sorting behind the Banquet Table.

### `v0.0.6.2` — Production Mansion Architecture Integration ✅
- Extracted and integrated production environment source sheet (`DDWD_ENV_01 — Mansion Architecture.png`, 1448 × 1086 RGBA).
- Deterministic asset extraction pipeline (`tools/assets/process-mansion-architecture.ts` driven by `art/manifests/mansion-architecture.json`).
- Extracted all 80 architectural components into 7 modular categories (`floors`, `carpets`, `walls`, `trims`, `columns_arches`, `stairs_balustrade`, `ornaments`) under `public/game-assets/environment/mansion/architecture/`.
- Generated high-resolution labeled QA contact preview sheet (`art/previews/environment/mansion/architecture/contact-sheet.png`).
- Replaced procedural floors across all zones with production assets (`floor_stone_blocks_dark`, `floor_wood_planks_dark`, `floor_herringbone_dark`, `floor_marble_black_veined`, and `floor_medallion_octagonal`).
- Replaced procedural staircase with production components (`stair_tread_wide`, `stair_runner_carpet_wide`, `stair_rod_brass`, `stair_stringer_step_left/right`, `balustrade_section`, `balustrade_post`, `newel_post_large`).
- Composed architectural character elements across all 5 narrative zones via `src/game/world/mansionArchitectureDefs.ts` (framing columns, egg-and-dart/dentil cornices, wainscots, pointed gothic arches, bust niche, and corbels).
- Upgraded Developer Asset Lab scene (`AssetLabScene.ts`) with dedicated Architecture QA tab (`[A]` key), category cycling, bounding boxes, dimensions, and filter mode QA.
- Added comprehensive unit tests in `tests/architecture.test.ts` (6 tests).

---

## Upcoming Milestones

### `v0.0.7` — Object Interaction & Basic Dialogue
- Interaction raycasting: inspect mirror, inspect dining table, inspect wine, inspect phone.
- Dialogue box UI with typewriter text rendering and confirm-to-advance input.

### `v0.0.8` — Expressive Portrait System
- Crop and normalize character expressions from `detailed-source.png`.
- Character manifest mapping logical emotional states (`neutral`, `annoyed`, `smirking`, `pensive`) to dialogue portrait displays.

### `v0.0.9` — Cutscene Runner & Fear Entrance
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
