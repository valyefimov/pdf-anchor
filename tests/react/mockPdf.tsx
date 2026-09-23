import type { ReactNode } from 'react';
import { useEffect } from 'react';

/** Fake page texts: one array of text-layer fragments per page. */
export const PAGES: string[][] = [
  [
    'Discharge summary for',
    'John Doe.',
    'Patient was admitted',
    'with chest pain and',
    'treated for type 2',
    'diabetes.',
  ],
  ['Medication list:', 'Metformin 500 mg', 'twice daily with meals.'],
  ['Follow up in two weeks', 'with the primary physician.'],
];

export const documentProps: { current: Record<string, unknown> } = { current: {} };

export function MockDocument(props: {
  file: unknown;
  children?: ReactNode;
  loading?: ReactNode;
  error?: ReactNode;
  onLoadSuccess?: (info: { numPages: number }) => void;
  onLoadError?: (error: Error) => void;
}) {
  const { file, children, onLoadSuccess, onLoadError } = props;
  useEffect(() => {
    documentProps.current = { file };
    if (file === 'broken.pdf') {
      onLoadError?.(new Error('boom'));
    } else {
      onLoadSuccess?.({ numPages: PAGES.length });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return <div data-testid="document">{children}</div>;
}

export function MockPage(props: {
  pageNumber: number;
  scale: number;
  rotate: number;
  onRenderTextLayerSuccess?: () => void;
}) {
  const { pageNumber, scale, rotate, onRenderTextLayerSuccess } = props;

  useEffect(() => {
    onRenderTextLayerSuccess?.();
  }, [pageNumber, scale, rotate, onRenderTextLayerSuccess]);

  return (
    <div data-testid="page" data-page={pageNumber} data-scale={scale} data-rotate={rotate}>
      <div className="textLayer">
        {(PAGES[pageNumber - 1] ?? []).map((text) => (
          <span key={text} role="presentation">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export const pdfjs = { GlobalWorkerOptions: { workerSrc: '' } };
