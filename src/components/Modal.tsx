import type { ReactNode } from 'react';

export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="modal slide-up">
        <div className="modal-heading">
          <h3>{title}</h3>
          <button onClick={onClose}>×</button>
        </div>
        {children}
      </section>
    </div>
  );
}
