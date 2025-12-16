import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../utils/api';
import './PaymentsPage.css';

function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('current');
    const [currentMonth, setCurrentMonth] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const now = new Date().toISOString().slice(0, 7);
        setCurrentMonth(now);
        fetchPayments('current');
    }, []);

    const fetchPayments = async (monthFilter) => {
        setIsLoading(true);
        try {
            const endpoint = monthFilter === 'current'
                ? '/payments/current'
                : `/payments/all${monthFilter !== 'all' ? `?month=${monthFilter}` : ''}`;

            const response = await api.get(endpoint);
            setPayments(response.data.payments);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMonthChange = (e) => {
        const value = e.target.value;
        setSelectedMonth(value);
        fetchPayments(value);
    };

    const handleStatusUpdate = async (paymentId, newStatus) => {
        try {
            await api.patch(`/payments/${paymentId}/status`, { status: newStatus });
            alert('Payment status updated!');
            fetchPayments(selectedMonth);
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update payment status');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const getStatusBadge = (status) => {
        const badges = {
            submitted: { icon: Clock, color: 'status-submitted', text: 'Submitted' },
            approved: { icon: CheckCircle, color: 'status-approved', text: 'Approved' },
            rejected: { icon: XCircle, color: 'status-rejected', text: 'Rejected' },
        };
        const badge = badges[status] || badges.submitted;
        const Icon = badge.icon;
        return (
            <span className={`status-badge ${badge.color}`}>
                <Icon size={14} />
                {badge.text}
            </span>
        );
    };

    // Generate month options for past 6 months
    const generateMonthOptions = () => {
        const options = [{ value: 'current', label: 'Current Month' }];
        const now = new Date();
        for (let i = 0; i < 6; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthValue = date.toISOString().slice(0, 7);
            const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            options.push({ value: monthValue, label: monthLabel });
        }
        options.push({ value: 'all', label: 'All Payments' });
        return options;
    };

    return (
        <div className="payments-page">
            <div className="page-header">
                <div>
                    <h1>Payment Management</h1>
                    <p>{payments.length} payment(s) found</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => navigate('/landlord')}>
                        Back to Dashboard
                    </button>
                    <button className="btn-secondary logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="filters-section">
                <div className="form-group">
                    <label>Filter by Month:</label>
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        {generateMonthOptions().map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="loading">Loading payments...</div>
            ) : payments.length === 0 ? (
                <div className="empty-state">
                    <p>No payments found for the selected period</p>
                </div>
            ) : (
                <div className="payments-table-container">
                    <table className="payments-table">
                        <thead>
                            <tr>
                                <th>Tenant</th>
                                <th>Room</th>
                                <th>Month</th>
                                <th>Status</th>
                                <th>Proof</th>
                                <th>Submitted On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id}>
                                    <td>
                                        <strong>{payment.tenantName}</strong>
                                        <br />
                                        <span className="username">{payment.tenantUsername}</span>
                                    </td>
                                    <td>
                                        {payment.roomNumber ? (
                                            <span className="room-badge">Room {payment.roomNumber}</span>
                                        ) : (
                                            <span className="no-room">No Room</span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(payment.month).toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td>{getStatusBadge(payment.status)}</td>
                                    <td>
                                        {payment.proofUrl ? (
                                            <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer" className="proof-link">
                                                View Proof
                                            </a>
                                        ) : (
                                            <span className="no-proof">No proof</span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="action-buttons">
                                        {payment.status === 'submitted' && (
                                            <>
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleStatusUpdate(payment.id, 'approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleStatusUpdate(payment.id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PaymentsPage;
