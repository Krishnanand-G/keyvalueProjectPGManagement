import './RoomCard.css';

function RoomCard({ room, onClick }) {
    // room should have: id, roomNumber, maxTenants, rentPerTenant, currentTenants (from DB)
    const currentTenants = room.currentTenants || 0;
    const maxTenants = room.maxTenants || 0;
    const occupancyPercentage = maxTenants > 0 ? (currentTenants / maxTenants) * 100 : 0;

    const isAvailable = currentTenants < maxTenants;
    const isFull = currentTenants >= maxTenants;

    return (
        <div className="room-card" onClick={() => onClick(room)}>
            <div className="room-header">
                <h3>Room {room.roomNumber}</h3>
                <span className={`status-badge ${isAvailable ? 'available' : 'full'}`}>
                    {isFull ? 'Full' : 'Available'}
                </span>
            </div>

            <div className="room-info">
                <div className="info-item">
                    <span className="label">Rent per tenant:</span>
                    <span className="value">₹{room.rentPerTenant}</span>
                </div>
                <div className="info-item">
                    <span className="label">Occupancy:</span>
                    <span className="value">{currentTenants}/{maxTenants}</span>
                </div>
            </div>

            <div className="occupancy-bar">
                <div
                    className="occupancy-fill"
                    style={{ width: `${occupancyPercentage}%` }}
                />
            </div>
        </div>
    );
}

export default RoomCard;
