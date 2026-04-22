# Lint/Format preset R&D (semantic-release)

## Why a dummy repo / flow

Before publishing real shared presets, we need to validate the end-to-end release pipeline:

1. Make a commit with conventional commit messages (e.g. `feat(...)`, `fix(...)`, `feat()!`, `breaking(...)`, or `feat: ...` with a footer `BREAKING CHANGE: ...` after a blank line — not `BREAKING CHANGE:` as the only line; see [rnd-semantic-release.md](./rnd-semantic-release.md)).
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

### 2) preset module entrypoints vs consumer config file names

- preset module entrypoints (`@aleks-thunder/*/eslint`, `@aleks-thunder/*/prettier`)
  - Benefit: the package exposes a stable import target, and it aligns well with `package.json` `exports`.
  - Benefit: consumers can reliably extend the preset by referencing your exported module.
- `.eslintrc.*` inside the published package
  - Cost: config-file discovery and resolution can be brittle once published (path expectations, legacy vs modern config loading).

**Decision for this project:** expose preset module entrypoints via `package.json` `exports`, and use modern consumer config files: `eslint.config.js` and `prettier.config.js`.

### 3) `file:` links vs real semver dependencies after publishing

- `file:` links
  - Work locally in a monorepo for fast iteration.
  - Do **not** translate well after publishing because `file:../base` points to a path that doesn’t exist in the consumer environment.
- Real dependency ranges
  - Ensure that when `@aleks-thunder/angular` (or `@aleks-thunder/react`) is installed, `@aleks-thunder/base` is also installed from the registry.

**Decision for this project:** `@aleks-thunder/angular` and `@aleks-thunder/react` depend on `@aleks-thunder/base` using a portable range (for demo simplicity: `"*"`).

#### Additional R&D: local development without release

**Goal:** test `base -> angular/react -> consumer` changes locally before publishing, without machine-specific `file:` paths.

**Recommended workflow: `yalc`**

1. Install yalc once:
   - `npm i -g yalc`
2. In this preset repo, publish local snapshots:
   - `cd packages/base && yalc publish`
   - `cd ../angular && yalc publish` (or `../react`)
3. In consumer repo, add local packages:
   - `yalc add @aleks-thunder/base @aleks-thunder/angular`
   - then `npm install`
4. After each preset change, sync again:
   - from changed preset package folder (`packages/base`, `packages/angular`, or `packages/react`):
     - `yalc push`
   - in consumer repo:
     - `yalc update @aleks-thunder/base @aleks-thunder/angular`
     - `npm install`
5. If lint output in editor does not refresh:
   - open Command Palette and run `ESLint: Restart ESLint Server`

**Why this works:** `yalc` behaves like a lightweight local registry, so dependency resolution is realistic and independent of folder structure.

**Trade-offs:**

- Works across machines and teams; no hardcoded relative paths.
- Close to real package-consumer behavior.
- Keep CI/release flows on registry versions (`@aleks-thunder/*@x.y.z`), not local `yalc` artifacts.

## Final chosen strategy (applies to this repository)

### Preset packages and exports

- `@aleks-thunder/base`
  - Exposes preset module entrypoints via `packages/base/package.json` `exports`.
- `@aleks-thunder/angular` and `@aleks-thunder/react`
  - Expose their own preset module entrypoints (and extend `@aleks-thunder/base` presets).

### Dependency model

- `@aleks-thunder/base`:
  - uses `dependencies` for `eslint` and `prettier`.
- `@aleks-thunder/angular` and `@aleks-thunder/react`:
  - depend on `@aleks-thunder/base` with a portable semver range (demo: `"*"`).
  - do not require the consumer to separately install `eslint/prettier`.

## Expected consumer usage after implementation

- Install only the preset package:
  - `npm i -D @aleks-thunder/angular`
  - (or `.../react` / `.../base`)
- ESLint config:
  - `eslint.config.js`: `import` from `@aleks-thunder/angular/eslint` (see [consumer.md](./consumer.md)).
- Prettier config:
  - `prettier.config.js`: `import` from `@aleks-thunder/angular/prettier` (see [consumer.md](./consumer.md)).
