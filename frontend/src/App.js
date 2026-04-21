import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Manufacturers from './components/Manufacturers';
import Products from './components/Products';
import Inspections from './components/Inspections';
import Complaints from './components/Complaints';
import Compliance from './components/Compliance';
import Sidebar from './components/Sidebar';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'app'

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setCurrentView('app');
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentView('app');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setCurrentView('landing');
    };

    const handleNavigateToLogin = () => {
        setCurrentView('login');
    };

    const handleBackToLanding = () => {
        setCurrentView('landing');
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: '#FAFAF9'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px', height: '48px', border: '3px solid #E7E5E4',
                        borderTop: '3px solid #0D9488', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                    }}></div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#78716C' }}>
                        Loading SafeBite...
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'landing') {
        return <Landing onNavigateToLogin={handleNavigateToLogin} />;
    }

    if (currentView === 'login') {
        return <Login onLogin={handleLogin} onBack={handleBackToLanding} />;
    }

    return (
        <Router>
            <div className="app-container">
                <Sidebar onLogout={handleLogout} user={user} />
                <Routes>
                    <Route path="/" element={<Dashboard user={user} />} />
                    <Route path="/manufacturers" element={<Manufacturers user={user} />} />
                    <Route path="/products" element={<Products user={user} />} />
                    <Route path="/inspections" element={<Inspections user={user} />} />
                    <Route path="/complaints" element={<Complaints user={user} />} />
                    <Route path="/compliance" element={<Compliance user={user} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;