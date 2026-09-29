const repo = 'https://github.com/valyefimov/pdf-anchor';

const install = `npm install pdf-anchor react react-dom react-pdf pdfjs-dist`;

const quickstart = `import { PdfAnchorViewer, configurePdfWorker } from 'pdf-anchor';
import 'pdf-anchor/styles.css';
import 'react-pdf/dist/Page/TextLayer.css';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

configurePdfWorker(workerSrc);

export function Report() {
  return (
    <PdfAnchorViewer
      file="/records/discharge.pdf"
      citations={[
        { page: 1, title: 'Diagnosis', text: 'type 2 diabetes mellitus' },
        { page: 3, title: 'Medication', text: ['metformin 500 mg', 'twice daily'] },
      ]}
    />
  );
}`;

const links: [string, string][] = [
  ['README', `${repo}#readme`],
  ['API reference', `${repo}/blob/main/docs/api.md`],
  ['Theming and styling', `${repo}/blob/main/docs/theming.md`],
  ['Framework-agnostic core', `${repo}/blob/main/docs/core.md`],
  ['How matching works', `${repo}/blob/main/docs/how-it-works.md`],
];

export function DocsDemo() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 16px', lineHeight: 1.6 }}>
      <h1>pdf-anchor</h1>
      <p>
        Highlight citations inside a PDF and jump between them. Pass the PDF and a list of text
        passages; the viewer finds each passage in the page text, highlights it, and lets people
        step through the citations. The other tabs show the viewer running against a real PDF.
      </p>
      <h2>Install</h2>
      <pre>
        <code>{install}</code>
      </pre>
      <h2>Quick start</h2>
      <pre style={{ overflow: 'auto', padding: 12, background: '#f3f4f6', borderRadius: 8 }}>
        <code>{quickstart}</code>
      </pre>
      <h2>Documentation</h2>
      <ul>
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
