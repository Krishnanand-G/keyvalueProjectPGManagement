import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';
import './AddComplaintModal.css';

function AddComplaintModal({ isOpen, onClose, onComplaintCreated }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        roomId: '',
    });
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchRooms();
        }
    }, [isOpen]);

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
            await api.post('/complaints', {
                title: formData.title,
                description: formData.description,
                roomId: formData.roomId || null,
            });

            alert('Complaint created successfully!');

            // Reset form
            setFormData({
                title: '',
                description: '',
                roomId: '',
            });

            if (onComplaintCreated) {
                onComplaintCreated();
            }

            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create complaint');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Lodge New Complaint</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Brief description of the issue"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide detailed information about the complaint"
                            rows="5"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="roomId">Related Room (Optional)</label>
                        <select
                            id="roomId"
                            name="roomId"
                            value={formData.roomId}
                            onChange={handleChange}
                        >
                            <option value="">-- No Specific Room --</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Room {room.roomNumber}
                                </option>
                            ))}
                        </select>
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
                            {isLoading ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddComplaintModal;
