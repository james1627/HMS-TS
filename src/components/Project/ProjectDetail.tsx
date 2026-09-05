import type { Project, Receipt } from '@/types';
import { currency, dateLabel } from '../helpers';
import StatCard from '../StatCard';
import EmptyState from '../EmptyState';
import ProjectStatusDetail from './ProjectStatusDetail';

export default function ProjectDetail({
  project,
  receipts,
  onBack,
  onEdit,
  onDelete,
  onAddReceipt,
  onReceipt,
}: {
  project: Project;
  receipts: Receipt[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddReceipt: () => void;
  onReceipt: (receipt: Receipt) => void;
}) {
  const spent = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  return (
    <div className="page fade-in">
      <button className="back-button" onClick={onBack}>
        ← Back to Projects
      </button>
      <section className="panel project-header">
        <div className="project-heading">
          <div className="project-avatar huge">{project.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{project.name}</h2>
            <p>
              {project.category || 'Uncategorized'} · Created {dateLabel(project.createdAt)}
            </p>
            <ProjectStatusDetail status={project.status} />
          </div>
        </div>
        <div className="detail-actions">
          <button className="button ghost" onClick={onEdit}>
            Edit
          </button>
          <button className="button danger" onClick={onDelete}>
            Delete
          </button>
        </div>
        {project.description && <p className="description">{project.description}</p>}
      </section>
      <div className="stats-grid detail-stats">
        <StatCard label="Budget" value={currency(project.price)} accent="purple" />
        <StatCard label="Spent" value={currency(spent)} accent="rose" />
        <StatCard label="Remaining" value={currency(project.price - spent)} accent="teal" />
      </div>
      <section className="panel">
        <div className="panel-heading">
          <h3>Receipts ({receipts.length})</h3>
          <button className="button primary" onClick={onAddReceipt}>
            ＋ Add Receipt
          </button>
        </div>
        {receipts.length ? (
          <div className="receipt-grid">
            {receipts.map((receipt) => (
              <button className="receipt-card" key={receipt.id} onClick={() => onReceipt(receipt)}>
                {receipt.image ? (
                  <img src={receipt.image} alt="Receipt" />
                ) : (
                  <div className="receipt-placeholder">▤</div>
                )}
                <div>
                  <strong>{receipt.title || 'Untitled Receipt'}</strong>
                  <span>
                    {dateLabel(receipt.createdAt)} <b>{currency(receipt.amount)}</b>
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState text="No receipts yet. Upload your first receipt!" />
        )}
      </section>
    </div>
  );
}
