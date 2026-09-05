import type { Receipt } from '@/types';
import { useState, useRef, type SubmitEvent } from 'react';
import Field from '../Field';
import FormButtons from '../FormButtons';
import Modal from '../Modal';

export function ReceiptForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (receipt: Omit<Receipt, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}) {
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit({
      title: String(data.get('title')).trim(),
      amount: Number(data.get('amount')),
      notes: String(data.get('notes')).trim(),
      image,
    });
  };
  return (
    <Modal title="Add Receipt" onClose={onClose}>
      <form className="form-stack" onSubmit={submit}>
        <Field label="Receipt Title *" name="title" placeholder="e.g., Hardware Store" />
        <Field label="Amount *" name="amount" type="number" placeholder="0.00" />
        <button type="button" className="upload-box" onClick={() => fileRef.current?.click()}>
          {image ? (
            <img src={image} alt="Receipt preview" />
          ) : (
            <>
              <span>▧</span>
              <small>Click to upload receipt image</small>
            </>
          )}
          <input
            ref={fileRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setImage(String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
        </button>
        <label className="field">
          <span>Notes</span>
          <textarea name="notes" rows={2} placeholder="Optional notes..." />
        </label>
        <FormButtons onClose={onClose} label="Save Receipt" />
      </form>
    </Modal>
  );
}
