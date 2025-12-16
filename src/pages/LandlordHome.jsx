import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import AddRoomModal from '../components/AddRoomModal';
import RoomDetailsModal from '../components/RoomDetailsModal';
import TenantDetailsModal from '../components/TenantDetailsModal';
import './LandlordHome.css';

function LandlordHome({ rooms }) {
    const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
    };

    const handleTenantClick = (tenant) => {
        setSelectedTenant(tenant);
    };

    const handleCloseRoomDetails = () => {
        setSelectedRoom(null);
    };

    const handleCloseTenantDetails = () => {
        setSelectedTenant(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="landlord-home">
            <div className="page-header">
                <div>
                    <h1>Property Management</h1>
                    <p>{rooms.length} Total Rooms</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setIsAddRoomOpen(true)}>
                        + Add Room
                    </button>
                    <button className="btn-primary" onClick={() => setIsAddTenantOpen(true)}>
                        <UserPlus size={16} />
                        Add Tenant
                    </button>
                    <button className="btn-secondary logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="rooms-grid">
                {rooms.map(room => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        onClick={() => handleRoomClick(room)}
                    />
                ))}
            </div>

            <AddRoomModal
                isOpen={isAddRoomOpen}
                onClose={() => setIsAddRoomOpen(false)}
            />

            <AddTenantModal
                isOpen={isAddTenantOpen}
                onClose={() => setIsAddTenantOpen(false)}
            />

            <RoomDetailsModal
                isOpen={selectedRoom !== null}
                onClose={handleCloseRoomDetails}
                room={selectedRoom}
                onTenantClick={handleTenantClick}
            />

            <TenantDetailsModal
                isOpen={selectedTenant !== null}
                onClose={handleCloseTenantDetails}
                tenant={selectedTenant}
            />
        </div>
    );
}

export default LandlordHome;
