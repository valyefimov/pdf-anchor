import type { ReactNode } from 'react';

// 24x24 grid, 2px round strokes. Icons are decorative; buttons carry the accessible name.
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const ArrowUpIcon = () => (
  <Icon>
    <path d="m6 15 6-6 6 6" />
  </Icon>
);

export const ArrowDownIcon = () => (
  <Icon>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ArrowLeftIcon = () => (
  <Icon>
    <path d="m15 6-6 6 6 6" />
  </Icon>
);

export const ArrowRightIcon = () => (
  <Icon>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const MinusIcon = () => (
  <Icon>
    <path d="M5 12h14" />
  </Icon>
);

export const PlusIcon = () => (
  <Icon>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const RotateLeftIcon = () => (
  <Icon>
    <path d="M4 4v6h6" />
    <path d="M5.6 15a8 8 0 1 0 1.9-8.3L4 10" />
  </Icon>
);

export const RotateRightIcon = () => (
  <Icon>
    <path d="M20 4v6h-6" />
    <path d="M18.4 15a8 8 0 1 1-1.9-8.3L20 10" />
  </Icon>
);
