import './RoommatesList.css';

function RoommatesList({ roommates }) {
    return (
        <div className="roommates-section card">
            <h3>Roommates</h3>
            <div className="roommates-list">
                {roommates.map(roommate => (
                    <div key={roommate.id} className="roommate-item">
                        <div className="roommate-avatar">
                            {roommate.name.charAt(0)}
                        </div>
                        <div className="roommate-details">
                            <p className="roommate-name">{roommate.name}</p>
                            <p className="roommate-age">Age: {roommate.age}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoommatesList;
