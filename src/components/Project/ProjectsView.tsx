import type { Project, ProjectStatus } from '@/types';
import EmptyState from '../EmptyState';
import ProjectCard from './ProjectCard';

export function ProjectsView({
  projects,
  filter,
  search,
  onFilter,
  onSearch,
  onProject,
  onAdd,
  receiptCount,
  spent,
}: {
  projects: Project[];
  filter: ProjectStatus | 'all';
  search: string;
  onFilter: (filter: ProjectStatus | 'all') => void;
  onSearch: (search: string) => void;
  onProject: (project: Project) => void;
  onAdd: () => void;
  receiptCount: (id: string) => number;
  spent: (id: string) => number;
}) {
  const filtered = projects
    .filter(
      (project) =>
        (filter === 'all' || project.status === filter) &&
        `${project.name} ${project.category}`.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="page fade-in">
      <div className="toolbar">
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="⌕  Search projects..."
        />
        <select
          value={filter}
          onChange={(event) => onFilter(event.target.value as ProjectStatus | 'all')}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {filtered.length ? (
        <div className="project-grid">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              receiptCount={receiptCount(project.id)}
              spent={spent(project.id)}
              onClick={() => onProject(project)}
            />
          ))}
        </div>
      ) : (
        <section className="panel">
          <EmptyState
            text={
              projects.length
                ? 'No matching projects'
                : 'No projects yet. Create your first project to get started.'
            }
          />
          {!projects.length && (
            <button className="button primary center-button" onClick={onAdd}>
              Create Project
            </button>
          )}
        </section>
      )}
    </div>
  );
}
