import { X } from 'lucide-react';
import './PaymentProofModal.css';

function PaymentProofModal({ isOpen, onClose, imageUrl }) {
    if (!isOpen || !imageUrl) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content proof-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Payment Proof</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="proof-image-container">
                    <img src={imageUrl} alt="Payment Proof" />
                </div>
            </div>
        </div>
    );
}

export default PaymentProofModal;
