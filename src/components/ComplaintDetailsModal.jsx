import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';
import './ComplaintDetailsModal.css';

function ComplaintDetailsModal({ isOpen, onClose, complaint, isLandlord, onUpdate }) {
    const [status, setStatus] = useState('');
    const [landlordRemark, setLandlordRemark] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form when complaint changes
    useState(() => {
        if (complaint) {
            setStatus(complaint.status);
            setLandlordRemark(complaint.landlordRemark || '');
        }
    }, [complaint]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.patch(`/complaints/${complaint.id}`, {
                status,
                landlordRemark,
            });

            alert('Complaint updated successfully!');

            if (onUpdate) {
                onUpdate();
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update complaint');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !complaint) return null;

    const statusColors = {
        open: 'status-open',
        in_progress: 'status-progress',
        resolved: 'status-resolved',
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content complaint-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Complaint Details</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="complaint-details">
                    <div className="detail-row">
                        <span className="label">Status:</span>
                        <span className={`status-badge ${statusColors[complaint.status]}`}>
                            {complaint.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Created:</span>
                        <span className="value">{formatDate(complaint.createdAt)}</span>
                    </div>

                    <div className="detail-section">
                        <h3>Title</h3>
                        <p>{complaint.title}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Description</h3>
                        <p>{complaint.description}</p>
                    </div>

                    {isLandlord ? (
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label htmlFor="status">Update Status</label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="landlordRemark">Landlord Remark</label>
                                <textarea
                                    id="landlordRemark"
                                    value={landlordRemark}
                                    onChange={(e) => setLandlordRemark(e.target.value)}
                                    placeholder="Add your remark or response"
                                    rows="4"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={onClose}>
                                    Close
                                </button>
                                <button type="submit" className="btn-primary" disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update Complaint'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            {complaint.landlordRemark && (
                                <div className="detail-section landlord-response">
                                    <h3>Landlord Response</h3>
                                    <p>{complaint.landlordRemark}</p>
                                </div>
                            )}
                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={onClose}>
                                    Close
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ComplaintDetailsModal;
