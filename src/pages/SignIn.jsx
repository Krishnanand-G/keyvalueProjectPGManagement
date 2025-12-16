import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import './SignIn.css';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const role = login(username, password);

            // Redirect based on role
            if (role === 'tenant') {
                navigate('/tenant', { replace: true });
            } else if (role === 'landlord') {
                navigate('/landlord', { replace: true });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signin-page">
            <div className="signin-container">
                <div className="signin-card">
                    <div className="signin-header">
                        <LogIn size={32} className="signin-icon" />
                        <h1>Sign In</h1>
                        <p>Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="signin-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary signin-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="signin-footer">
                        <p className="demo-credentials">Default Landlord Credentials:</p>
                        <div className="credentials-list">
                            <div className="credential-item">
                                <strong>Username:</strong> landlord@pg.in
                            </div>
                            <div className="credential-item">
                                <strong>Password:</strong> landlord123
                            </div>
                            <div className="credential-item">
                                Real authentication with Supabase database ✓
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
