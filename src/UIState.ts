import type { ProjectStatus } from './types';

type View = 'dashboard' | 'projects' | 'project-detail';

type Modal =
  | null
  | { type: 'project'; projectId?: string }
  | { type: 'receipt' }
  | { type: 'view-receipt'; receiptId: string };

export default interface UIState {
  view: View;
  projectId?: string;
  modal: Modal;
  filter: ProjectStatus | 'all';
  search: string;
  sidebarOpen: boolean;
}
