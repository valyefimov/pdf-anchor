import { pdfjs } from 'react-pdf';

/**
 * Points pdf.js at its worker script. Call once, before the first viewer mounts.
 *
 * @example
 * // Vite
 * import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
 * configurePdfWorker(workerSrc);
 */
export function configurePdfWorker(workerSrc: string | URL): void {
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc.toString();
}
