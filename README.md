# A DINNER DATE WITH DEATH

> An interactive gothic short story disguised as a pixel RPG.

**A Dinner Date with Death** is a short, polished, narrative top-down browser RPG evoking the tactile feel and pacing of classic Game Boy Advance era adventures (e.g. Pokémon Emerald). It features original characters, a gothic-romantic narrative, atmospheric dialogue, and scripted cinematic moments.

- **Live Deployment**: [https://jedix420.github.io/dinnerdatewithdeath/](https://jedix420.github.io/dinnerdatewithdeath/)
- **Engine**: Phaser 3 + TypeScript + Vite
- **Current Milestone**: `v0.0.6.2` (Production Mansion Architecture Integration)

---

## Quickstart

### Prerequisites
- Node.js `v22` (see `.nvmrc`)
- npm `v10+`

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts the local development server at `http://localhost:3000`.

### Controls
- **Move**: `W` / `A` / `S` / `D` or Arrow keys
- **Confirm / Interact**: `Enter`, `Space`, or `Z`
- **Cancel**: `Escape` or `X`
- **Visual QA Overlay**: Press `V` in Mansion (or visit `?debug=visual`)
- **Developer Asset Lab**: Press `L` on Title Screen or Mansion (or visit `?scene=asset-lab`)
  - Press `[C]` for Character QA, `[A]` for Architecture QA

---

## Asset Pipeline

Regenerate Death's production sprite sheet and QA previews from canonical source art:
```bash
npm run assets:death
```

Regenerate the 80 production mansion architectural assets and contact sheet:
```bash
npm run assets:mansion-architecture
```

Or run both deterministic pipelines:
```bash
npm run assets
```

- Architecture manifest: `art/manifests/mansion-architecture.json`
- Production architecture sprites: `public/game-assets/environment/mansion/architecture/`
- Visual QA contact sheet: `art/previews/environment/mansion/architecture/contact-sheet.png`
- Character manifest: `art/manifests/death.json`
- Production sheet: `public/game-assets/characters/death/overworld/walk.png`
- Visual QA preview: `art/previews/death/death-walk-sheet-preview.png`

---

## Quality Checks & Verification

Run the full verification pipeline (linter, typecheck, unit tests, and production build):
```bash
npm run verify
```

Individual commands:
- `npm run lint` — ESLint flat config with strict TypeScript rules
- `npm run typecheck` — Strict TypeScript compilation check (`tsc --noEmit`)
- `npm test` — Unit tests via Vitest
- `npm run build` — Production Vite bundle in `dist/`

---

## License & IP Notice

All character artwork, world design, and story content are original intellectual property. No public open-source software license is granted for game assets or narrative content.
