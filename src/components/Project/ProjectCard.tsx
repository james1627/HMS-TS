import type { Project } from '@/types';
import { currency, dateLabel } from '../helpers';
import ProjectStatusDetail from './ProjectStatusDetail';

export default function ProjectCard({
  project,
  receiptCount,
  spent,
  onClick,
}: {
  project: Project;
  receiptCount: number;
  spent: number;
  onClick: () => void;
}) {
  const percent = project.price > 0 ? Math.min(100, (spent / project.price) * 100) : 0;
  return (
    <button className="project-card" onClick={onClick}>
      <div className="card-top">
        <div className="project-avatar large">{project.name.charAt(0).toUpperCase()}</div>
        <ProjectStatusDetail status={project.status} />
      </div>
      <h3>{project.name}</h3>
      <p>
        {project.category || 'Uncategorized'} · {dateLabel(project.createdAt)}
      </p>
      <div className="budget">
        <span>Budget used</span>
        <b>
          {currency(spent)} / {currency(project.price)}
        </b>
      </div>
      <div className="progress">
        <i style={{ width: `${percent}%` }} />
      </div>
      <div className="card-bottom">
        <span>
          ▤ {receiptCount} receipt{receiptCount !== 1 ? 's' : ''}
        </span>
        <b>{currency(project.price)}</b>
      </div>
    </button>
  );
}
