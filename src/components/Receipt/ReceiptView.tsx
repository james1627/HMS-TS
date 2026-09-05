import type { Receipt } from '@/types';
import { currency, dateLabel } from '../helpers';
import Modal from '../Modal';

export function ReceiptView({
  receipt,
  onDelete,
  onClose,
}: {
  receipt: Receipt;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title={receipt.title || 'Receipt'} onClose={onClose}>
      {receipt.image && <img className="receipt-image" src={receipt.image} alt="Receipt" />}
      <div className="receipt-meta">
        <span>
          Amount <b>{currency(receipt.amount)}</b>
        </span>
        <span>
          Date <b>{dateLabel(receipt.createdAt)}</b>
        </span>
        {receipt.notes && (
          <span>
            Notes <b>{receipt.notes}</b>
          </span>
        )}
      </div>
      <div className="form-actions">
        <button className="button danger" onClick={onDelete}>
          Delete Receipt
        </button>
        <button className="button primary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
