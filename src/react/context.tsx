import { createContext, useContext } from 'react';
import type { CSSProperties } from 'react';
import type { PdfAnchorClassNames, PdfAnchorLabels, PdfAnchorSlot, PdfAnchorStyles } from './types';

export interface SlotProps {
  className: string;
  style: CSSProperties | undefined;
}

export interface PdfAnchorUi {
  labels: PdfAnchorLabels;
  classNames: PdfAnchorClassNames | undefined;
  styles: PdfAnchorStyles | undefined;
}

export const UiContext = createContext<PdfAnchorUi | null>(null);

function useUi(): PdfAnchorUi {
  const ui = useContext(UiContext);
  if (!ui) {
    throw new Error('pdf-anchor components must be rendered inside <PdfAnchorViewer>.');
  }
  return ui;
}

export function useLabels(): PdfAnchorLabels {
  return useUi().labels;
}

/** Returns a helper that merges a slot's default class with the consumer's overrides. */
export function useSlot(): (slot: PdfAnchorSlot, base: string) => SlotProps {
  const { classNames, styles } = useUi();

  return (slot, base) => ({
    className: [base, classNames?.[slot]].filter(Boolean).join(' '),
    style: styles?.[slot],
  });
}
