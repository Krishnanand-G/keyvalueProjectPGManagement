import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, user } = useAuth();

    // Not authenticated - redirect to signin
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    // Authenticated but wrong role - redirect to correct home
    if (requiredRole && user.role !== requiredRole) {
        const correctPath = user.role === 'tenant' ? '/tenant' : '/landlord';
        return <Navigate to={correctPath} replace />;
    }

    // Authenticated with correct role
    return children;
}

export default ProtectedRoute;
