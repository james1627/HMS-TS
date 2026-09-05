import type { ProjectStatus } from '@/types';

const statusClass: Record<ProjectStatus, string> = {
  active: 'status-active',
  completed: 'status-completed',
  paused: 'status-paused',
  cancelled: 'status-cancelled',
};

export default function ProjectStatusDetail({ status }: { status: ProjectStatus }) {
  return <span className={`status ${statusClass[status]}`}>{status}</span>;
}
