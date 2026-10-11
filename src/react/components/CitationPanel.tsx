import type { CSSProperties, ReactNode } from 'react';
import { useLabels, useSlot } from '../context';
import { ArrowLeftIcon, ArrowRightIcon } from '../icons';
import type { PdfAnchorActions, PdfAnchorState } from '../types';
import { IconButton } from './IconButton';

interface CitationPanelProps {
  heading?: ReactNode;
  description?: ReactNode;
  state: PdfAnchorState;
  actions: PdfAnchorActions;
}

export function CitationPanel({ heading, description, state, actions }: CitationPanelProps) {
  const slot = useSlot();
  const labels = useLabels();
  const { activeCitation, activePosition, scopeCount, activeFound } = state;

  if (!activeCitation) {
    return null;
  }

  const quote =
    activeCitation.quote ??
    (Array.isArray(activeCitation.text) ? activeCitation.text.join('\n\n') : activeCitation.text);
  const panel = slot('panel', 'pdf-anchor__panel');
  const citationColor = activeCitation.color
    ? ({ '--pdf-anchor-citation-color': activeCitation.color } as CSSProperties)
    : undefined;

  return (
    <section className={panel.className} style={{ ...citationColor, ...panel.style }}>
      <div {...slot('panelMain', 'pdf-anchor__panel-main')}>
        {heading !== undefined && (
          <h2 {...slot('panelHeading', 'pdf-anchor__panel-heading')}>{heading}</h2>
        )}
        {description !== undefined && (
          <div {...slot('panelDescription', 'pdf-anchor__panel-description')}>{description}</div>
        )}
      </div>
      <div {...slot('panelDivider', 'pdf-anchor__panel-divider')} />
      <div {...slot('citation', 'pdf-anchor__citation')}>
        <div {...slot('citationHead', 'pdf-anchor__citation-head')}>
          {activeCitation.title && (
            <p {...slot('citationTitle', 'pdf-anchor__citation-title')}>{activeCitation.title}</p>
          )}
          {scopeCount > 1 && (
            <div {...slot('citationCounter', 'pdf-anchor__citation-counter')} aria-live="polite">
              <IconButton
                label={labels.previousCitation}
                disabled={activePosition <= 1}
                onClick={actions.previousCitation}
              >
                <ArrowLeftIcon />
              </IconButton>
              <span>{labels.citationOf(activePosition, scopeCount)}</span>
              <IconButton
                label={labels.nextCitation}
                disabled={activePosition >= scopeCount}
                onClick={actions.nextCitation}
              >
                <ArrowRightIcon />
              </IconButton>
            </div>
          )}
        </div>
        <p {...slot('citationQuote', 'pdf-anchor__citation-quote')}>{quote}</p>
        {activeFound === false && (
          <p {...slot('citationNote', 'pdf-anchor__citation-note')} role="status">
            {labels.notFoundOnPage}
          </p>
        )}
      </div>
    </section>
  );
}
