import { PdfAnchorViewer } from 'pdf-anchor';
import type { PdfCitation } from 'pdf-anchor';
import { SAMPLE_PDF, citations } from '../citations';

const colored: PdfCitation[] = citations.map((citation, index) => ({
  ...citation,
  color: ['#f43f5e', '#10b981', '#38bdf8', '#f59e0b', '#a78bfa'][index % 5],
}));

/** Design tokens, dark scheme, per-citation colors and custom labels. */
export function ThemedDemo() {
  return (
    <PdfAnchorViewer
      file={SAMPLE_PDF}
      citations={colored}
      colorScheme="dark"
      citationScope="document"
      title="Discharge summary"
      subtitle="Jane Roe"
      heading="Clinical facts"
      description="Every citation can carry its own highlight color."
      theme={{
        accent: '#38bdf8',
        radius: '12px',
        fontFamily: "Georgia, 'Times New Roman', serif",
        highlight: 'rgba(56, 189, 248, 0.35)',
        highlightActive: 'rgba(56, 189, 248, 0.6)',
      }}
      labels={{
        citations: 'Quotes',
        citationOf: (current, total) => `${current} / ${total}`,
        previousCitation: 'Previous quote',
        nextCitation: 'Next quote',
        pageLabel: (page) => `Go to page ${page}`,
        zoomIn: 'Make larger',
        zoomOut: 'Make smaller',
      }}
    />
  );
}
