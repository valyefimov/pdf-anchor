import type { PdfAnchorLabels } from './types';

export const defaultLabels: PdfAnchorLabels = {
  citations: 'Citations',
  citationOf: (current, total) => `${current} of ${total}`,
  previousCitation: 'Previous citation',
  nextCitation: 'Next citation',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  rotateLeft: 'Rotate left',
  rotateRight: 'Rotate right',
  pageLabel: (page) => `Page ${page}`,
  loadingDocument: 'It may take a few seconds to load the PDF file.',
  loadingPage: 'Loading page…',
  loadError: 'Failed to load the PDF file.',
  notFoundOnPage: 'This passage could not be located in the page text.',
};
