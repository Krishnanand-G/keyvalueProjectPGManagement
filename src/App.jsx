import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignIn from './pages/SignIn';
import TenantHome from './pages/TenantHome';
import LandlordHome from './pages/LandlordHome';
import ComplaintsPage from './pages/ComplaintsPage';
import TenantsPage from './pages/TenantsPage';
import './App.css';

function App() {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="app">
            <Routes>
                {/* Public route */}
                <Route
                    path="/signin"
                    element={
                        isAuthenticated ? (
                            <Navigate to={user.role === 'tenant' ? '/tenant' : '/landlord'} replace />
                        ) : (
                            <SignIn />
                        )
                    }
                />

                {/* Protected tenant route */}
                <Route
                    path="/tenant"
                    element={
                        <ProtectedRoute requiredRole="tenant">
                            <TenantHome />
                        </ProtectedRoute>
                    }
                />

                {/* Protected landlord route */}
                <Route
                    path="/landlord"
                    element={
                        <ProtectedRoute requiredRole="landlord">
                            <LandlordHome />
                        </ProtectedRoute>
                    }
                />

                {/* Complaints - accessible to both roles */}
                <Route
                    path="/complaints"
                    element={
                        isAuthenticated ? (
                            <ComplaintsPage />
                        ) : (
                            <Navigate to="/signin" replace />
                        )
                    }
                />

                {/* Tenants Management - landlord only */}
                <Route
                    path="/tenants"
                    element={
                        <ProtectedRoute requiredRole="landlord">
                            <TenantsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Default redirect */}
                <Route
                    path="/"
                    element={
                        <Navigate to={isAuthenticated ? (user.role === 'tenant' ? '/tenant' : '/landlord') : '/signin'} replace />
                    }
                />

                {/* Catch all - redirect to signin */}
                <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
        </div>
    );
}

export default App;
