import { Fragment } from 'react';
import { useLabels, useSlot } from '../context';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon, PlusIcon } from '../icons';
import type { PdfAnchorActions, PdfAnchorState } from '../types';
import { IconButton } from './IconButton';

interface ToolbarProps {
  state: PdfAnchorState;
  actions: PdfAnchorActions;
  minScale: number;
  maxScale: number;
}

export function Toolbar({ state, actions, minScale, maxScale }: ToolbarProps) {
  const slot = useSlot();
  const labels = useLabels();
  const { page, numPages, scale, citationPages } = state;

  return (
    <nav {...slot('toolbar', 'pdf-anchor__toolbar')} aria-label={labels.controls}>
      <div {...slot('toolbarGroup', 'pdf-anchor__toolbar-group')}>
        {citationPages.length > 0 && (
          <div {...slot('pageLinks', 'pdf-anchor__page-links')}>
            <span {...slot('pageLinksLabel', 'pdf-anchor__page-links-label')}>
              {labels.citations}:
            </span>
            {citationPages.map((citationPage, position) => (
              <Fragment key={citationPage}>
                <button
                  type="button"
                  aria-current={citationPage === page ? 'page' : undefined}
                  aria-label={labels.pageLabel(citationPage)}
                  title={labels.pageLabel(citationPage)}
                  onClick={() => actions.goToPage(citationPage)}
                  {...slot('pageLink', 'pdf-anchor__page-link')}
                >
                  {citationPage}
                </button>
                {position < citationPages.length - 1 && <span aria-hidden="true">,</span>}
              </Fragment>
            ))}
          </div>
        )}
      </div>

      <div {...slot('toolbarGroup', 'pdf-anchor__toolbar-group pdf-anchor__toolbar-group--center')}>
        <IconButton label={labels.zoomOut} disabled={scale <= minScale} onClick={actions.zoomOut}>
          <MinusIcon />
        </IconButton>
        <span {...slot('zoom', 'pdf-anchor__zoom')} aria-live="polite">
          {scale}%
        </span>
        <IconButton label={labels.zoomIn} disabled={scale >= maxScale} onClick={actions.zoomIn}>
          <PlusIcon />
        </IconButton>
      </div>

      <div {...slot('toolbarGroup', 'pdf-anchor__toolbar-group pdf-anchor__toolbar-group--end')}>
        <IconButton label={labels.previousPage} disabled={page <= 1} onClick={actions.previousPage}>
          <ArrowUpIcon />
        </IconButton>
        <IconButton
          label={labels.nextPage}
          disabled={numPages === 0 || page >= numPages}
          onClick={actions.nextPage}
        >
          <ArrowDownIcon />
        </IconButton>
      </div>
    </nav>
  );
}
