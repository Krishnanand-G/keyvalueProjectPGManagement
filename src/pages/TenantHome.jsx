import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, MessageSquare, Home } from 'lucide-react';
import './TenantHome.css';

function TenantHome() {
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
                    <h1>Welcome, {user?.name || user?.username}!</h1>
                    <p>Tenant Dashboard</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => navigate('/complaints')}>
                        <MessageSquare size={16} />
                        Complaints
                    </button>
                    <button className="btn-secondary logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="tenant-grid">
                <div className="info-card">
                    <Home size={32} className="card-icon" />
                    <h2>Your Room</h2>
                    <p>Room information will be displayed here</p>
                </div>

                <div className="info-card">
                    <MessageSquare size={32} className="card-icon" />
                    <h2>Complaints</h2>
                    <p>Lodge and track your complaints</p>
                    <button className="btn-primary" onClick={() => navigate('/complaints')}>
                        View Complaints
                    </button>
                </div>

                <div className="info-card">
                    <div style={{ fontSize: '2rem' }}>💰</div>
                    <h2>Rent Payments</h2>
                    <p>Coming soon</p>
                </div>
            </div>

            <div className="info-banner">
                <p><strong>Logged in as:</strong> {user?.username} ({user?.role})</p>
            </div>
        </div>
    );
}

export default TenantHome;
