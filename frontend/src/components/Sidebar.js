import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout, user }) => {
    const location = useLocation();

    const navSections = [
        {
            label: 'Overview',
            items: [
                { path: '/', icon: 'DB', label: 'Dashboard' }
            ]
        },
        {
            label: 'Core Data',
            items: [
                { path: '/manufacturers', icon: 'MF', label: 'Manufacturers' },
                { path: '/products', icon: 'PR', label: 'Products' }
            ]
        },
        {
            label: 'Operations',
            items: [
                { path: '/inspections', icon: 'IS', label: 'Inspections' },
                { path: '/compliance', icon: 'CM', label: 'Compliance' },
                { path: '/complaints', icon: 'CP', label: 'Complaints' }
            ]
        }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-mark">SB</div>
                    <div className="sidebar-logo-text">Safe<span>Bite</span></div>
                </div>
            </div>

            <div className="sidebar-user-card">
                <div className="sidebar-user-name">{user?.username}</div>
                <div className="sidebar-user-role">
                    <div className="sidebar-user-role-dot"></div>
                    {user?.role}
                </div>
            </div>

            <div className="sidebar-nav">
                {navSections.map((section, idx) => (
                    <div key={idx} className="sidebar-nav-section">
                        <div className="sidebar-nav-section-label">{section.label}</div>
                        {section.items.map(item => (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <span className="sidebar-nav-item-icon">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <button className="sidebar-logout-btn" onClick={onLogout}>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;