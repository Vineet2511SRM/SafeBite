import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Manufacturers from './components/Manufacturers';
import Products from './components/Products';
import Categories from './components/Categories';
import Agencies from './components/Agencies';
import Inspections from './components/Inspections';
import Complaints from './components/Complaints';
import Compliance from './components/Compliance';
import Sidebar from './components/Sidebar';

const THEME_STORAGE_KEY = 'safebite-theme';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'app'
    const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || 'teal');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setCurrentView('app');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentView('app');
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setCurrentView('landing');
        setIsSidebarOpen(false);
    };

    const handleNavigateToLogin = () => {
        setCurrentView('login');
    };

    const handleBackToLanding = () => {
        setCurrentView('landing');
    };

    const toggleTheme = () => {
        setTheme((currentTheme) => (currentTheme === 'teal' ? 'blue' : 'teal'));
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
        return <Landing onNavigateToLogin={handleNavigateToLogin} theme={theme} onToggleTheme={toggleTheme} />;
    }

    if (currentView === 'login') {
        return <Login onLogin={handleLogin} onBack={handleBackToLanding} />;
    }

    return (
        <Router>
            <div className="app-container">
                <button
                    type="button"
                    className="mobile-nav-trigger"
                    onClick={() => setIsSidebarOpen((open) => !open)}
                    aria-label="Toggle navigation"
                >
                    {isSidebarOpen ? 'Close' : 'Menu'}
                </button>
                <Sidebar
                    onLogout={handleLogout}
                    user={user}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <Routes>
                    <Route path="/" element={<Dashboard user={user} />} />
                    <Route path="/manufacturers" element={<Manufacturers user={user} />} />
                    <Route path="/products" element={<Products user={user} />} />
                    <Route path="/categories" element={<Categories user={user} />} />
                    <Route path="/agencies" element={<Agencies user={user} />} />
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
