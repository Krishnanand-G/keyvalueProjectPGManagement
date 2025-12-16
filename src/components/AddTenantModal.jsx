import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';
import './AddTenantModal.css';

function AddTenantModal({ isOpen, onClose, onTenantCreated }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        age: '',
        phone: '',
        roomId: '',
        cautionDeposit: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            const payload = {
                username: formData.username,
                password: formData.password,
                name: formData.name,
                age: formData.age ? parseInt(formData.age) : null,
                phone: formData.phone || null,
                roomId: formData.roomId || null,
                cautionDeposit: formData.cautionDeposit ? parseInt(formData.cautionDeposit) : null,
            };

            const response = await api.post('/auth/create-tenant', payload);

            alert(`Tenant created successfully!\nUsername: ${formData.username}\nPassword: ${formData.password}`);

            // Reset form
            setFormData({
                username: '',
                password: '',
                name: '',
                age: '',
                phone: '',
                roomId: '',
                cautionDeposit: '',
            });

            if (onTenantCreated) {
                onTenantCreated(response.data.tenant);
            }

            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create tenant');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-tenant-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Tenant</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="username">Username *</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="e.g., tenant1@pg.in"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Set password"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
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
                                placeholder="Age"
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
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="roomId">Room ID (Optional)</label>
                            <input
                                type="text"
                                id="roomId"
                                name="roomId"
                                value={formData.roomId}
                                onChange={handleChange}
                                placeholder="Leave empty if unassigned"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cautionDeposit">Caution Deposit (₹)</label>
                            <input
                                type="number"
                                id="cautionDeposit"
                                name="cautionDeposit"
                                value={formData.cautionDeposit}
                                onChange={handleChange}
                                placeholder="e.g., 5000"
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
                            {isLoading ? 'Creating...' : 'Create Tenant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTenantModal;
