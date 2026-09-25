import type { ReactNode } from 'react';

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
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
    <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
  </Icon>
);

export const ArrowDownIcon = () => (
  <Icon>
    <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
  </Icon>
);

export const ArrowLeftIcon = () => (
  <Icon>
    <path d="M13 8H3M7.5 3.5 3 8l4.5 4.5" />
  </Icon>
);

export const ArrowRightIcon = () => (
  <Icon>
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </Icon>
);

export const MinusIcon = () => (
  <Icon>
    <path d="M3 8h10" />
  </Icon>
);

export const PlusIcon = () => (
  <Icon>
    <path d="M3 8h10M8 3v10" />
  </Icon>
);

export const RotateLeftIcon = () => (
  <Icon>
    <path d="M3 3v3.5h3.5" />
    <path d="M3.4 6.5A5 5 0 1 1 3 8.5" />
  </Icon>
);

export const RotateRightIcon = () => (
  <Icon>
    <path d="M13 3v3.5H9.5" />
    <path d="M12.6 6.5A5 5 0 1 0 13 8.5" />
  </Icon>
);
