# AGENT GUIDELINES & NON-NEGOTIABLES

This document establishes critical operational boundaries and engineering principles for all autonomous coding agents working on **A Dinner Date with Death**.

---

## The 18 Non-Negotiables

1. **`main` must remain playable and buildable at all times**:
   Never leave the repository in a broken state. `npm run verify` must pass before finishing any task.

2. **Do not redesign canonical characters**:
   Death, Love, Fear, and The General have established visual designs defined in `art/source/`. Do not alter their appearances, personalities, or color schemes arbitrarily.

3. **Never destructively modify `art/source`**:
   The `art/source/` directory holds immutable source reference artwork. Any extraction, cropping, background removal, or scaling must be done non-destructively through processing scripts or derivative output directories.

4. **Do not embed the entire story directly in Phaser scene classes**:
   Keep Phaser scenes thin. Story dialogue, cutscenes, and branching must remain data-driven and loadable from content modules.

5. **Do not introduce backend infrastructure**:
   The game is static-hostable on GitHub Pages. No Node servers, databases, auth services, Docker containers, or cloud runtimes.

6. **Do not introduce React or heavy UI frameworks**:
   Phaser 3 owns the canvas. UI is rendered either via Phaser game objects or lightweight minimal canvas overlays.

7. **Do not add traditional RPG bloat**:
   Combat, inventory, XP, level ups, shops, equipment, skill trees, and procedural maps are out of scope. This is an interactive gothic short story.

8. **Do not copy Pokémon assets, UI, or music**:
   While the game evokes the tactile pacing of GBA top-down adventures, all visual assets, audio, dialogue, and UI elements must be 100% original.

9. **Keep dependencies minimal**:
   Avoid adding npm packages unless genuinely necessary. Rely on Phaser 3, TypeScript, and standard browser APIs.

10. **Story content should be data-driven**:
    Dialogue trees, cutscene command sequences, and state conditions must live in structured schemas (JSON/TS data modules) rather than nested procedural callbacks.

11. **Runtime artwork must live separately from source artwork**:
    Never serve raw multi-megabyte source sheets directly to client browsers. Production assets must be normalized, cropped, optimized, and placed under `public/game-assets/`.

12. **Test pure game logic where useful**:
    Write unit tests for input abstraction, dialogue branching, cutscene validation, and save serialization using Vitest. Do not attempt fragile rendering tests on Phaser canvas.

13. **Do not silently fabricate missing game content**:
    Follow the approved 32-beat narrative structure. Do not invent unauthorized story arcs or deviate from the canonical story outline.

14. **Placeholder content must be clearly identified**:
    When using temporary sprites, sounds, or map textures, label them clearly with names like `player_placeholder` or `obstacle_table` to avoid confusion with production assets.

15. **Understand existing architecture before making major changes**:
    Consult `docs/architecture.md`, `docs/roadmap.md`, and `docs/asset-pipeline.md` before altering core systems.

16. **Keep mobile browser compatibility in mind**:
    The input architecture must decouple logical actions (`UP`, `CONFIRM`, etc.) from hardware keys so virtual D-pad touch inputs can easily be integrated later.

17. **Preserve crisp pixel rendering**:
    Always enforce nearest-neighbor scaling (`pixelArt: true`, `antialias: false`, `roundPixels: true`). Never introduce blurry bicubic or bilinear interpolation.

18. **Do not prematurely build later acts while an earlier milestone is under review**:
    Build systematically milestone by milestone according to `docs/roadmap.md`.
