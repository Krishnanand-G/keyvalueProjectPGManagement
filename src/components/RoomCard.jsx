import './RoomCard.css';

function RoomCard({ room, onClick }) {
    const occupancyPercentage = (room.currentOccupancy / room.maxOccupancy) * 100;
    const isFull = room.currentOccupancy === room.maxOccupancy;
    const isEmpty = room.currentOccupancy === 0;

    return (
        <div className={`room-card ${isFull ? 'full' : ''} ${isEmpty ? 'empty' : ''}`} onClick={onClick}>
            <div className="room-number">Room {room.roomNumber}</div>
            <div className="occupancy-info">
                <div className="occupancy-text">
                    {room.currentOccupancy} / {room.maxOccupancy}
                </div>
                <div className="occupancy-bar">
                    <div
                        className="occupancy-fill"
                        style={{ width: `${occupancyPercentage}%` }}
                    />
                </div>
                <div className="occupancy-status">
                    {isEmpty ? 'Empty' : isFull ? 'Full' : 'Available'}
                </div>
            </div>
        </div>
    );
}

export default RoomCard;
