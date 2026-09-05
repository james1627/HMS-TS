import type { ReactNode } from 'react';

export const Icon = ({ children }: { children: ReactNode }) => (
  <span className="icon" aria-hidden="true">
    {children}
  </span>
);
