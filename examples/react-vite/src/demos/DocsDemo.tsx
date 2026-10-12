const repo = 'https://github.com/valyefimov/pdf-anchor';

const install = 'npm install @efa/pdf-anchor react react-dom react-pdf pdfjs-dist';

const quickstart = `import { PdfAnchorViewer, configurePdfWorker } from '@efa/pdf-anchor';
import '@efa/pdf-anchor/styles.css';
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

const links = [
  { label: 'README', note: 'Overview and use cases', href: `${repo}#readme` },
  { label: 'API reference', note: 'Props, callbacks, hook', href: `${repo}/blob/main/docs/api.md` },
  {
    label: 'Theming',
    note: 'Tokens, slots, render props',
    href: `${repo}/blob/main/docs/theming.md`,
  },
  { label: 'Core', note: 'Use it without React', href: `${repo}/blob/main/docs/core.md` },
  {
    label: 'How it works',
    note: 'Matching and limits',
    href: `${repo}/blob/main/docs/how-it-works.md`,
  },
  {
    label: 'Accessibility',
    note: 'WCAG 2.2 AA and keyboard',
    href: `${repo}/blob/main/docs/accessibility.md`,
  },
];

export function DocsDemo() {
  return (
    <main className="demo-docs">
      <header className="demo-hero">
        <h1>pdf-anchor</h1>
        <p>
          Show people exactly where an answer came from. Pass a PDF and a list of quotes: the viewer
          finds each quote in the page text, highlights it, and lets readers step from citation to
          citation. The other tabs run it against a real PDF.
        </p>
      </header>

      <h2>Install</h2>
      <pre className="demo-code" tabIndex={0}>
        <code>{install}</code>
      </pre>

      <h2>Quick start</h2>
      <pre className="demo-code" tabIndex={0}>
        <code>{quickstart}</code>
      </pre>

      <h2>Documentation</h2>
      <ul className="demo-cards">
        {links.map((link) => (
          <li key={link.href}>
            <a className="demo-card" href={link.href}>
              <strong>{link.label}</strong>
              <span>{link.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
