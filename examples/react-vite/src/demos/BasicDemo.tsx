import { PdfAnchorViewer } from '@vefimov/pdf-anchor';
import { SAMPLE_PDF, citations } from '../citations';

/** Everything on defaults: pass a file and the citations. */
export function BasicDemo() {
  return (
    <PdfAnchorViewer
      file={SAMPLE_PDF}
      citations={citations}
      title="Jane Roe"
      subtitle="discharge-summary.pdf"
      heading="Does the patient have diabetes?"
      description="The record documents type 2 diabetes treated with metformin."
    />
  );
}
