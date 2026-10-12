---
name: release
description: Cut and publish a new pdf-anchor version to npm. Use when asked to release, publish or bump the version.
---

# Releasing pdf-anchor

Publishing is outward-facing: confirm with the user before running `npm publish` or pushing tags.

1. Make sure `main` is clean and CI is green.
2. Run the full check: `npm ci && npm run typecheck && npm run lint && npm test && npm run build && npm run audit:prod`.
3. Summarise the changes for the release notes (there is no changelog file).
4. Bump the version: `npm version <patch|minor|major> --no-git-tag-version`, then commit `chore(release): vX.Y.Z`.
5. Inspect the tarball: `npm pack --dry-run`. It must contain only `dist/`, `README.md`, `LICENSE` and `package.json`, and no source maps of secrets or local files.
6. Smoke-test the build from native Node (ESM and CJS): `node -e "import('./dist/core.js').then(m => console.log(Object.keys(m)))"` and `node -e "console.log(Object.keys(require('./dist/core.cjs')))"`.
7. With the user's go-ahead: `npm publish --provenance --access public` (from CI where possible), then `git tag vX.Y.Z && git push --tags`.
