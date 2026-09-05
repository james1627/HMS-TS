import type { Project, Receipt, User } from "./types";

const read = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback)) as T; } catch { return fallback; }
};

export const storage = {
  users: () => read<User[]>("pv_users", []),
  saveUsers: (users: User[]) => localStorage.setItem("pv_users", JSON.stringify(users)),
  currentUser: () => read<User | null>("pv_current_user", null),
  saveCurrentUser: (user: User | null) => user ? localStorage.setItem("pv_current_user", JSON.stringify(user)) : localStorage.removeItem("pv_current_user"),
  projects: (userId: string) => read<Project[]>(`pv_projects_${userId}`, []),
  saveProjects: (userId: string, projects: Project[]) => localStorage.setItem(`pv_projects_${userId}`, JSON.stringify(projects)),
  receipts: (userId: string, projectId: string) => read<Receipt[]>(`pv_receipts_${userId}_${projectId}`, []),
  saveReceipts: (userId: string, projectId: string, receipts: Receipt[]) => localStorage.setItem(`pv_receipts_${userId}_${projectId}`, JSON.stringify(receipts)),
  deleteReceipts: (userId: string, projectId: string) => localStorage.removeItem(`pv_receipts_${userId}_${projectId}`),
};

export function seedDemoUser() {
  const users = storage.users();
  if (!users.some(user => user.email === "demo@projectvault.com")) storage.saveUsers([...users, { id: "demo1", name: "Demo User", email: "demo@projectvault.com", password: "demo123" }]);
}