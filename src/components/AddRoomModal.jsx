import { useState } from 'react';
import { X } from 'lucide-react';
import './AddRoomModal.css';

function AddRoomModal({ isOpen, onClose }) {
    const [roomNumber, setRoomNumber] = useState('');
    const [maxOccupancy, setMaxOccupancy] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Room ${roomNumber} added (frontend only)`);
        onClose();
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
                            type="text"
                            id="roomNumber"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            placeholder="e.g., 201"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxOccupancy">Max Occupancy</label>
                        <input
                            type="number"
                            id="maxOccupancy"
                            value={maxOccupancy}
                            onChange={(e) => setMaxOccupancy(e.target.value)}
                            placeholder="e.g., 4"
                            min="1"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Add Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRoomModal;
