# Security audit: 0.1.0

Checks performed before the first release.

| Check                                                                                                          | Result                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `npm audit` (library, including dev tooling)                                                                   | 0 vulnerabilities                                                                                                                 |
| `npm audit --omit=dev`                                                                                         | 0 vulnerabilities                                                                                                                 |
| `npm audit` (demo app)                                                                                         | 0 vulnerabilities                                                                                                                 |
| `npm audit signatures`                                                                                         | all 288 packages have verified registry signatures                                                                                |
| Runtime `dependencies` of the published package                                                                | none (react, react-dom and react-pdf are optional peers)                                                                          |
| Lockfiles                                                                                                      | every entry resolves to `registry.npmjs.org` and has an integrity hash                                                            |
| Install scripts                                                                                                | only `esbuild` and `fsevents` (build tooling); CI installs with `--ignore-scripts`                                                |
| Dangerous APIs in `src/` (`innerHTML`, `eval`, `new Function`, `fetch`, storage, `postMessage`, `window.open`) | none                                                                                                                              |
| `string-best-match@1.1.1`                                                                                      | published `findBestMatch.js` is byte-identical to a build of the repository source; single maintainer; no scripts or dependencies |
| GitHub Actions                                                                                                 | pinned to commit SHAs, least-privilege `permissions`                                                                              |

## Findings fixed during development

- Vitest 3 (dev only) pulled in vulnerable `@vitest/mocker` and `tinypool` (prototype pollution leading to RCE). Upgraded to Vitest 5.
- `esbuild` 0.27.x (dev only) had an arbitrary file read advisory for its dev server on Windows. Pinned to `^0.28.1` with an `overrides` entry.

## Upstream

`string-best-match@1.1.1` shipped extensionless ESM imports that native Node could not resolve ([valyefimov/string-best-match#7](https://github.com/valyefimov/string-best-match/issues/7)). Versions 1.1.2 and 1.1.3 fix this (1.1.3 also ships a CommonJS build, [#19](https://github.com/valyefimov/string-best-match/issues/19)), so it is used as a normal dependency.
