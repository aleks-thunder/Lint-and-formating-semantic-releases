# Semantic-release R&D + repo setup notes

## Why `semantic-release` is a good fit here

- **Automates releases end-to-end**: versions, tags, changelogs, GitHub Releases, and npm publishing.
- **Conventional Commits → SemVer**:
  - `fix(...)` → patch
  - `feat(...)` → minor
  - `feat(...)!` or `BREAKING CHANGE:` → major
- **Monorepo-ready**: this repo uses `semantic-release-monorepo` to release only packages whose paths changed.
- **No manual versioning**: editing `"version"` in `packages/*/package.json` does **not** drive releases; CI overwrites versions during release.

## How it works in this repo (what to expect)

### Inputs

- **Releasable commits must land on `main`** (default behavior).
- Only commits that match Conventional Commits release rules affect version bumps (see above).

### Outputs (per package)

- A git tag and GitHub Release created by `@semantic-release/github`.
- A `CHANGELOG.md` created/updated by `@semantic-release/changelog`.
- An npm package published to GitHub Packages (`npm.pkg.github.com`) by `@semantic-release/npm`.

## Local testing (dry-run)

- Run from repo root:
  - `npm run release:dry`
- You must provide tokens locally (CI injects these automatically):
  - `GITHUB_TOKEN` (or `GH_TOKEN`) for GitHub API access
  - `NPM_TOKEN` / `NODE_AUTH_TOKEN` for registry auth (GitHub Packages)

  run:
  - ssh-agent
  - in cmd $env:GITHUB*TOKEN="github_pat*###"

## What config enables it (key files)

### Root semantic-release config

- `[.releaserc.json](../.releaserc.json)`
  - `extends: "semantic-release-monorepo"` enables monorepo path-scoped releases.
  - `@semantic-release/commit-analyzer` uses preset `conventionalcommits` so `feat(scope)!:` in the subject is treated as **major** (not minor).
  - Plugins used:
    - `@semantic-release/commit-analyzer`
    - `@semantic-release/release-notes-generator`
    - `@semantic-release/changelog`
    - `@semantic-release/npm`
    - `@semantic-release/github`

**Note:** This repo uses `@semantic-release/git` (to commit each package’s `CHANGELOG.md` + `package.json`). It’s safe because releases run sequentially in `.github/workflows/release.yml` (no concurrent pushes).

### Per-package release config

- Each package has:
  - `release.extends: "../../.releaserc.json"`
  - package-specific `tagFormat` in `release` config:
    - `base-v${version}`
    - `angular-v${version}`
    - `react-v${version}`
  - `publishConfig.registry: "https://npm.pkg.github.com"`
- Example packages:
  - `[packages/base/package.json](../packages/base/package.json)`
  - `[packages/angular/package.json](../packages/angular/package.json)`
  - `[packages/react/package.json](../packages/react/package.json)`

### NPM registry targeting

- Root `[.npmrc](../.npmrc)` maps the scope to GitHub Packages:
  - `@aleks-thunder:registry=https://npm.pkg.github.com`
  - `always-auth=true`

## GitHub Actions workflows (what each does)

### Production release

- `[.github/workflows/release.yml](../.github/workflows/release.yml)`
  - **Triggers**: `push` to `main` (+ manual `workflow_dispatch`)
  - **`changes` first action job**: runs `dorny/paths-filter@v3` and outputs `base/angular/react=true|false`
  - **Path gating**: `release-packages` uses those `changes` outputs to decide which release step runs.
  - **Single sequential job**: `release-packages` with gated steps (`Release base`, `Release angular`, `Release react`)
  - **Runs** `semantic-release` from each package dir using:
    - `node ../../node_modules/semantic-release/bin/semantic-release.js`
  - **Behavior**: if only `packages/react/**` changes, only `Release react` step runs
  - **Permissions**: `contents: write` + `packages: write` are required for tags/releases and publishing

### Demo dry-run

- `[.github/workflows/release-demo.yml](../.github/workflows/release-demo.yml)`
  - **Trigger**: `workflow_dispatch`
  - **Matrix**: runs dry-run for each package (no publish)

### PR title conventional check (CI signal for squash-merge)

- `[.github/workflows/pr-title-lint.yml](../.github/workflows/pr-title-lint.yml)`
  - Validates PR titles follow `type(scope): subject` (including the **space after `:`**).
  - This does **not** drive releases directly; releases depend on what reaches `main`.
  - If you use **Squash merge**, configure GitHub to use PR title as the squash commit message so `semantic-release` still sees a releasable commit.

## Most important setup decisions we made

- **Monorepo release strategy**: single sequential release job + path-filtered steps (prevents cross-job state drift and keeps per-package releases isolated).
- **Scope alignment**: npm scope must match GitHub owner (`@aleks-thunder`) for GitHub Packages.
- **Stable preset exports**: each package exports `./eslint` and `./prettier` via `package.json` `exports`.
- **Local + CI enforcement**: PR title lint action blocks non-conventional PR titles in CI (useful with squash merges) (`.github/workflows/pr-title-lint.yml`).

## Commit format required

Use Conventional Commits:

- `fix(scope): ...` -> patch
- `feat(scope): ...` -> minor
- `feat(scope)!: ...` -> major

## Short demo checklist

1. Open GitHub **Actions**.
2. Run `Demo semantic-release dry run`.
3. Merge a PR with `feat(base): ...` (or `fix(base): ...`).
4. Confirm `Release packages` workflow completed.
5. Confirm package tag (for example `base-v1.0.4`).
6. Confirm GitHub Release and package publish.

## Rollout checklist for consumer repos

- Add dependency on `@aleks-thunder/base` / `@aleks-thunder/angular` / `@aleks-thunder/react`.
- Extend ESLint/Prettier from the selected preset package.
- Remove duplicated local lint/format rules.
- Run lint/format locally and validate CI.

## Troubleshooting

- **No release created**: commit is not releasable (`feat`/`fix`/`feat()!`).
- **Wrong package released**: check `changes` output (`base/angular/react=true|false`) in workflow logs.
- **Auth/publish errors**: confirm token permissions and scope mapping in `.npmrc`.
