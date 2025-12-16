import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, MessageSquarePlus } from 'lucide-react';
import api from '../utils/api';
import ComplaintCard from '../components/ComplaintCard';
import AddComplaintModal from '../components/AddComplaintModal';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import './ComplaintsPage.css';

function ComplaintsPage() {
    const [complaints, setComplaints] = useState([]);
    const [isAddComplaintOpen, setIsAddComplaintOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [filter, setFilter] = useState('all');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await api.get('/complaints');
            setComplaints(response.data.complaints);
        } catch (error) {
            console.error('Failed to fetch complaints:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const filteredComplaints = complaints.filter(complaint => {
        if (filter === 'all') return true;
        return complaint.status === filter;
    });

    return (
        <div className="complaints-page">
            <div className="page-header">
                <div>
                    <h1>Complaints</h1>
                    <p>{filteredComplaints.length} complaint(s)</p>
                </div>
                <div className="header-actions">
                    {user.role === 'tenant' && (
                        <button className="btn-primary" onClick={() => setIsAddComplaintOpen(true)}>
                            <MessageSquarePlus size={16} />
                            Lodge Complaint
                        </button>
                    )}
                    <button className="btn-secondary" onClick={() => navigate(user.role === 'tenant' ? '/tenant' : '/landlord')}>
                        Back to Dashboard
                    </button>
                    <button className="btn-secondary logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            {user.role === 'landlord' && (
                <div className="filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
                        onClick={() => setFilter('open')}
                    >
                        Open
                    </button>
                    <button
                        className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
                        onClick={() => setFilter('in_progress')}
                    >
                        In Progress
                    </button>
                    <button
                        className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
                        onClick={() => setFilter('resolved')}
                    >
                        Resolved
                    </button>
                </div>
            )}

            <div className="complaints-grid">
                {filteredComplaints.length === 0 ? (
                    <div className="empty-state">
                        <p>No complaints found</p>
                    </div>
                ) : (
                    filteredComplaints.map(complaint => (
                        <ComplaintCard
                            key={complaint.id}
                            complaint={complaint}
                            onClick={() => setSelectedComplaint(complaint)}
                            isLandlord={user.role === 'landlord'}
                        />
                    ))
                )}
            </div>

            <AddComplaintModal
                isOpen={isAddComplaintOpen}
                onClose={() => setIsAddComplaintOpen(false)}
                onComplaintCreated={() => {
                    fetchComplaints();
                }}
            />

            <ComplaintDetailsModal
                isOpen={selectedComplaint !== null}
                onClose={() => setSelectedComplaint(null)}
                complaint={selectedComplaint}
                isLandlord={user.role === 'landlord'}
                onUpdate={() => {
                    fetchComplaints();
                    setSelectedComplaint(null);
                }}
            />
        </div>
    );
}

export default ComplaintsPage;
