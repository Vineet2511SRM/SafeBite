import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageHeader from './PageHeader';
import { ErrorState, LoadingState } from './DataState';

const Dashboard = ({ user }) => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const r = await api.get('/dashboard/stats');
            setStats(r.data);
            setError('');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Dashboard statistics are temporarily unavailable.');
        }
        finally { setLoading(false); }
    };

    const safeStats = {
        totalManufacturers: Number(stats.totalManufacturers) || 0,
        totalProducts: Number(stats.totalProducts) || 0,
        totalInspections: Number(stats.totalInspections) || 0,
        totalComplaints: Number(stats.totalComplaints) || 0,
        totalRecalls: Number(stats.totalRecalls) || 0,
        totalViolations: Number(stats.totalViolations) || 0,
    };

    const cards = [
        { label: 'Manufacturers', value: safeStats.totalManufacturers, abbr: 'MF', color: 'teal', note: 'Registered partners' },
        { label: 'Products', value: safeStats.totalProducts, abbr: 'PR', color: 'green', note: 'Tracked items' },
        { label: 'Inspections', value: safeStats.totalInspections, abbr: 'IS', color: 'blue', note: 'Safety audits' },
        { label: 'Complaints', value: safeStats.totalComplaints, abbr: 'CP', color: 'amber', note: 'Consumer reports' },
        { label: 'Active Recalls', value: safeStats.totalRecalls, abbr: 'RC', color: 'red', note: 'Live alerts' },
        { label: 'Violations', value: safeStats.totalViolations, abbr: 'VL', color: 'red', note: 'Safety breaches' },
    ];

    const totalOperationalRecords = safeStats.totalManufacturers + safeStats.totalProducts + safeStats.totalInspections + safeStats.totalComplaints;
    const complaintPressure = safeStats.totalProducts > 0
        ? `${Math.round((safeStats.totalComplaints / safeStats.totalProducts) * 100)}%`
        : '0%';
    const inspectionCoverage = safeStats.totalProducts > 0
        ? `${Math.round((safeStats.totalInspections / safeStats.totalProducts) * 100)}%`
        : '0%';

    const insightTiles = [
        {
            title: 'Operational Footprint',
            value: totalOperationalRecords,
            description: 'Combined records across manufacturers, products, inspections, and complaints.',
        },
        {
            title: 'Complaint Pressure',
            value: complaintPressure,
            description: 'Complaints relative to tracked products for a quick health pulse.',
        },
        {
            title: 'Inspection Coverage',
            value: inspectionCoverage,
            description: 'Inspection count compared to product count for oversight visibility.',
        },
    ];

    const actionTiles = [
        { label: 'Review Manufacturers', path: '/manufacturers', hint: 'Verify registrations and contact data.' },
        { label: 'Track Products', path: '/products', hint: 'Check certifications, categories, and status.' },
        { label: 'Plan Inspections', path: '/inspections', hint: 'Handle schedules and inspection outcomes.' },
        { label: 'Resolve Complaints', path: '/complaints', hint: 'Monitor consumer issues and status changes.' },
    ];

    if (loading) {
        return (
            <div className="main-content">
                <PageHeader title="Dashboard" subtitle="Loading your compliance overview..." />
                <div className="main-body">
                    <div className="stats-grid">
                        {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton skeleton-card"></div>)}
                    </div>
                    <LoadingState label="Preparing dashboard cards and insights..." />
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <PageHeader
                title={`Welcome back, ${user?.username || 'User'}`}
                subtitle="Food safety compliance overview across operations, products, and incident response."
                actions={(
                    <span className="badge badge-teal badge-lg">
                        <span className="badge-dot"></span>
                        {user?.role || 'Inspector'}
                    </span>
                )}
            />

            <div className="main-body">
                {error ? <ErrorState message={error} /> : null}

                <div className="dashboard-hero anim-fadeInUp">
                    <div className="dashboard-hero-copy">
                        <div className="section-eyebrow">Control Center</div>
                        <h2 className="dashboard-hero-title">Keep manufacturers, products, inspections, and complaints in one reliable workflow.</h2>
                        <p className="dashboard-hero-text">
                            This dashboard highlights the most important movement in the system so teams can spot pressure, act quickly, and keep data quality high.
                        </p>
                    </div>
                    <div className="dashboard-hero-panel">
                        <div className="metric-stack">
                            <span className="metric-stack-label">Current risk flags</span>
                            <span className="metric-stack-value">{safeStats.totalRecalls + safeStats.totalViolations}</span>
                            <span className="metric-stack-note">Active recalls plus recorded violations</span>
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    {cards.map((c, i) => (
                        <div key={c.label} className={`stat-card ${c.color} anim-fadeInUp`} style={{ animationDelay: `${i * 0.06}s` }}>
                            <div className="stat-card-header">
                                <div className="stat-card-icon">{c.abbr}</div>
                            </div>
                            <div className="stat-card-number">{c.value}</div>
                            <div className="stat-card-label">{c.label}</div>
                            <div className="stat-card-note">{c.note}</div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-grid">
                    <div className="content-card anim-fadeInUp" style={{ animationDelay: '0.35s' }}>
                        <div className="content-card-header">
                            <div className="content-card-title">System Overview</div>
                        </div>
                        <div className="overview-list">
                            {[
                                { label: 'Manufacturers Registered', value: safeStats.totalManufacturers, color: 'var(--primary)' },
                                { label: 'Products Tracked', value: safeStats.totalProducts, color: 'var(--success)' },
                                { label: 'Inspections Completed', value: safeStats.totalInspections, color: 'var(--info)' },
                                { label: 'Complaints Received', value: safeStats.totalComplaints, color: 'var(--warning)' },
                            ].map((item, i) => (
                                <div key={item.label} className={`overview-row ${i < 3 ? 'bordered' : ''}`}>
                                    <span className="overview-label">{item.label}</span>
                                    <span className="overview-value" style={{ color: item.color }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="content-card anim-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <div className="content-card-header">
                            <div className="content-card-title">Quick Actions</div>
                        </div>
                        <div className="quick-actions-grid">
                            {actionTiles.map((action) => (
                                <Link key={action.label} to={action.path} className="quick-action-tile">
                                    <span className="quick-action-label">{action.label}</span>
                                    <span className="quick-action-hint">{action.hint}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="insight-grid">
                    {insightTiles.map((tile, index) => (
                        <div key={tile.title} className="insight-card anim-fadeInUp" style={{ animationDelay: `${0.45 + index * 0.05}s` }}>
                            <div className="insight-card-title">{tile.title}</div>
                            <div className="insight-card-value">{tile.value}</div>
                            <div className="insight-card-text">{tile.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
