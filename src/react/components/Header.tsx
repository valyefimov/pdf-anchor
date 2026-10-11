import type { ReactNode } from 'react';
import { useLabels, useSlot } from '../context';
import { RotateLeftIcon, RotateRightIcon } from '../icons';
import type { PdfAnchorActions } from '../types';
import { IconButton } from './IconButton';

interface HeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  showRotate: boolean;
  actions: Pick<PdfAnchorActions, 'rotateLeft' | 'rotateRight'>;
}

export function Header({ title, subtitle, showRotate, actions }: HeaderProps) {
  const slot = useSlot();
  const labels = useLabels();
  const hasSubtitle = subtitle !== undefined && subtitle !== null && subtitle !== '';

  return (
    <div {...slot('header', 'pdf-anchor__header')}>
      <div {...slot('headerText', 'pdf-anchor__header-text')}>
        {title !== undefined && <h1 {...slot('headerTitle', 'pdf-anchor__title')}>{title}</h1>}
        {title !== undefined && hasSubtitle && (
          <span {...slot('headerDivider', 'pdf-anchor__header-divider')} />
        )}
        {hasSubtitle && <p {...slot('headerSubtitle', 'pdf-anchor__subtitle')}>{subtitle}</p>}
      </div>
      {showRotate && (
        <div {...slot('headerActions', 'pdf-anchor__header-actions')}>
          <IconButton label={labels.rotateLeft} onClick={actions.rotateLeft}>
            <RotateLeftIcon />
          </IconButton>
          <IconButton label={labels.rotateRight} onClick={actions.rotateRight}>
            <RotateRightIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
}
