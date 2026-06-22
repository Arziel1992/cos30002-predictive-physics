# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## 2026-06-23 - 03:46

- Frame-rate independence: the simulation now advances on a fixed-timestep accumulator, so it runs at the same real-time speed on any display (a 144 Hz screen no longer runs it ~2.4x too fast).

## 2026-06-20 - 05:06

### Fixed

- Hitscan laser shots are now removed when their fade life expires. Previously they were never culled (the out-of-bounds check referenced `x`/`y`, which laser objects do not have), so every shot leaked an object indefinitely.

### Changed

- In hitscan mode the prediction marker now reflects the target's current position (matching where the instantaneous shot actually lands) rather than a lead/drop point hitscan ignores.

## 2026-06-19 - 23:18

### Changed

- Migrated the package manager from npm to **pnpm** (global pnpm via Volta).
- Updated CI (`deploy.yml`) to set up pnpm via `pnpm/action-setup` and run `pnpm install --frozen-lockfile` + `pnpm run build`.
- Updated README commands to pnpm.

### Added

- `pnpm-lock.yaml` (imported from the previous `package-lock.json`, which was removed).
- Node pin `"volta": { "node": "24.17.0" }` in `package.json`.

## 2026-06-19 - 22:18 - Conform to refined tool_template

### Changed

- Conformed to the refined `tool_template` shared structure.
- Upgraded toolchain to Svelte 5.56.3, Vite 8, `@sveltejs/vite-plugin-svelte` 7, and Biome 2.5.0; CI Node bumped to 24.
- Normalised `src/app.css` and `.gitignore` to the canonical shared versions.

### Added

- Displayed the build version next to the repository link in the right-panel footer
- `svelte.config.js` (`vitePreprocess`) and `.markdownlint.json` (David Anson Markdown Lint) config.
- Loaded the Inter 800 weight and JetBrains Mono web font used by the UI/telemetry styling.

### Fixed

- Removed the broken `/vite.svg` favicon reference (the asset did not exist, causing a 404).

## 2026-04-01 - 00:27 - Fix Vite Version Compatibility

### Fixed

- Downgraded `vite` from `^8.0.0` to `^5.0.0` to satisfy `@sveltejs/vite-plugin-svelte@4` peer dependency (`vite ^5.0.0` required). GitHub Actions CI was failing with `ERESOLVE`.

## 2026-03-31 - 23:59 - Copyright Footer

### Added

- Copyright footer (© E. Ketterer Ortiz) to the right sidebar in all three projects.

## 2026-03-31 - 23:47 - Dual Sidebar Layout

### Changed

- Replaced resizable single sidebar with static dual-sidebar layout (25% left / 50% canvas / 25% right).
- Moved Controls and Stats panels from left sidebar and floating overlay into the right sidebar.
- Left sidebar now contains only educational content.
- Added toggle buttons on canvas edges to show/hide each sidebar.
- Removed drag-resize functionality.
- Stats panel restyled from glassmorphism floating card to native sidebar section.

## 2026-03-31 - 12:00 - Style Fix

### Changed

- `Sidebar.svelte`: formula block background changed from black (`#000`) to light (`#f1f5f9`) to match goap-fuzzy project style; added `text-align: center`

## 2026-03-31 - 03:20 - Initial Commit

### Added

- Created interactive Predictive Physics & Kinematic Modelling simulation.
- Implemented three targeting modes: Hitscan, Simple Kinematics, and Advanced Ballistics (Drag).
- Developed AI Turret with real-time leading and intercept calculation.
- Integrated fixed-timestep physics engine for air density and gravity simulations.
- Added pedagogical "Textbook" sidebar for kinematic formula display.
- Implemented drag-resizable UI with CSS-driven glassmorphism and responsiveness.
