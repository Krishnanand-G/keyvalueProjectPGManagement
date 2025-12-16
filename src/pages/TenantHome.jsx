import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import AlertsSection from '../components/AlertsSection';
import ProfileCard from '../components/ProfileCard';
import RoommatesList from '../components/RoommatesList';
import RentPaymentForm from '../components/RentPaymentForm';
import './TenantHome.css';

function TenantHome({ profile, roommates, alerts }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="tenant-home">
            <div className="page-header">
                <div>
                    <h1>Welcome, {user?.username || profile.name}</h1>
                    <p>Room {profile.roomNumber}</p>
                </div>
                <button className="btn-secondary logout-btn" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                </button>
            </div>

            <AlertsSection alerts={alerts} />

            <div className="tenant-grid">
                <div className="grid-left">
                    <ProfileCard profile={profile} />
                    <RoommatesList roommates={roommates} />
                </div>
                <div className="grid-right">
                    <RentPaymentForm />
                </div>
            </div>
        </div>
    );
}

export default TenantHome;
