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
- Matrix runs for:
  - `packages/base`
  - `packages/angular`
  - `packages/react`
- Executes `npx semantic-release`.
- Publishes to `https://npm.pkg.github.com`.

### Demo dry-run

- Workflow: `.github/workflows/release-demo.yml`
- Trigger: `workflow_dispatch`.
- Executes `npx semantic-release --dry-run` per package.
- Shows calculated next version and release notes without publishing.

## 5) Authentication and permissions

In release workflow:

- `permissions.contents: write`
- `permissions.packages: write`
- `GITHUB_TOKEN` and `NODE_AUTH_TOKEN` use `${{ secrets.GITHUB_TOKEN }}`.

In `.npmrc`:

```text
@testlock-eng:registry=https://npm.pkg.github.com
always-auth=true
```

## 6) Short demo script (Acceptance Criteria)

1. Open **Actions** tab in GitHub.
2. Run `Demo semantic-release dry run` and show predicted versions.
3. Merge a PR with commit: `feat(base): tighten base eslint defaults`.
4. Show `Release packages` workflow succeeded.
5. Show created Git tag: `@testlock-eng/base@x.y.z`.
6. Show GitHub Release entry.
7. In a consumer app, install package and extend config.

## 7) Consumer app setup examples

### Base package

```bash
npm i -D @testlock-eng/base eslint prettier
```

`.eslintrc.cjs`:

```js
module.exports = {
  extends: ["@testlock-eng/base/eslint"],
};
```

`prettier.config.cjs`:

```js
module.exports = require("@testlock-eng/base/prettier");
```

### Angular package

```bash
npm i -D @testlock-eng/angular eslint prettier
```

`.eslintrc.cjs`:

```js
module.exports = {
  extends: ["@testlock-eng/angular/eslint"],
};
```

`prettier.config.cjs`:

```js
module.exports = require("@testlock-eng/angular/prettier");
```

### React package

```bash
npm i -D @testlock-eng/react eslint prettier
```

`.eslintrc.cjs`:

```js
module.exports = {
  extends: ["@testlock-eng/react/eslint"],
};
```

`prettier.config.cjs`:

```js
module.exports = require("@testlock-eng/react/prettier");
```

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
