import type { CSSProperties, ReactNode } from 'react';
import type { HighlightOptions, HighlightResult, PdfCitation } from '../core';

/** Every element of the viewer that can be restyled through `classNames` / `styles`. */
export type PdfAnchorSlot =
  | 'root'
  | 'header'
  | 'headerTitle'
  | 'headerSubtitle'
  | 'headerActions'
  | 'viewport'
  | 'documentFrame'
  | 'footer'
  | 'panel'
  | 'panelHeading'
  | 'panelDescription'
  | 'panelDivider'
  | 'citation'
  | 'citationTitle'
  | 'citationQuote'
  | 'citationCounter'
  | 'toolbar'
  | 'pageLinks'
  | 'pageLink'
  | 'zoom'
  | 'button'
  | 'status';

export type PdfAnchorClassNames = Partial<Record<PdfAnchorSlot, string>>;
export type PdfAnchorStyles = Partial<Record<PdfAnchorSlot, CSSProperties>>;

/** Design tokens. Each one maps to a `--pdf-anchor-*` CSS custom property. */
export interface PdfAnchorTheme {
  /** Page background behind the PDF. */
  background: string;
  /** Header, citation panel and toolbar background. */
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  accent: string;
  /** Text color on top of `accent`. */
  accentText: string;
  /** Background of highlighted text. */
  highlight: string;
  /** Background of the active citation's highlighted text. */
  highlightActive: string;
  radius: string;
  fontFamily: string;
  shadow: string;
  headerHeight: string;
  panelHeight: string;
  toolbarHeight: string;
}

export type PdfAnchorColorScheme = 'light' | 'dark' | 'auto';

/** Texts rendered by the built-in UI. Override for localisation. */
export interface PdfAnchorLabels {
  citations: string;
  citationOf: (current: number, total: number) => string;
  previousCitation: string;
  nextCitation: string;
  previousPage: string;
  nextPage: string;
  zoomIn: string;
  zoomOut: string;
  rotateLeft: string;
  rotateRight: string;
  pageLabel: (page: number) => string;
  loadingDocument: string;
  loadingPage: string;
  loadError: string;
  notFoundOnPage: string;
}

export interface PdfAnchorState {
  page: number;
  numPages: number;
  scale: number;
  rotation: number;
  citations: readonly PdfCitation[];
  /** Citations located on the current page. */
  pageCitations: readonly PdfCitation[];
  /** Pages that carry at least one citation, ascending. */
  citationPages: readonly number[];
  /** Index of the active citation in `citations`, or `null`. */
  activeIndex: number | null;
  activeCitation: PdfCitation | null;
  /** 1-based position of the active citation within its scope. */
  activePosition: number;
  /** Number of citations in the navigation scope. */
  scopeCount: number;
  /** Whether the active citation was found in the text layer. */
  activeFound: boolean | null;
}

export interface PdfAnchorActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setScale: (scale: number) => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  selectCitation: (index: number) => void;
  nextCitation: () => void;
  previousCitation: () => void;
}

export interface PdfAnchorRenderContext {
  state: PdfAnchorState;
  actions: PdfAnchorActions;
  labels: PdfAnchorLabels;
}

export type PdfAnchorFile =
  | string
  | ArrayBuffer
  | Blob
  | { url: string }
  | { data: Uint8Array | ArrayBuffer };

export interface PdfAnchorViewerProps {
  /** PDF source: a URL, a `Blob`/`ArrayBuffer`, `{ url }` or `{ data }`. */
  file: PdfAnchorFile;
  /** Tried when `file` fails to load. */
  fallbackFile?: PdfAnchorFile;
  /** Passages to highlight. */
  citations?: readonly PdfCitation[];

  /** Headline of the header. */
  title?: ReactNode;
  /** Secondary text of the header, shown after a divider. */
  subtitle?: ReactNode;
  /** Headline of the citation panel. */
  heading?: ReactNode;
  /** Explanation under the panel headline. */
  description?: ReactNode;

  /** Page to open first. Defaults to the first citation's page, or 1. */
  initialPage?: number;
  /** Zoom in percent. Defaults to 100. */
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  /** Clockwise rotation in degrees (multiple of 90). */
  initialRotation?: number;
  /** Citation to activate first (index in `citations`). */
  initialCitationIndex?: number;
  /**
   * `page`: prev/next cycle through the citations of the current page.
   * `document`: prev/next walk the whole list and switch pages as needed.
   */
  citationScope?: 'page' | 'document';

  /** Options for the text matcher and the highlighter. */
  highlight?: HighlightOptions;
  /** Smooth-scroll to the active highlight. Defaults to `true`. */
  scrollToActive?: boolean;

  theme?: Partial<PdfAnchorTheme>;
  colorScheme?: PdfAnchorColorScheme;
  className?: string;
  style?: CSSProperties;
  classNames?: PdfAnchorClassNames;
  styles?: PdfAnchorStyles;
  labels?: Partial<PdfAnchorLabels>;

  showHeader?: boolean;
  showRotate?: boolean;
  showToolbar?: boolean;
  showPanel?: boolean;

  renderHeader?: (context: PdfAnchorRenderContext) => ReactNode;
  renderPanel?: (context: PdfAnchorRenderContext) => ReactNode;
  renderToolbar?: (context: PdfAnchorRenderContext) => ReactNode;
  renderLoading?: (message: string) => ReactNode;
  renderError?: (message: string) => ReactNode;

  onPageChange?: (page: number) => void;
  onActiveCitationChange?: (index: number | null, citation: PdfCitation | null) => void;
  /** Called after each page's text layer was matched against its citations. */
  onHighlight?: (results: HighlightResult[], page: number) => void;
  onDocumentLoad?: (info: { numPages: number }) => void;
  onLoadError?: (error: Error) => void;
}
