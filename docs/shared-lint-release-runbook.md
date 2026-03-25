# Shared Lint/Format semantic-release Runbook

## 1) Release automation design

- `semantic-release` runs inside each package directory.
- Shared config in root `.releaserc.json`.
- `semantic-release-monorepo` scopes release analysis to changed package paths.
- Workflow: `.github/workflows/release.yml`.

## 3) Commit format required

Use Conventional Commits:

- `fix(scope): ...` -> patch
- `feat(scope): ...` -> minor
- `feat(scope)!: ...` or `BREAKING CHANGE:` -> major

Scope notes:

- `scope` identifies the affected area/package (helps changelog clarity in monorepo releases).
- Recommended scopes: `base`, `angular`, `react`, `repo`, `docs`, `ci`.
- Common commit types:
  - Releasable: `feat`, `fix` (and `!`/`BREAKING CHANGE` for major).
  - Usually non-releasable: `chore`, `docs`, `style`, `refactor`, `test`, `build`, `ci`.

## 4) GitHub Actions workflows

### Production release

- Trigger: push to `main`.
- Path filter detects which of `packages/base`, `packages/angular`, `packages/react` changed.
- Jobs run **in order** (`release-base` → `release-angular` → `release-react`) to avoid concurrent git/npm publish races.
- Runs `node ../../node_modules/semantic-release/bin/semantic-release.js` from each package directory.
- Publishes to `https://npm.pkg.github.com` under scope `@aleks-thunder` (must match the GitHub user/org that owns the repo).

### Demo dry-run

- Workflow: `.github/workflows/release-demo.yml`
- Trigger: `workflow_dispatch`.
- Matrix dry-runs each package with `semantic-release --dry-run`.
- Shows calculated next version and release notes without publishing.

## 5) Authentication and permissions

In release workflow:

- `permissions.contents: write`
- `permissions.packages: write`
- `GITHUB_TOKEN` and `NODE_AUTH_TOKEN` use `${{ secrets.GITHUB_TOKEN }}`.

In `.npmrc`:

```text
@aleks-thunder:registry=https://npm.pkg.github.com
always-auth=true
```

Each package’s `package.json` includes a `repository` URL pointing at this monorepo so GitHub Packages can link published packages to the repository (per GitHub docs).

## 6) Short demo script (Acceptance Criteria)

1. Open **Actions** tab in GitHub.
2. Run `Demo semantic-release dry run` and show predicted versions.
3. Merge a PR with commit: `feat(base): tighten base eslint defaults`.
4. Show `Release packages` workflow succeeded.
5. Show created Git tag: `@aleks-thunder/base@x.y.z`.
6. Show GitHub Release entry.
7. In a consumer app, install package and extend config.

## 7) Consumer app setup examples

### Base package

```bash
npm i -D @aleks-thunder/base
```

`.eslintrc.cjs`:

```js
module.exports = {
  extends: ["@aleks-thunder/base/eslint"],
};
```

`prettier.config.cjs`:

```js
module.exports = require("@aleks-thunder/base/prettier");
```

### Angular package

```bash
npm i -D @aleks-thunder/angular
```

`.eslintrc.cjs`:

```js
module.exports = {
  extends: ["@aleks-thunder/angular/eslint"],
};
```

`prettier.config.cjs`:

```js
module.exports = require("@aleks-thunder/angular/prettier");
```

### React package

```bash
npm i -D @aleks-thunder/react
```

`.eslintrc.cjs`:

```js
module.exports = {
  extends: ["@aleks-thunder/react/eslint"],
};
```

`prettier.config.cjs`:

```js
module.exports = require("@aleks-thunder/react/prettier");
```

Note: `eslint` and `prettier` are installed transitively from `@aleks-thunder/base`, so consumers normally install only the preset package (`@aleks-thunder/react`/`@aleks-thunder/angular`/`@aleks-thunder/base`).

## 8) Rollout checklist for other projects

- Add dependency on appropriate package (`base`/`angular`/`react`).
- Replace local lint/prettier config with `extends`/`require` from package.
- Remove duplicated rules from consumer repo.
- Run lint + format locally.
- Open PR and validate CI.

## 9) Troubleshooting

- **No release created**: ensure commits are `feat:`/`fix:`/breaking change style.
- **401 publish error**: verify package publish permissions and token scope.
- **Wrong package released**: confirm package path and matrix `working-directory`.
- **No tags found**: first release requires initial releasable commit.
