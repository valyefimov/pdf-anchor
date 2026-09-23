import { useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Document, Page } from 'react-pdf';
import { CitationPanel } from './components/CitationPanel';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { UiContext, useSlot } from './context';
import { useCitationHighlights } from './hooks/useCitationHighlights';
import { useStableCitations } from './hooks/useStableCitations';
import { useViewerState } from './hooks/useViewerState';
import { INDEX_ATTR } from '../core';
import { defaultLabels } from './labels';
import { themeToStyle } from './theme';
import type { PdfAnchorRenderContext, PdfAnchorViewerProps } from './types';

function Status({ message, busy }: { message: string; busy?: boolean }) {
  const slot = useSlot();
  return (
    <div {...slot('status', 'pdf-anchor__status')} role={busy ? 'status' : 'alert'}>
      {busy && <div className="pdf-anchor__spinner" />}
      {message}
    </div>
  );
}

function ViewerBody(props: PdfAnchorViewerProps & { context: { labels: typeof defaultLabels } }) {
  const {
    file,
    fallbackFile,
    title,
    subtitle,
    heading,
    description,
    highlight,
    scrollToActive = true,
    minScale = 50,
    maxScale = 250,
    showHeader = true,
    showRotate = true,
    showToolbar = true,
    showPanel = true,
    renderHeader,
    renderPanel,
    renderToolbar,
    renderLoading,
    renderError,
    onHighlight,
    onDocumentLoad,
    onLoadError,
    context: { labels },
  } = props;

  const slot = useSlot();
  const citations = useStableCitations(props.citations);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [failedFile, setFailedFile] = useState<unknown>(null);

  const { state, actions, pageIndices, setNumPages } = useViewerState({
    citations,
    initialPage: props.initialPage,
    initialScale: props.initialScale,
    initialRotation: props.initialRotation,
    initialCitationIndex: props.initialCitationIndex,
    minScale,
    maxScale,
    scaleStep: props.scaleStep ?? 10,
    citationScope: props.citationScope ?? 'page',
    onPageChange: props.onPageChange,
    onActiveCitationChange: props.onActiveCitationChange,
  });

  const localActiveIndex = state.activeIndex === null ? -1 : pageIndices.indexOf(state.activeIndex);

  const { results, notifyTextLayerRendered } = useCitationHighlights({
    containerRef: viewportRef,
    citations: state.pageCitations,
    activeIndex: localActiveIndex === -1 ? null : localActiveIndex,
    highlight,
    scrollToActive,
    onResults: (found) => onHighlight?.(found, state.page),
  });

  const activeFound = localActiveIndex === -1 ? null : (results[localActiveIndex]?.found ?? null);
  const fullState = { ...state, activeFound };
  const renderContext: PdfAnchorRenderContext = { state: fullState, actions, labels };

  const source = fallbackFile !== undefined && failedFile === file ? fallbackFile : file;

  const handleViewportClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(`[${INDEX_ATTR}]`);
    const local = Number(target?.getAttribute(INDEX_ATTR));
    const global = pageIndices[local];
    if (target && global !== undefined) {
      actions.selectCitation(global);
    }
  };

  const loading = (message: string) =>
    renderLoading ? renderLoading(message) : <Status message={message} busy />;
  const failure = (message: string) =>
    renderError ? renderError(message) : <Status message={message} />;

  return (
    <>
      {showHeader &&
        (renderHeader ? (
          renderHeader(renderContext)
        ) : (
          <Header title={title} subtitle={subtitle} showRotate={showRotate} actions={actions} />
        ))}

      {/* The click handler only delegates to the highlighted text spans. */}
      <div
        ref={viewportRef}
        onClick={handleViewportClick}
        {...slot('viewport', 'pdf-anchor__viewport')}
      >
        <div {...slot('documentFrame', 'pdf-anchor__document')}>
          <Document
            file={source}
            loading={loading(labels.loadingDocument)}
            error={failure(labels.loadError)}
            onLoadError={(error) => {
              if (fallbackFile !== undefined && source === file) {
                setFailedFile(file);
              } else {
                onLoadError?.(error);
              }
            }}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              onDocumentLoad?.({ numPages });
            }}
          >
            <Page
              pageNumber={state.page}
              scale={state.scale / 100}
              rotate={state.rotation}
              renderTextLayer
              renderAnnotationLayer={false}
              loading={loading(labels.loadingPage)}
              onRenderTextLayerSuccess={notifyTextLayerRendered}
            />
          </Document>
        </div>
      </div>

      {(showPanel || showToolbar) && (
        <div {...slot('footer', 'pdf-anchor__footer')}>
          {showPanel &&
            (renderPanel ? (
              renderPanel(renderContext)
            ) : (
              <CitationPanel
                heading={heading}
                description={description}
                state={fullState}
                actions={actions}
              />
            ))}
          {showToolbar &&
            (renderToolbar ? (
              renderToolbar(renderContext)
            ) : (
              <Toolbar
                state={fullState}
                actions={actions}
                minScale={minScale}
                maxScale={maxScale}
              />
            ))}
        </div>
      )}
    </>
  );
}

export function PdfAnchorViewer(props: PdfAnchorViewerProps) {
  const { theme, colorScheme = 'light', className, style, classNames, styles, labels } = props;

  const mergedLabels = useMemo(() => ({ ...defaultLabels, ...labels }), [labels]);
  const ui = useMemo(
    () => ({ labels: mergedLabels, classNames, styles }),
    [mergedLabels, classNames, styles],
  );
  const mergedStyle = useMemo(() => ({ ...themeToStyle(theme), ...style }), [theme, style]);

  return (
    <UiContext.Provider value={ui}>
      <div
        className={['pdf-anchor', className].filter(Boolean).join(' ')}
        style={mergedStyle}
        data-color-scheme={colorScheme}
      >
        <ViewerBody {...props} context={{ labels: mergedLabels }} />
      </div>
    </UiContext.Provider>
  );
}
