import React, { useState } from 'react';
import api from '../services/api';

const Login = ({ onLogin, onBack }) => {
    const [username, setUsername] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        { id: 'Senior Inspector', icon: 'SI', title: 'Senior Inspector', desc: 'Full system oversight' },
        { id: 'Inspector', icon: 'IN', title: 'Food Inspector', desc: 'Field inspections & reports' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            setError('Please select your role');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { username });
            const userData = response.data.user;

            if (userData.role !== selectedRole) {
                setError(`Account mismatch. Profile role is "${userData.role}"`);
                setLoading(false);
                return;
            }

            onLogin(userData);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-logo-section">
                    <div className="login-logo-mark">SB</div>
                    <div className="login-logo-name">Safe<span>Bite</span></div>
                </div>

                <div className="login-welcome">Welcome back</div>
                <div className="login-description">Sign in to the SafeBite compliance portal to continue.</div>

                <form onSubmit={handleSubmit}>
                    <div className="login-role-section">
                        <div className="login-role-label">Choose your workspace</div>
                        <div className="login-role-cards">
                            {roles.map(role => (
                                <div
                                    key={role.id}
                                    className={`login-role-card ${selectedRole === role.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedRole(role.id)}
                                >
                                    <div className="login-role-card-icon" style={{ background: selectedRole === role.id ? 'var(--primary)' : 'var(--text-muted)' }}>{role.icon}</div>
                                    <div className="login-role-card-title">{role.title}</div>
                                    <div className="login-role-card-desc">{role.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="login-form-group">
                        <label className="login-form-label">Username</label>
                        <input
                            type="text"
                            className="login-form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. rajesh.kumar"
                            required
                        />
                    </div>

                    {error && (
                        <div className="login-error-msg">
                            {error}
                        </div>
                    )}

                    <div style={{ marginTop: '24px' }}>
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onBack}
                        style={{ width: '100%', padding: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '8px', fontSize: '13px', fontWeight: 600, transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                        Back to main site
                    </button>
                </form>
            </div>

            <div className="login-right">
                <div className="login-right-content">
                    <div className="login-right-shield">SF</div>
                    <div className="login-right-title">Protect What Matters</div>
                    <div className="login-right-desc">
                        Rigorous safety standards and automated compliance checking. SafeBite ensures quality from farm to fork.
                    </div>

                    <div className="login-right-features">
                        <div className="login-right-feature"><div className="login-right-feature-dot"></div> 100% Traceability</div>
                        <div className="login-right-feature"><div className="login-right-feature-dot"></div> Role-Based Access</div>
                        <div className="login-right-feature"><div className="login-right-feature-dot"></div> Risk Assessment</div>
                        <div className="login-right-feature"><div className="login-right-feature-dot"></div> Safety Audits</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;