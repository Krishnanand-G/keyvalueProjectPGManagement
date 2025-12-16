import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserPlus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';
import AddTenantModal from '../components/AddTenantModal';
import EditTenantModal from '../components/EditTenantModal';
import './TenantsPage.css';

function TenantsPage() {
    const [tenants, setTenants] = useState([]);
    const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            const response = await api.get('/tenants');
            setTenants(response.data.tenants);
        } catch (error) {
            console.error('Failed to fetch tenants:', error);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete tenant "${name}"? This action cannot be undone.`)) {
            try {
                await api.delete(`/tenants/${id}`);
                alert('Tenant deleted successfully');
                fetchTenants();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to delete tenant');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="tenants-page">
            <div className="page-header">
                <div>
                    <h1>Tenants Management</h1>
                    <p>{tenants.length} tenant(s) in total</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setIsAddTenantOpen(true)}>
                        <UserPlus size={16} />
                        Add Tenant
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/landlord')}>
                        Back to Dashboard
                    </button>
                    <button className="btn-secondary logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="tenants-table-container">
                <table className="tenants-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Room</th>
                            <th>Age</th>
                            <th>Phone</th>
                            <th>Caution Deposit</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="no-data">
                                    No tenants found. Click "Add Tenant" to create one.
                                </td>
                            </tr>
                        ) : (
                            tenants.map(tenant => (
                                <tr key={tenant.id}>
                                    <td><strong>{tenant.name}</strong></td>
                                    <td>{tenant.username}</td>
                                    <td>
                                        {tenant.roomNumber ? (
                                            <span className="room-badge">Room {tenant.roomNumber}</span>
                                        ) : (
                                            <span className="unassigned">Not Assigned</span>
                                        )}
                                    </td>
                                    <td>{tenant.age || 'N/A'}</td>
                                    <td>{tenant.phone || 'N/A'}</td>
                                    <td>₹{tenant.cautionDeposit || 0}</td>
                                    <td>
                                        {tenant.hasPaidThisMonth ? (
                                            <span className="payment-badge paid">
                                                <CheckCircle size={14} />
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="payment-badge unpaid">
                                                <XCircle size={14} />
                                                Unpaid
                                            </span>
                                        )}
                                    </td>
                                    <td className="actions">
                                        <button
                                            className="icon-btn edit-btn"
                                            onClick={() => setSelectedTenant(tenant)}
                                            title="Edit tenant"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="icon-btn delete-btn"
                                            onClick={() => handleDelete(tenant.id, tenant.name)}
                                            title="Delete tenant"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddTenantModal
                isOpen={isAddTenantOpen}
                onClose={() => setIsAddTenantOpen(false)}
                onTenantCreated={() => fetchTenants()}
            />

            <EditTenantModal
                isOpen={selectedTenant !== null}
                onClose={() => setSelectedTenant(null)}
                tenant={selectedTenant}
                onUpdate={() => {
                    fetchTenants();
                    setSelectedTenant(null);
                }}
            />
        </div>
    );
}

export default TenantsPage;
