import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';
import './EditTenantModal.css';

function EditTenantModal({ isOpen, onClose, tenant, onUpdate }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        roomId: '',
        cautionDeposit: '',
    });
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchRooms();
            if (tenant) {
                setFormData({
                    name: tenant.name || '',
                    age: tenant.age || '',
                    phone: tenant.phone || '',
                    roomId: tenant.roomId || '',
                    cautionDeposit: tenant.cautionDeposit || '',
                });
            }
        }
    }, [isOpen, tenant]);

    const fetchRooms = async () => {
        try {
            const response = await api.get('/rooms');
            setRooms(response.data.rooms);
        } catch (err) {
            console.error('Failed to fetch rooms:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.patch(`/tenants/${tenant.id}`, {
                name: formData.name,
                age: formData.age ? parseInt(formData.age) : null,
                phone: formData.phone || null,
                roomId: formData.roomId || null,
                cautionDeposit: formData.cautionDeposit ? parseInt(formData.cautionDeposit) : null,
            });

            alert('Tenant updated successfully!');

            if (onUpdate) {
                onUpdate();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update tenant');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !tenant) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Tenant: {tenant.name}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="18"
                                max="100"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="roomId">Room Assignment</label>
                            <select
                                id="roomId"
                                name="roomId"
                                value={formData.roomId}
                                onChange={handleChange}
                            >
                                <option value="">-- No Room Assigned --</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.roomNumber} (Max: {room.maxTenants})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cautionDeposit">Caution Deposit (₹)</label>
                            <input
                                type="number"
                                id="cautionDeposit"
                                name="cautionDeposit"
                                value={formData.cautionDeposit}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
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
                            {isLoading ? 'Updating...' : 'Update Tenant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditTenantModal;
