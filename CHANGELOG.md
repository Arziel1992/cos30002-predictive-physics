# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2026-04-01 - 00:27] - Fix Vite Version Compatibility

### Fixed

- Downgraded `vite` from `^8.0.0` to `^5.0.0` to satisfy `@sveltejs/vite-plugin-svelte@4` peer dependency (`vite ^5.0.0` required). GitHub Actions CI was failing with `ERESOLVE`.

## [2026-03-31 - 23:59] - Copyright Footer

### Added

- Copyright footer (© E. Ketterer Ortiz) to the right sidebar in all three projects.

## [2026-03-31 - 23:47] - Dual Sidebar Layout

### Changed

- Replaced resizable single sidebar with static dual-sidebar layout (25% left / 50% canvas / 25% right).
- Moved Controls and Stats panels from left sidebar and floating overlay into the right sidebar.
- Left sidebar now contains only educational content.
- Added toggle buttons on canvas edges to show/hide each sidebar.
- Removed drag-resize functionality.
- Stats panel restyled from glassmorphism floating card to native sidebar section.

## [2026-03-31 - 12:00] - Style Fix

### Changed

- `Sidebar.svelte`: formula block background changed from black (`#000`) to light (`#f1f5f9`) to match goap-fuzzy project style; added `text-align: center`

## [2026-03-31 - 03:20] - Initial Commit

### Added

- Created interactive Predictive Physics & Kinematic Modelling simulation.
- Implemented three targeting modes: Hitscan, Simple Kinematics, and Advanced Ballistics (Drag).
- Developed AI Turret with real-time leading and intercept calculation.
- Integrated fixed-timestep physics engine for air density and gravity simulations.
- Added pedagogical "Textbook" sidebar for kinematic formula display.
- Implemented drag-resizable UI with CSS-driven glassmorphism and responsiveness.
