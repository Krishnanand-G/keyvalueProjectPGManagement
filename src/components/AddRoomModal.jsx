import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';
import './AddRoomModal.css';

function AddRoomModal({ isOpen, onClose, onRoomCreated }) {
    const [roomNumber, setRoomNumber] = useState('');
    const [maxOccupancy, setMaxOccupancy] = useState('');
    const [rentPerTenant, setRentPerTenant] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/rooms', {
                roomNumber: parseInt(roomNumber),
                maxTenants: parseInt(maxOccupancy),
                rentPerTenant: parseInt(rentPerTenant),
            });

            alert(`Room ${roomNumber} created successfully!`);

            // Reset form
            setRoomNumber('');
            setMaxOccupancy('');
            setRentPerTenant('');

            // Notify parent to refresh rooms list
            if (onRoomCreated) {
                onRoomCreated(response.data.room);
            }

            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create room');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Room</h2>
                    <button className="close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="roomNumber">Room Number</label>
                        <input
                            type="number"
                            id="roomNumber"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            placeholder="e.g., 101"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxOccupancy">Max Tenants</label>
                        <input
                            type="number"
                            id="maxOccupancy"
                            value={maxOccupancy}
                            onChange={(e) => setMaxOccupancy(e.target.value)}
                            placeholder="e.g., 2"
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rentPerTenant">Rent Per Tenant (₹)</label>
                        <input
                            type="number"
                            id="rentPerTenant"
                            value={rentPerTenant}
                            onChange={(e) => setRentPerTenant(e.target.value)}
                            placeholder="e.g., 5000"
                            min="0"
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRoomModal;
