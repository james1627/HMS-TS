import type { User } from '@/types';
import { Icon } from './Icon';

export default function Sidebar({
  user,
  view,
  open,
  onNavigate,
  onLogout,
  onToggle,
}: {
  user: User;
  view: string;
  open: boolean;
  onNavigate: (view: 'dashboard' | 'projects' | 'project-detail') => void;
  onLogout: () => void;
  onToggle: () => void;
}) {
  return (
    <>
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark small">PV</div>
          <div>
            <strong>ProjectVault</strong>
            <small>Project Manager</small>
          </div>
        </div>
        <nav>
          <button
            className={view === 'dashboard' ? 'active' : ''}
            onClick={() => onNavigate('dashboard')}
          >
            <Icon>▦</Icon>Dashboard
          </button>
          <button
            className={view !== 'dashboard' ? 'active' : ''}
            onClick={() => onNavigate('projects')}
          >
            <Icon>□</Icon>Projects
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-row">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <button className="logout" onClick={onLogout}>
            <Icon>↪</Icon>Sign Out
          </button>
        </div>
      </aside>
      {open && <button className="scrim" aria-label="Close menu" onClick={onToggle} />}
    </>
  );
}
