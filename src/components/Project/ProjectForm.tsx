import type { Project, ProjectStatus } from '@/types';
import type { SubmitEvent } from 'react';
import Field from '../Field';
import FormButtons from '../FormButtons';
import Modal from '../Modal';

export function ProjectForm({
  project,
  onSubmit,
  onClose,
}: {
  project?: Project;
  onSubmit: (data: Omit<Project, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}) {
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit({
      name: String(data.get('name')).trim(),
      category: String(data.get('category')).trim(),
      price: Number(data.get('price')),
      description: String(data.get('description')).trim(),
      status: data.get('status') as ProjectStatus,
    });
  };
  return (
    <Modal title={project ? 'Edit Project' : 'New Project'} onClose={onClose}>
      <form className="form-stack" onSubmit={submit}>
        <Field
          label="Project Name *"
          name="name"
          placeholder="e.g., Website Redesign"
          defaultValue={project?.name}
        />
        <div className="form-row">
          <Field
            label="Category"
            name="category"
            placeholder="e.g., Design"
            defaultValue={project?.category}
          />
          <label className="field">
            <span>Status</span>
            <select name="status" defaultValue={project?.status ?? 'active'}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>
        <Field
          label="Budget / Price *"
          name="price"
          type="number"
          placeholder="0.00"
          defaultValue={project?.price.toString()}
        />
        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            rows={3}
            defaultValue={project?.description}
            placeholder="Optional description..."
          />
        </label>
        <FormButtons onClose={onClose} label={project ? 'Save Changes' : 'Create Project'} />
      </form>
    </Modal>
  );
}
