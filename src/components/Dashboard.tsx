import type { Project } from '@/types';
import StatCard from './StatCard';
import { currency } from './helpers';
import EmptyState from './EmptyState';
import ProjectStatusDetail from './Project/ProjectStatusDetail';

export default function Dashboard({
  projects,
  receiptCount,
  onProject,
  onAdd,
  onProjects,
}: {
  projects: Project[];
  receiptCount: (id: string) => number;
  onProject: (project: Project) => void;
  onAdd: () => void;
  onProjects: () => void;
}) {
  const totalValue = projects.reduce((sum, project) => sum + project.price, 0);
  const totalReceipts = projects.reduce((sum, project) => sum + receiptCount(project.id), 0);
  const recent = [...projects].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  return (
    <div className="page fade-in">
      <div className="stats-grid">
        <StatCard label="Total Projects" value={projects.length} accent="purple" />
        <StatCard label="Total Value" value={currency(totalValue)} accent="teal" />
        <StatCard
          label="Active Projects"
          value={projects.filter((p) => p.status === 'active').length}
          accent="amber"
        />
        <StatCard label="Total Receipts" value={totalReceipts} accent="rose" />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <h3>Recent Projects</h3>
            <button className="text-button" onClick={onProjects}>
              View all →
            </button>
          </div>
          {recent.length ? (
            <div className="recent-list">
              {recent.map((project) => (
                <button className="recent-item" key={project.id} onClick={() => onProject(project)}>
                  <div className="project-avatar">{project.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{project.name}</strong>
                    <small>{project.category || 'Uncategorized'}</small>
                  </div>
                  <ProjectStatusDetail status={project.status} />
                  <b>{currency(project.price)}</b>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState text="No projects yet. Create your first one!" />
          )}
        </section>
        <section className="panel quick-actions">
          <h3>Quick Actions</h3>
          <button onClick={onAdd}>
            <span>＋</span>
            <div>
              <strong>New Project</strong>
              <small>Add a project with pricing</small>
            </div>
          </button>
          <button onClick={onProjects}>
            <span>□</span>
            <div>
              <strong>View Projects</strong>
              <small>Manage all projects</small>
            </div>
          </button>
        </section>
      </div>
    </div>
  );
}
