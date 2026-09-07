# A DINNER DATE WITH DEATH

> An interactive gothic short story disguised as a pixel RPG.

**A Dinner Date with Death** is a short, polished, narrative top-down browser RPG evoking the tactile feel and pacing of classic Game Boy Advance era adventures (e.g. Pokémon Emerald). It features original characters, a gothic-romantic narrative, atmospheric dialogue, and scripted cinematic moments.

- **Target Deployment**: [https://JEDIx420.github.io/dinnerdatewithdeath/](https://JEDIx420.github.io/dinnerdatewithdeath/)
- **Engine**: Phaser 3 + TypeScript + Vite
- **Current Milestone**: `v0.0.3` (Engine Foundation & Prototype Room)

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

### Controls (Prototype)
- **Move**: `W` / `A` / `S` / `D` or Arrow keys
- **Confirm / Interact**: `Enter`, `Space`, or `Z`
- **Cancel**: `Escape` or `X`

---

## Quality Checks & Verification

Run the full verification pipeline (linter, typecheck, unit tests, and production build):
```bash
npm run verify
```

Individual commands:
- `npm run lint` — ESLint flat config with strict TypeScript rules
- `npm run typecheck` — Strict TypeScript compilation check (`tsc --noEmit`)
- `npm test` — Pure logic unit tests via Vitest
- `npm run build` — Production Vite bundle in `dist/`

---

## Project Structure

```
├── .github/workflows/       # GitHub Pages deployment action
├── art/
│   ├── source/              # Canonical immutable source artwork & storyboards
│   ├── manifests/           # Future crop & extraction manifests
│   └── previews/            # Asset pipeline preview sheets
├── docs/                    # Architecture, roadmap, story, & pipeline docs
├── public/                  # Static runtime web assets
├── src/
│   ├── game/
│   │   ├── config.ts        # Central logical resolution & Phaser settings
│   │   ├── scenes/          # BootScene, TitleScene, PrototypeScene
│   │   └── systems/         # InputManager, future audio/dialogue/save systems
│   ├── main.ts              # Game entrypoint
│   └── style.css            # Responsive dark canvas styling
├── tests/                   # Logic unit tests
└── tools/assets/            # Asset pipeline scripts
```

---

## License & IP Notice

All character artwork, world design, and story content are original intellectual property. No public open-source software license is granted for game assets or narrative content.
