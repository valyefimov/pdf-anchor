import { useCitationHighlights } from 'pdf-anchor';
import { useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { SAMPLE_PDF, citations } from '../citations';

/** Bring your own UI: only the matching/highlighting is taken from pdf-anchor. */
export function HeadlessDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(2);
  const [active, setActive] = useState(0);
  const pageCitations = citations.filter((citation) => citation.page === page);

  const { results, notifyTextLayerRendered } = useCitationHighlights({
    containerRef,
    citations: pageCitations,
    activeIndex: active,
  });

  return (
    <div style={{ padding: 16, fontFamily: 'system-ui' }}>
      <p>
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              setPage(n);
              setActive(0);
            }}
          >
            page {n}
          </button>
        ))}
      </p>
      <ul>
        {pageCitations.map((citation, index) => (
          <li key={citation.id}>
            <button type="button" onClick={() => setActive(index)}>
              {citation.title}
            </button>{' '}
            {results[index] ? (results[index].found ? '✅ found' : '❌ not found') : ''}
          </li>
        ))}
      </ul>
      <div ref={containerRef}>
        <Document file={SAMPLE_PDF}>
          <Page
            pageNumber={page}
            renderAnnotationLayer={false}
            onRenderTextLayerSuccess={notifyTextLayerRendered}
          />
        </Document>
      </div>
    </div>
  );
}
