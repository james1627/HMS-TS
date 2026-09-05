export default function FormButtons({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <div className="form-actions">
      <button type="button" className="button ghost" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" className="button primary">
        {label}
      </button>
    </div>
  );
}
