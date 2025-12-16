import './ProfileCard.css';

function ProfileCard({ profile }) {
    return (
        <div className="profile-card card">
            <h3>Profile</h3>
            <div className="profile-info">
                <div className="profile-item">
                    <span className="profile-label">Name</span>
                    <span className="profile-value">{profile.name}</span>
                </div>
                <div className="profile-item">
                    <span className="profile-label">Age</span>
                    <span className="profile-value">{profile.age}</span>
                </div>
                <div className="profile-item">
                    <span className="profile-label">Phone</span>
                    <span className="profile-value">{profile.phone}</span>
                </div>
                <div className="profile-item">
                    <span className="profile-label">Room Number</span>
                    <span className="profile-value">{profile.roomNumber}</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
