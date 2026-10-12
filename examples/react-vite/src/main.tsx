import '@fontsource-variable/inter';
import { configurePdfWorker } from '@efa/pdf-anchor';
import '@efa/pdf-anchor/styles.css';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'react-pdf/dist/Page/TextLayer.css';
import { App } from './App';
import './demo.css';

// pdf.js needs to know where its worker lives. Do this once, before any viewer mounts.
configurePdfWorker(workerSrc);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
