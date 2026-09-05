import "./index.css";
import { useEffect, useState } from "react";
import { AuthView, Dashboard, Header, ProjectDetail, ProjectForm, ProjectsView, ReceiptForm, ReceiptView, Sidebar } from "./components/ProjectVault";
import { seedDemoUser, storage } from "./storage";
import type { Project, ProjectStatus, Receipt, User } from "./types";

type View = "dashboard" | "projects" | "project-detail";
type Modal = "project" | "receipt" | "view-receipt" | null;

export function App() {
  const [user, setUser] = useState<User | null>(() => { seedDemoUser(); return storage.currentUser(); });
  const [register, setRegister] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [editing, setEditing] = useState<Project>();
  const [viewingReceipt, setViewingReceipt] = useState<Receipt | null>(null);
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { const toggle = () => setRegister(value => !value); window.addEventListener("toggle-auth", toggle); return () => window.removeEventListener("toggle-auth", toggle); }, []);
  useEffect(() => { if (user) setProjects(storage.projects(user.id)); }, [user]);
  if (!user) return <AuthView register={register} onLogin={(email, password) => { const found = storage.users().find(item => item.email === email && item.password === password); if (found) { storage.saveCurrentUser(found); setUser(found); } else window.alert("Invalid email or password"); }} onRegister={(name, email, password) => { if (storage.users().some(item => item.email === email)) return window.alert("Email already registered"); const created = { id: `u_${Date.now()}`, name, email, password }; storage.saveUsers([...storage.users(), created]); storage.saveCurrentUser(created); setUser(created); }} />;

  const receipts = selected ? storage.receipts(user.id, selected.id) : [];
  const saveProject = (data: Omit<Project, "id" | "createdAt">) => { const updated = editing ? projects.map(project => project.id === editing.id ? { ...editing, ...data } : project) : [...projects, { ...data, id: `p_${Date.now()}`, createdAt: new Date().toISOString() }]; setProjects(updated); storage.saveProjects(user.id, updated); setModal(null); setEditing(undefined); };
  const addReceipt = (data: Omit<Receipt, "id" | "createdAt">) => { if (!selected) return; storage.saveReceipts(user.id, selected.id, [...receipts, { ...data, id: `r_${Date.now()}`, createdAt: new Date().toISOString() }]); setModal(null); };
  const deleteProject = () => { if (!selected || !window.confirm("Delete this project and all its receipts?")) return; const updated = projects.filter(project => project.id !== selected.id); setProjects(updated); storage.saveProjects(user.id, updated); storage.deleteReceipts(user.id, selected.id); setSelected(null); setView("projects"); };
  const title = view === "project-detail" ? selected?.name ?? "Project" : view === "dashboard" ? "Dashboard" : "Projects";
  const openProject = (project: Project) => { setSelected(project); setView("project-detail"); };
  const openNewProject = () => { setEditing(undefined); setModal("project"); };
  return <div className="app-shell"><Sidebar user={user} view={view} open={sidebarOpen} onToggle={() => setSidebarOpen(false)} onNavigate={next => { setView(next); setSidebarOpen(false); }} onLogout={() => { storage.saveCurrentUser(null); setUser(null); }} /><div className="app-content"><Header title={title} onMenu={() => setSidebarOpen(true)} onAdd={view === "projects" ? openNewProject : undefined} /><main>{view === "dashboard" && <Dashboard projects={projects} receiptCount={id => storage.receipts(user.id, id).length} onProject={openProject} onAdd={openNewProject} onProjects={() => setView("projects")} />}{view === "projects" && <ProjectsView projects={projects} filter={filter} search={search} onFilter={setFilter} onSearch={setSearch} receiptCount={id => storage.receipts(user.id, id).length} spent={id => storage.receipts(user.id, id).reduce((sum, receipt) => sum + receipt.amount, 0)} onProject={openProject} onAdd={openNewProject} />}{view === "project-detail" && selected && <ProjectDetail project={selected} receipts={receipts} onBack={() => setView("projects")} onEdit={() => { setEditing(selected); setModal("project"); }} onDelete={deleteProject} onAddReceipt={() => setModal("receipt")} onReceipt={receipt => { setViewingReceipt(receipt); setModal("view-receipt"); }} />}</main></div>{modal === "project" && <ProjectForm project={editing} onSubmit={saveProject} onClose={() => setModal(null)} />}{modal === "receipt" && <ReceiptForm onSubmit={addReceipt} onClose={() => setModal(null)} />}{modal === "view-receipt" && viewingReceipt && <ReceiptView receipt={viewingReceipt} onClose={() => setModal(null)} onDelete={() => { if (!selected || !window.confirm("Delete this receipt?")) return; storage.saveReceipts(user.id, selected.id, receipts.filter(receipt => receipt.id !== viewingReceipt.id)); setModal(null); }} />}</div>;
}

export default App;
