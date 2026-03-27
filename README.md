# Shared lint/format configs with semantic-release

This repository publishes reusable lint and formatting presets as scoped packages for consumer applications.

## How release automation works

- Commits on `main` follow Conventional Commits.
- GitHub Actions runs `semantic-release` per package.
- Package version/tag/release are created automatically.
- Package is published to GitHub Packages (`npm.pkg.github.com`).

See `[docs/semantic-release-rnd.md](docs/semantic-release-rnd.md)` for a concise repo-specific R&D/usage guide and workflow notes.

## Packages

- `@aleks-thunder/base`
- `@aleks-thunder/angular`
- `@aleks-thunder/react`
