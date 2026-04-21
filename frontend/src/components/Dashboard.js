import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = ({ user }) => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const r = await api.get('/dashboard/stats');
            setStats(r.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const cards = [
        { label: 'Total Manufacturers', value: stats.totalManufacturers || 0, abbr: 'MF', color: 'teal' },
        { label: 'Total Products', value: stats.totalProducts || 0, abbr: 'PR', color: 'green' },
        { label: 'Total Inspections', value: stats.totalInspections || 0, abbr: 'IS', color: 'blue' },
        { label: 'Total Complaints', value: stats.totalComplaints || 0, abbr: 'CP', color: 'amber' },
        { label: 'Active Recalls', value: stats.totalRecalls || 0, abbr: 'RC', color: 'red' },
        { label: 'Total Violations', value: stats.totalViolations || 0, abbr: 'VL', color: 'red' },
    ];

    if (loading) {
        return (
            <div className="main-content">
                <div className="main-header">
                    <div className="main-header-row">
                        <div>
                            <div className="main-header-title">Dashboard</div>
                            <div className="main-header-subtitle">Loading...</div>
                        </div>
                    </div>
                </div>
                <div className="main-body">
                    <div className="stats-grid">
                        {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton skeleton-card"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="main-header">
                <div className="main-header-row">
                    <div>
                        <div className="main-header-title">Welcome back, {user?.username || 'User'}</div>
                        <div className="main-header-subtitle">Food safety compliance overview</div>
                    </div>
                    <div className="main-header-actions">
                        <span className="badge badge-teal" style={{ fontSize: '12px', padding: '6px 14px' }}>
                            <span className="badge-dot"></span>
                            {user?.role || 'Inspector'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="main-body">
                <div className="stats-grid">
                    {cards.map((c, i) => (
                        <div key={c.label} className={`stat-card ${c.color} anim-fadeInUp`} style={{ animationDelay: `${i * 0.06}s` }}>
                            <div className="stat-card-header">
                                <div className="stat-card-icon">{c.abbr}</div>
                            </div>
                            <div className="stat-card-number">{c.value}</div>
                            <div className="stat-card-label">{c.label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="content-card anim-fadeInUp" style={{ animationDelay: '0.35s' }}>
                        <div className="content-card-header">
                            <div className="content-card-title">System Overview</div>
                        </div>
                        <div style={{ padding: '20px' }}>
                            {[
                                { label: 'Manufacturers Registered', value: stats.totalManufacturers || 0, color: 'var(--primary)' },
                                { label: 'Products Tracked', value: stats.totalProducts || 0, color: 'var(--success)' },
                                { label: 'Inspections Completed', value: stats.totalInspections || 0, color: 'var(--info)' },
                                { label: 'Complaints Received', value: stats.totalComplaints || 0, color: 'var(--warning)' },
                            ].map((item, i) => (
                                <div key={item.label} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none',
                                }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                                    <span style={{ fontSize: '16px', fontWeight: 800, color: item.color }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="content-card anim-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <div className="content-card-header">
                            <div className="content-card-title">Quick Actions</div>
                        </div>
                        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {[
                                { label: 'Add Manufacturer', path: '/manufacturers', bg: 'var(--primary-ultra-light)', border: 'var(--primary-light)' },
                                { label: 'Add Product', path: '/products', bg: 'var(--success-light)', border: '#BBF7D0' },
                                { label: 'New Inspection', path: '/inspections', bg: 'var(--info-light)', border: '#BAE6FD' },
                                { label: 'Log Complaint', path: '/complaints', bg: 'var(--warning-light)', border: '#FDE68A' },
                            ].map((a) => (
                                <a key={a.label} href={a.path} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '16px 12px', borderRadius: '10px',
                                    background: a.bg, border: `1px solid ${a.border}`,
                                    textDecoration: 'none', transition: 'transform 0.15s ease', cursor: 'pointer',
                                    fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center',
                                }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                    {a.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;