import { PdfAnchorViewer } from '@vefimov/pdf-anchor';
import { SAMPLE_PDF, citations } from '../citations';

/** Per-element class names and inline styles, plus render props that replace whole sections. */
export function CustomSlotsDemo() {
  return (
    <PdfAnchorViewer
      file={SAMPLE_PDF}
      citations={citations}
      className="demo-custom"
      title="Discharge summary"
      subtitle="Custom slots"
      styles={{
        citationQuote: { fontStyle: 'italic' },
        button: { borderRadius: 999 },
      }}
      renderToolbar={({ state, actions }) => (
        <div className="demo-toolbar">
          <button type="button" onClick={actions.previousCitation}>
            Previous
          </button>
          <span>
            Page {state.page} of {state.numPages || '…'} · citation {state.activePosition} of{' '}
            {state.scopeCount}
          </span>
          <button type="button" onClick={actions.nextCitation}>
            Next
          </button>
        </div>
      )}
    />
  );
}
