# Lint/Format preset R&D (semantic-release)

## Why a dummy repo / flow

Before publishing real shared presets, we need to validate the end-to-end release pipeline:

1. Make a commit with conventional commit messages (e.g. `feat(...)`, `fix(...)`, or breaking change).
2. Open a PR and merge it to `main`.
3. `semantic-release` runs in CI and (a) creates a GitHub Release and (b) publishes packages to GitHub Packages.
4. Create a second consumer repo and install the published package(s) as dependencies.

This dummy repo proves that:
- release automation works (versioning + Git tags + GitHub Release creation),
- package publishing works (GitHub Packages registry),
- consumers can install and use the presets.

## Core R&D questions

### 1) `peerDependencies` vs `dependencies` for `eslint` and `prettier`

**Goal:** reduce consumer setup steps while keeping installs predictable.

- `peerDependencies`
  - Benefit: avoids duplicate ESLint/Prettier installations and reduces “two versions installed” problems.
  - Cost: the consumer must explicitly install `eslint` and `prettier` (more actions).
- `dependencies`
  - Benefit: consumer installs fewer direct packages because tooling is brought transitively.
  - Cost: consumers can end up with multiple ESLint/Prettier versions if they already depend on different versions.

**Decision for this project:** use `dependencies` in the shared preset packages to make the consumer onboarding minimal.

### 2) `eslint.js` (module export) vs `.eslintrc.*` (config file)

- `eslint.js` (JS module)
  - Benefit: the package exposes a stable import target, and it aligns well with `package.json` `exports`.
  - Benefit: consumers can reliably extend the preset by referencing your exported module.
- `.eslintrc.*` inside the published package
  - Cost: config-file discovery and resolution can be brittle once published (path expectations, legacy vs modern config loading).

**Decision for this project:** ship JS presets (`eslint.js`, `prettier.js`) and expose them via `package.json` `exports`.

### 3) `file:` links vs real semver dependencies after publishing

- `file:` links
  - Work locally in a monorepo for fast iteration.
  - Do **not** translate well after publishing because `file:../base` points to a path that doesn’t exist in the consumer environment.
- Real dependency ranges
  - Ensure that when `@capslock-eng/angular` (or `@capslock-eng/react`) is installed, `@capslock-eng/base` is also installed from the registry.

**Decision for this project:** `@testlock-eng/angular` and `@testlock-eng/react` depend on `@testlock-eng/base` using a portable range (for demo simplicity: `"*"`).

## Final chosen strategy (applies to this repository)

### Preset packages and exports

- `@testlock-eng/base`
  - Exposes `eslint.js` and `prettier.js` via `packages/base/package.json` `exports`.
- `@testlock-eng/angular` and `@testlock-eng/react`
  - Expose their own `eslint.js` and `prettier.js` (and extend `@testlock-eng/base` presets).

### Dependency model

- `@testlock-eng/base`:
  - uses `dependencies` for `eslint` and `prettier`.
- `@testlock-eng/angular` and `@testlock-eng/react`:
  - depend on `@testlock-eng/base` with a portable semver range (demo: `"*"`).
  - do not require the consumer to separately install `eslint/prettier`.

## Expected consumer usage after implementation

- Install only the preset package:
  - `npm i -D @testlock-eng/angular`
  - (or `.../react` / `.../base`)
- ESLint config:
  - `extends: ["@testlock-eng/angular/eslint"]`
- Prettier config:
  - `module.exports = require("@testlock-eng/angular/prettier")`

