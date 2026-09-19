import { useCallback, useMemo, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useCitationHighlights } from './hooks/useCitationHighlights';
import { Header } from './components/Header';
import { UiContext, useSlot } from './context';
import { defaultLabels } from './labels';
import { themeToStyle } from './theme';
import type { PdfAnchorViewerProps } from './types';

function Spinner({ message }: { message: string }) {
  const slot = useSlot();
  return (
    <div {...slot('status', 'pdf-anchor__status')} role="status">
      <div className="pdf-anchor__spinner" />
      {message}
    </div>
  );
}

function ViewerBody(props: PdfAnchorViewerProps) {
  const { file, citations = [], title, subtitle, initialPage, highlight, onHighlight } = props;
  const slot = useSlot();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [page] = useState(initialPage ?? citations[0]?.page ?? 1);

  const pageCitations = useMemo(
    () => citations.filter((citation) => citation.page === page),
    [citations, page],
  );

  const { notifyTextLayerRendered } = useCitationHighlights({
    containerRef: viewportRef,
    citations: pageCitations,
    activeIndex: pageCitations.length > 0 ? 0 : null,
    highlight,
    onResults: (results) => onHighlight?.(results, page),
  });

  return (
    <>
      <Header title={title} subtitle={subtitle} showRotate={false} actions={{ rotateLeft() {}, rotateRight() {} }} />
      <div ref={viewportRef} {...slot('viewport', 'pdf-anchor__viewport')}>
        <div {...slot('documentFrame', 'pdf-anchor__document')}>
          <Document
            file={file}
            loading={<Spinner message={defaultLabels.loadingDocument} />}
            onLoadSuccess={({ numPages: total }) => setNumPages(total)}
          >
            <Page
              pageNumber={page}
              renderTextLayer
              renderAnnotationLayer={false}
              onRenderTextLayerSuccess={notifyTextLayerRendered}
            />
          </Document>
        </div>
      </div>
      <span hidden>{numPages}</span>
    </>
  );
}

export function PdfAnchorViewer(props: PdfAnchorViewerProps) {
  const { theme, className, style } = props;
  const ui = useMemo(
    () => ({ labels: defaultLabels, classNames: props.classNames, styles: props.styles }),
    [props.classNames, props.styles],
  );
  const mergedStyle = useCallback(() => ({ ...themeToStyle(theme), ...style }), [theme, style]);

  return (
    <UiContext.Provider value={ui}>
      <div className={['pdf-anchor', className].filter(Boolean).join(' ')} style={mergedStyle()}>
        <ViewerBody {...props} />
      </div>
    </UiContext.Provider>
  );
}
