import { X } from 'lucide-react';
import './TenantDetailsModal.css';

function TenantDetailsModal({ isOpen, onClose, tenant }) {
    if (!isOpen || !tenant) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Tenant Details</h2>
                    <button className="close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                <div className="tenant-details">
                    <div className="detail-avatar">
                        {tenant.name.charAt(0)}
                    </div>

                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Name</span>
                            <span className="detail-value">{tenant.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Age</span>
                            <span className="detail-value">{tenant.age}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Phone</span>
                            <span className="detail-value">{tenant.phone}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TenantDetailsModal;
