# Theming and styling

pdf-anchor ships one small stylesheet, `pdf-anchor/styles.css`. There is no CSS-in-JS runtime and no dependency on a component library, so every layer can be restyled with plain CSS.

You have four levels of control, from coarse to fine.

## 1. Color scheme

```tsx
<PdfAnchorViewer colorScheme="dark" /> // 'light' (default) | 'dark' | 'auto'
```

`auto` follows `prefers-color-scheme`.

## 2. Design tokens (`theme`)

```tsx
<PdfAnchorViewer
  theme={{
    accent: '#0ea5e9',
    radius: '12px',
    fontFamily: 'Georgia, serif',
    highlight: 'rgba(14, 165, 233, 0.3)',
    highlightActive: 'rgba(14, 165, 233, 0.55)',
  }}
/>
```

| Token             | CSS variable                    | Default (light)               |
| ----------------- | ------------------------------- | ----------------------------- |
| `background`      | `--pdf-anchor-bg`               | `#f1f3f5`                     |
| `surface`         | `--pdf-anchor-surface`          | `#ffffff`                     |
| `text`            | `--pdf-anchor-text`             | `#1a1d21`                     |
| `mutedText`       | `--pdf-anchor-muted`            | `#5f6b7a`                     |
| `border`          | `--pdf-anchor-border`           | `#d5dae1`                     |
| `accent`          | `--pdf-anchor-accent`           | `#2563eb`                     |
| `accentText`      | `--pdf-anchor-accent-text`      | `#ffffff`                     |
| `highlight`       | `--pdf-anchor-highlight`        | `rgba(255, 221, 0, 0.45)`     |
| `highlightActive` | `--pdf-anchor-highlight-active` | `rgba(255, 140, 0, 0.55)`     |
| `radius`          | `--pdf-anchor-radius`           | `6px`                         |
| `fontFamily`      | `--pdf-anchor-font`             | Inter-first system stack      |
| `shadow`          | `--pdf-anchor-shadow`           | `0 0 8px rgba(0, 0, 0, 0.24)` |
| `headerHeight`    | `--pdf-anchor-header-height`    | `56px`                        |
| `panelHeight`     | `--pdf-anchor-panel-height`     | `190px`                       |
| `toolbarHeight`   | `--pdf-anchor-toolbar-height`   | `64px`                        |

The same variables can be set from your own CSS on `.pdf-anchor`, which is handy for design systems:

```css
.pdf-anchor {
  --pdf-anchor-accent: var(--brand-500);
}
```

### Fonts

The default stack starts with `Inter Variable` / `Inter` and falls back to the system UI font. The package does not download fonts. To get Inter, install it yourself, for example `npm i @fontsource-variable/inter` and `import '@fontsource-variable/inter'`.

