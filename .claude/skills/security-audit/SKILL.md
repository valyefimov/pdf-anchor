---
name: security-audit
description: Audit pdf-anchor dependencies and code for security problems. Use before releases, after dependency changes, or when asked to check security.
---

# Security audit

## Dependencies

1. `npm audit` (all) and `npm audit --omit=dev` (what consumers get). Fix with `npm audit fix`; use `overrides` in `package.json` for transitive pins when a direct upgrade is not available. Repeat in `examples/react-vite`.
2. `npm ls --all` to review the tree. The published package must have no runtime `dependencies` (only optional peers).
3. Look for install scripts: `npm query ':attr(scripts, [postinstall])'` and `npm query ':attr(scripts, [install])'`. Review each; run `npm ci --ignore-scripts` in CI.
4. Check the lockfile resolves only to `registry.npmjs.org` with integrity hashes.
5. `npm view <pkg> maintainers time` for anything new or unexpected.

## Code

Search `src/` for: `innerHTML`, `dangerouslySetInnerHTML`, `eval`, `new Function`, `document.write`, `postMessage`, `fetch(`, `localStorage`, `window.open`, `href=`. None should appear except by design.

## Package contents

`npm pack --dry-run` must list only `dist/`, docs and license.

## CI

GitHub Actions are pinned to commit SHAs and run with least-privilege `permissions`.
