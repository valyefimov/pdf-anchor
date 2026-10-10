import type { CSSProperties } from 'react';
import type { PdfAnchorTheme } from './types';

const VARIABLES: Record<keyof PdfAnchorTheme, string> = {
  background: '--pdf-anchor-bg',
  surface: '--pdf-anchor-surface',
  text: '--pdf-anchor-text',
  mutedText: '--pdf-anchor-muted',
  border: '--pdf-anchor-border',
  accent: '--pdf-anchor-accent',
  accentText: '--pdf-anchor-accent-text',
  highlight: '--pdf-anchor-highlight',
  highlightActive: '--pdf-anchor-highlight-active',
  radius: '--pdf-anchor-radius',
  cardRadius: '--pdf-anchor-card-radius',
  fontFamily: '--pdf-anchor-font',
  shadow: '--pdf-anchor-shadow',
  pageShadow: '--pdf-anchor-page-shadow',
  contentMaxWidth: '--pdf-anchor-content-max-width',
  headerHeight: '--pdf-anchor-header-height',
  panelHeight: '--pdf-anchor-panel-height',
  toolbarHeight: '--pdf-anchor-toolbar-height',
};

/** Turns a partial theme into inline CSS custom properties. */
export function themeToStyle(theme: Partial<PdfAnchorTheme> | undefined): CSSProperties {
  const style: Record<string, string> = {};

  if (theme) {
    for (const key of Object.keys(VARIABLES) as (keyof PdfAnchorTheme)[]) {
      const value = theme[key];
      if (value !== undefined) {
        style[VARIABLES[key]] = value;
      }
    }
  }

  return style as CSSProperties;
}
