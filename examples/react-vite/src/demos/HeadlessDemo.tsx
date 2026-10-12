import { useCitationHighlights } from '@vefimov/pdf-anchor';
import { useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { SAMPLE_PDF, citations } from '../citations';

const PAGES = [1, 2, 3, 4, 5, 6];

/** Bring your own UI: only the matching and highlighting come from @vefimov/pdf-anchor. */
export function HeadlessDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(3);
  const [active, setActive] = useState(0);
  const pageCitations = citations.filter((citation) => citation.page === page);

  const { results, notifyTextLayerRendered } = useCitationHighlights({
    containerRef,
    citations: pageCitations,
    activeIndex: active,
  });

  return (
    <div className="demo-headless">
      <aside className="demo-side">
        <section>
          <h2>Page</h2>
          <div className="demo-chips">
            {PAGES.map((number) => (
              <button
                key={number}
                type="button"
                className="demo-chip"
                aria-pressed={number === page}
                onClick={() => {
                  setPage(number);
                  setActive(0);
                }}
              >
                {number}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Citations on this page</h2>
          {pageCitations.length === 0 ? (
            <p>No citations on this page.</p>
          ) : (
            <ul className="demo-list">
              {pageCitations.map((citation, index) => {
                const found = results[index]?.found;
                return (
                  <li key={citation.id}>
                    <button
                      type="button"
                      className="demo-item"
                      aria-pressed={index === active}
                      onClick={() => setActive(index)}
                    >
                      <span>{citation.title}</span>
                      {found !== undefined && (
                        <span
                          className={`demo-badge ${found ? 'demo-badge--ok' : 'demo-badge--missing'}`}
                        >
                          {found ? 'found' : 'not found'}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </aside>

      <div ref={containerRef} className="demo-page">
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
