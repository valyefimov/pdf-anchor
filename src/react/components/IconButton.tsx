import type { ReactNode } from 'react';
import { useSlot } from '../context';

interface IconButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function IconButton({ label, disabled, onClick, children }: IconButtonProps) {
  const slot = useSlot();

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      {...slot('button', 'pdf-anchor__button')}
    >
      {children}
    </button>
  );
}
