import { PdfAnchorViewer } from 'pdf-anchor';
import { SAMPLE_PDF, citations } from '../citations';

/** Per-element class names / inline styles, plus render props that replace whole sections. */
export function CustomSlotsDemo() {
  return (
    <PdfAnchorViewer
      file={SAMPLE_PDF}
      citations={citations}
      title="Custom slots"
      classNames={{ panel: 'demo-panel' }}
      styles={{
        header: { background: '#fef3c7' },
        citationQuote: { fontStyle: 'italic' },
        button: { borderRadius: 999 },
      }}
      renderToolbar={({ state, actions }) => (
        <div style={{ display: 'flex', gap: 8, padding: 12, justifyContent: 'center' }}>
          <button type="button" onClick={actions.previousCitation}>
            ◀
          </button>
          <strong>
            page {state.page} / {state.numPages || '…'} · citation {state.activePosition} of{' '}
            {state.scopeCount}
          </strong>
          <button type="button" onClick={actions.nextCitation}>
            ▶
          </button>
        </div>
      )}
    />
  );
}
