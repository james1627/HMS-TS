import './index.css';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthView from './components/AuthView';
import { seedDemoUser, storage } from './storage';
import type { Project, Receipt, User } from './types';
import type UIState from './UIState';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/Project/ProjectDetail';
import { ProjectForm } from './components/Project/ProjectForm';
import { ProjectsView } from './components/Project/ProjectsView';
import { ReceiptForm } from './components/Receipt/ReceiptForm';
import { ReceiptView } from './components/Receipt/ReceiptView';

const initialUIState: UIState = {
  view: 'dashboard',
  projectId: undefined,
  modal: null,
  filter: 'all',
  search: '',
  sidebarOpen: false,
};

export function App() {
  const [user, setUser] = useState<User | null>(() => {
    seedDemoUser();
    return storage.currentUser();
  });

  const [register, setRegister] = useState(false);

  const [ui, setUI] = useState<UIState>(initialUIState);

  const [projects, setProjects] = useState<Project[]>(() =>
    user ? storage.projects(user.id) : [],
  );

  // --------------------------------------------------
  // Derived data
  // --------------------------------------------------

  const selected = projects.find((project) => project.id === ui.projectId) ?? null;

  const editing =
    ui.modal && ui.modal.type === 'project' && ui.modal.projectId
      ? projects.find((project) => project.id === ui.modal.projectId)
      : undefined;

  const receipts = selected ? storage.receipts(user!.id, selected.id) : [];

  const viewingReceipt =
    ui.modal && ui.modal.type === 'view-receipt'
      ? (receipts.find((receipt) => receipt.id === ui.modal.receiptId) ?? null)
      : null;

  const title =
    ui.view === 'project-detail'
      ? (selected?.name ?? 'Project')
      : ui.view === 'dashboard'
        ? 'Dashboard'
        : 'Projects';

  // --------------------------------------------------
  // UI helpers
  // --------------------------------------------------

  const updateUI = (changes: Partial<UIState>) => {
    setUI((current) => ({
      ...current,
      ...changes,
    }));
  };

  const openProject = (project: Project) => {
    updateUI({
      view: 'project-detail',
      projectId: project.id,
    });
  };

  const openNewProject = () => {
    updateUI({
      modal: { type: 'project' },
    });
  };

  const closeModal = () => {
    updateUI({
      modal: null,
    });
  };

  // --------------------------------------------------
  // Project actions
  // --------------------------------------------------

  const saveProject = (data: Omit<Project, 'id' | 'createdAt'>) => {
    if (!user) return;

    const updated = editing
      ? projects.map((project) => (project.id === editing.id ? { ...editing, ...data } : project))
      : [
          ...projects,
          {
            ...data,
            id: `p_${Date.now()}`,
            createdAt: new Date().toISOString(),
          },
        ];

    setProjects(updated);
    storage.saveProjects(user.id, updated);

    closeModal();
  };

  const deleteProject = () => {
    if (!user || !selected) return;

    if (!window.confirm('Delete this project and all its receipts?')) {
      return;
    }

    const updated = projects.filter((project) => project.id !== selected.id);

    setProjects(updated);
    storage.saveProjects(user.id, updated);
    storage.deleteReceipts(user.id, selected.id);

    updateUI({
      view: 'projects',
      projectId: undefined,
    });
  };

  // --------------------------------------------------
  // Receipt actions
  // --------------------------------------------------

  const addReceipt = (data: Omit<Receipt, 'id' | 'createdAt'>) => {
    if (!user || !selected) return;

    const updatedReceipts = [
      ...receipts,
      {
        ...data,
        id: `r_${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    ];

    storage.saveReceipts(user.id, selected.id, updatedReceipts);

    closeModal();
  };

  const deleteReceipt = () => {
    if (!user || !selected || !viewingReceipt) return;

    if (!window.confirm('Delete this receipt?')) {
      return;
    }

    const updatedReceipts = receipts.filter((receipt) => receipt.id !== viewingReceipt.id);

    storage.saveReceipts(user.id, selected.id, updatedReceipts);

    closeModal();
  };

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  if (!user) {
    return (
      <AuthView
        register={register}
        onLogin={(email, password) => {
          const found = storage
            .users()
            .find((item) => item.email === email && item.password === password);

          if (found) {
            storage.saveCurrentUser(found);
            setUser(found);

            setProjects(storage.projects(found.id));
          } else {
            window.alert('Invalid email or password');
          }
        }}
        onRegister={(name, email, password) => {
          if (storage.users().some((item) => item.email === email)) {
            return window.alert('Email already registered');
          }

          const created: User = {
            id: `u_${Date.now()}`,
            name,
            email,
            password,
          };

          storage.saveUsers([...storage.users(), created]);

          storage.saveCurrentUser(created);

          setUser(created);
          setProjects([]);
        }}
      />
    );
  }

  // --------------------------------------------------
  // Main application
  // --------------------------------------------------

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        view={ui.view}
        open={ui.sidebarOpen}
        onToggle={() => updateUI({ sidebarOpen: false })}
        onNavigate={(next) =>
          updateUI({
            view: next,
            projectId: next === 'project-detail' ? ui.projectId : undefined,
            sidebarOpen: false,
          })
        }
        onLogout={() => {
          storage.saveCurrentUser(null);
          setUser(null);
          setProjects([]);
          setUI(initialUIState);
        }}
      />

      <div className="app-content">
        <Header
          title={title}
          onMenu={() => updateUI({ sidebarOpen: true })}
          onAdd={ui.view === 'projects' ? openNewProject : undefined}
        />

        <main>
          {ui.view === 'dashboard' && (
            <Dashboard
              projects={projects}
              receiptCount={(id) => storage.receipts(user.id, id).length}
              onProject={openProject}
              onAdd={openNewProject}
              onProjects={() =>
                updateUI({
                  view: 'projects',
                  projectId: undefined,
                })
              }
            />
          )}

          {ui.view === 'projects' && (
            <ProjectsView
              projects={projects}
              filter={ui.filter}
              search={ui.search}
              onFilter={(filter) => updateUI({ filter })}
              onSearch={(search) => updateUI({ search })}
              receiptCount={(id) => storage.receipts(user.id, id).length}
              spent={(id) =>
                storage.receipts(user.id, id).reduce((sum, receipt) => sum + receipt.amount, 0)
              }
              onProject={openProject}
              onAdd={openNewProject}
            />
          )}

          {ui.view === 'project-detail' && selected && (
            <ProjectDetail
              project={selected}
              receipts={receipts}
              onBack={() =>
                updateUI({
                  view: 'projects',
                  projectId: undefined,
                })
              }
              onEdit={() =>
                updateUI({
                  modal: {
                    type: 'project',
                    projectId: selected.id,
                  },
                })
              }
              onDelete={deleteProject}
              onAddReceipt={() =>
                updateUI({
                  modal: { type: 'receipt' },
                })
              }
              onReceipt={(receipt) =>
                updateUI({
                  modal: {
                    type: 'view-receipt',
                    receiptId: receipt.id,
                  },
                })
              }
            />
          )}
        </main>
      </div>

      {ui.modal?.type === 'project' && (
        <ProjectForm project={editing} onSubmit={saveProject} onClose={closeModal} />
      )}

      {ui.modal?.type === 'receipt' && <ReceiptForm onSubmit={addReceipt} onClose={closeModal} />}

      {ui.modal?.type === 'view-receipt' && viewingReceipt && (
        <ReceiptView receipt={viewingReceipt} onClose={closeModal} onDelete={deleteReceipt} />
      )}
    </div>
  );
}

export default App;
