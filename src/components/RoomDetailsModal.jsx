import { X, CheckCircle, XCircle } from 'lucide-react';
import './RoomDetailsModal.css';

function RoomDetailsModal({ isOpen, onClose, room, onTenantClick }) {
    if (!isOpen || !room) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Room {room.roomNumber} Details</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="room-details-info">
                    <div className="detail-item">
                        <span className="label">Max Tenants:</span>
                        <span className="value">{room.maxTenants}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Current Occupancy:</span>
                        <span className="value">{room.currentTenants || 0}/{room.maxTenants}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Rent Per Tenant:</span>
                        <span className="value">₹{room.rentPerTenant}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Status:</span>
                        <span className={`status-badge ${(room.currentTenants || 0) < room.maxTenants ? 'available' : 'full'}`}>
                            {(room.currentTenants || 0) < room.maxTenants ? 'Available' : 'Full'}
                        </span>
                    </div>
                </div>

                <div className="tenants-section">
                    <h3>Current Tenants</h3>
                    {(!room.tenants || room.tenants.length === 0) ? (
                        <p className="no-tenants">No tenants assigned to this room yet.</p>
                    ) : (
                        <div className="tenants-list">
                            {room.tenants.map(tenant => (
                                <div
                                    key={tenant.id}
                                    className="tenant-item clickable"
                                    onClick={() => onTenantClick && onTenantClick(tenant)}
                                >
                                    <div className="tenant-avatar">
                                        {tenant.name.charAt(0)}
                                    </div>
                                    <div className="tenant-info">
                                        <strong>{tenant.name}</strong>
                                        <p>Age: {tenant.age || 'N/A'}</p>
                                    </div>
                                    <div className="payment-status">
                                        {tenant.hasPaidThisMonth ? (
                                            <div className="status-paid">
                                                <CheckCircle size={16} />
                                                <span>Paid</span>
                                            </div>
                                        ) : (
                                            <div className="status-unpaid">
                                                <XCircle size={16} />
                                                <span>Unpaid</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RoomDetailsModal;
