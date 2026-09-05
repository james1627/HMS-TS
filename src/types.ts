export type ProjectStatus = 'active' | 'completed' | 'paused' | 'cancelled';
export type User = { id: string; name: string; email: string; password: string };
export type Project = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  status: ProjectStatus;
  createdAt: string;
};
export type Receipt = {
  id: string;
  title: string;
  amount: number;
  notes: string;
  image: string | null;
  createdAt: string;
};
