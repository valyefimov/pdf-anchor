# Accessibility

pdf-anchor targets **WCAG 2.2 level AA**.

## Keyboard

The viewer is a focusable region (`role="region"`, named by `labels.viewer`). While focus is inside it:

| Key                        | Action                   |
| -------------------------- | ------------------------ |
| `ArrowRight` / `ArrowLeft` | Next / previous citation |
| `ArrowDown` / `ArrowUp`    | Next / previous page     |
| `+` (or `=`) / `-`         | Zoom in / out            |

Shortcuts are ignored when a modifier key is held or the focus is in an input, textarea, select or editable element, so they do not collide with your own UI. Turn them off with `keyboardNavigation={false}`. Every action is also available as a real button, and all buttons are reachable with `Tab`.

## What is covered

| Criterion                              | How                                                                                                                     |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1.1.1 Non-text content                 | Icons are decorative (`aria-hidden`); every icon button has an accessible name from `labels`.                           |
| 1.3.1 Info and relationships           | Real `button`, `nav`, `section`, headings; the current page link has `aria-current="page"`. No nested banner landmarks. |
| 1.4.3 Contrast (minimum)               | Default light and dark palettes pass; verified with axe in a real browser.                                              |
| 1.4.11 Non-text contrast               | Button and chip borders use `--pdf-anchor-control-border` (at least 3:1 against the surface).                           |
| 1.4.1 Use of color                     | The active citation has an outline in addition to its color; the panel names the citation.                              |
| 2.1.1 Keyboard, 2.1.2 No keyboard trap | See above. Highlighted text can be activated by click, and the same navigation exists on buttons.                       |
| 2.4.7 Focus visible                    | 2px accent outline on buttons, links and the viewer region.                                                             |
| 2.5.8 Target size                      | Controls are at least 28 x 28 CSS px.                                                                                   |
| 4.1.2 Name, role, value                | Zoom, counter and "not found" notes are live regions; labels are overridable for localisation.                          |
| 4.1.3 Status messages                  | Loading is `role="status"`, errors are `role="alert"`.                                                                  |
| Reduced motion                         | The spinner slows down and the highlight pulse and transitions are disabled under `prefers-reduced-motion`.             |

## Your responsibilities

- If you override `theme` colors, keep text at 4.5:1 and control borders at 3:1.
- Translate `labels` when the page is not English (`viewer`, `controls`, button names).
- The PDF itself must be accessible (tagged, with a text layer) for screen readers to read the page content.
- The title is rendered as an `h1` and the panel heading as an `h2`. If the viewer is embedded in a page that already has an `h1`, pass your own content with `renderHeader`.

## Testing

`tests/react/a11y.test.tsx` runs axe-core on every build (structure, names, ARIA). Contrast needs real layout: run axe in the demo app (`npm --prefix examples/react-vite run dev`) on the Basic and Themed tabs.
