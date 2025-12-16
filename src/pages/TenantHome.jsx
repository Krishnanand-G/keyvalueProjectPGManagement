import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, MessageSquare, Upload, Users, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';
import TenantDetailsModal from '../components/TenantDetailsModal';
import './TenantHome.css';

function TenantHome() {
    const [tenantData, setTenantData] = useState(null);
    const [roommates, setRoommates] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [hasPaidThisMonth, setHasPaidThisMonth] = useState(false);
    const [currentMonth, setCurrentMonth] = useState('');
    const [selectedRoommate, setSelectedRoommate] = useState(null);
    const [paymentProof, setPaymentProof] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTenantData();
        fetchRecentComplaints();
        checkPaymentStatus();
    }, []);

    const fetchTenantData = async () => {
        try {
            const response = await api.get('/tenants/me');
            setTenantData(response.data.tenant);
            setRoommates(response.data.roommates);
        } catch (error) {
            console.error('Failed to fetch tenant data:', error);
        }
    };

    const fetchRecentComplaints = async () => {
        try {
            const response = await api.get('/complaints');
            setComplaints(response.data.complaints.slice(0, 3));
        } catch (error) {
            console.error('Failed to fetch complaints:', error);
        }
    };

    const checkPaymentStatus = async () => {
        try {
            const response = await api.get('/payments/current-month');
            setHasPaidThisMonth(response.data.hasPaid);
            setCurrentMonth(response.data.month);
        } catch (error) {
            console.error('Failed to check payment status:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (limit to 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size must be less than 2MB. Please choose a smaller image.');
                e.target.value = '';
                return;
            }

            // Convert image to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentProof(reader.result);
            };
            reader.onerror = () => {
                alert('Failed to read image file. Please try again.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/payments', {
                month: currentMonth,
                proofUrl: paymentProof || null,
            });
            alert('Payment submitted successfully!');
            setHasPaidThisMonth(true);
            setPaymentProof(null);
        } catch (error) {
            console.error('Payment submission error:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Failed to submit payment';
            alert('Error: ' + errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    if (!tenantData) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="tenant-home">
            <div className="page-header">
                <div>
                    <h1>Welcome, {tenantData.name || user?.username}!</h1>
                    <p>Room {tenantData.roomNumber || 'Not Assigned'}</p>
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

            {/* Payment Status Alert */}
            {!hasPaidThisMonth && (
                <div className="payment-alert">
                    <XCircle size={20} />
                    <span>You haven't submitted your rent payment for this month yet!</span>
                </div>
            )}

            {/* Alerts Section */}
            {complaints.length > 0 && (
                <div className="alerts-section">
                    <h2>Recent Alerts</h2>
                    <div className="alerts-grid">
                        {complaints.map(complaint => (
                            <div key={complaint.id} className={`alert-card status-${complaint.status}`}>
                                <MessageSquare size={20} />
                                <div>
                                    <strong>{complaint.title}</strong>
                                    <p>Status: {complaint.status.replace('_', ' ')}</p>
                                    {complaint.landlordRemark && (
                                        <p className="landlord-note">Landlord: {complaint.landlordRemark.substring(0, 50)}...</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="tenant-grid">
                {/* Profile Card */}
                <div className="profile-card card">
                    <h2>Your Profile</h2>
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="label">Name:</span>
                            <span className="value">{tenantData.name}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Age:</span>
                            <span className="value">{tenantData.age || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Phone:</span>
                            <span className="value">{tenantData.phone || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Room:</span>
                            <span className="value">{tenantData.roomNumber || 'Not Assigned'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Rent:</span>
                            <span className="value">₹{tenantData.rentPerTenant || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Caution Deposit:</span>
                            <span className="value">₹{tenantData.cautionDeposit || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Roommates Card */}
                <div className="roommates-card card">
                    <h2>
                        <Users size={20} />
                        Roommates
                    </h2>
                    {roommates.length > 0 ? (
                        <div className="roommates-list">
                            {roommates.map(roommate => (
                                <div
                                    key={roommate.id}
                                    className="roommate-item clickable"
                                    onClick={() => setSelectedRoommate(roommate)}
                                >
                                    <div className="roommate-avatar">{roommate.name.charAt(0)}</div>
                                    <div>
                                        <strong>{roommate.name}</strong>
                                        <p>Age: {roommate.age || 'N/A'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No roommates</p>
                    )}
                </div>

                {/* Rent Payment Card */}
                <div className="payment-card card">
                    <h2>
                        {hasPaidThisMonth ? <CheckCircle size={20} /> : <Upload size={20} />}
                        Rent Payment
                    </h2>
                    {hasPaidThisMonth ? (
                        <div className="payment-success">
                            <CheckCircle size={48} color="#10B981" />
                            <p><strong>Payment Submitted!</strong></p>
                            <p>You've already paid for {new Date(currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                        </div>
                    ) : (
                        <form className="payment-form" onSubmit={handlePaymentSubmit}>
                            <div className="form-group">
                                <label>Month</label>
                                <input
                                    type="month"
                                    value={currentMonth}
                                    onChange={(e) => setCurrentMonth(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Upload Payment Proof *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                                {paymentProof && (
                                    <p className="file-selected">✓ Image selected</p>
                                )}
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSubmitting || !paymentProof}>
                                {isSubmitting ? 'Submitting...' : 'Submit Payment'}
                            </button>
                            <p className="note">Upload screenshot of your payment transaction</p>
                        </form>
                    )}
                </div>
            </div>

            <TenantDetailsModal
                isOpen={selectedRoommate !== null}
                onClose={() => setSelectedRoommate(null)}
                tenant={selectedRoommate}
            />
        </div>
    );
}

export default TenantHome;
