import { X } from 'lucide-react';
import './RoomDetailsModal.css';

function RoomDetailsModal({ isOpen, onClose, room, onTenantClick }) {
    if (!isOpen || !room) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Room {room.roomNumber} Details</h2>
                    <button className="close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                <div className="room-info">
                    <p className="occupancy-text">
                        Occupancy: {room.currentOccupancy} / {room.maxOccupancy}
                    </p>
                </div>

                <div className="tenants-section">
                    <h3>Tenants</h3>
                    {room.tenants.length === 0 ? (
                        <p className="empty-message">No tenants in this room</p>
                    ) : (
                        <div className="tenants-list">
                            {room.tenants.map(tenant => (
                                <div
                                    key={tenant.id}
                                    className="tenant-item"
                                    onClick={() => onTenantClick(tenant)}
                                >
                                    <div className="tenant-avatar">
                                        {tenant.name.charAt(0)}
                                    </div>
                                    <div className="tenant-info">
                                        <p className="tenant-name">{tenant.name}</p>
                                        <p className="tenant-age">Age: {tenant.age}</p>
                                    </div>
                                    <span className="view-arrow">→</span>
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
