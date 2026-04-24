import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';
import PageHeader from './PageHeader';
import { EmptyState, ErrorState, LoadingState } from './DataState';

const Inspections = ({ user }) => {
    const [data, setData] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'inspections');
    const [formData, setFormData] = useState({
        inspection_id: '',
        schedule_id: '',
        inspection_date: '',
        inspection_result: 'Pass',
        risk_score: '',
        remarks: ''
    });

    const resetFormData = () => ({
        inspection_id: '',
        schedule_id: '',
        inspection_date: '',
        inspection_result: 'Pass',
        risk_score: '',
        remarks: ''
    });

    useEffect(() => { fetchData(); fetchSchedules(); }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = async () => {
        try {
            const response = await api.get('/inspections');
            setData(response.data);
            setError('');
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || 'Unable to load inspections right now.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSchedules = async () => {
        try {
            const response = await api.get('/inspections/schedules');
            setSchedules(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/inspections/${editing.inspection_id}`, formData);
                showToast('success', 'Inspection record updated successfully');
            } else {
                await api.post('/inspections', { ...formData, inspection_id: undefined });
                showToast('success', 'Inspection record inserted successfully');
            }
            fetchData();
            fetchSchedules();
            handleCancel();
        } catch (e) {
            showToast('error', e.response?.data?.message || 'Failed');
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({
            inspection_id: item.inspection_id,
            schedule_id: item.schedule_id,
            inspection_date: item.inspection_date?.split('T')[0] || '',
            inspection_result: item.inspection_result,
            risk_score: item.risk_score,
            remarks: item.remarks || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this inspection?')) {
            try {
                await api.delete(`/inspections/${id}`);
                showToast('success', 'Inspection record deleted successfully');
                fetchData();
                fetchSchedules();
            } catch (e) {
                showToast('error', 'Failed');
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditing(null);
        setFormData(resetFormData());
    };

    const resultBadge = (result) => result === 'Pass'
        ? <span className="badge badge-green"><span className="badge-dot"></span>Pass</span>
        : <span className="badge badge-red"><span className="badge-dot"></span>Fail</span>;

    const riskColor = (score) => score < 30 ? 'var(--success)' : score < 60 ? 'var(--warning)' : 'var(--danger)';

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}
            <PageHeader
                title="Inspections"
                subtitle="Schedule and manage food safety inspections"
                actions={perms.create ? <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Inspection</button> : null}
            />

            <div className="main-body">
                <div className="content-card anim-fadeInUp">
                    <div className="content-card-header"><div className="content-card-title">All Inspections <span className="badge badge-blue" style={{ marginLeft: '6px' }}>{data.length}</span></div></div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? <LoadingState />
                            : error ? <ErrorState message={error} />
                                : data.length === 0 ? <EmptyState icon="IS" title="No inspections" description="Inspection results will appear here once schedules are completed." />
                                    : <table className="premium-table">
                                        <thead><tr><th>ID</th><th>Product</th><th>Date</th><th>Result</th><th>Risk</th><th>Type</th><th>Remarks</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                                        <tbody>{data.map((inspection, index) => (
                                            <tr key={inspection.inspection_id} className="anim-fadeInUp" style={{ animationDelay: `${index * 0.02}s` }}>
                                                <td style={{ fontWeight: 700 }}>{inspection.inspection_id}</td>
                                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inspection.product_name}</td>
                                                <td>{inspection.inspection_date?.split('T')[0]}</td>
                                                <td>{resultBadge(inspection.inspection_result)}</td>
                                                <td>
                                                    <div className="risk-meter">
                                                        <div className="risk-meter-track">
                                                            <div className="risk-meter-fill" style={{ width: `${inspection.risk_score}%`, background: riskColor(inspection.risk_score) }}></div>
                                                        </div>
                                                        <span className="risk-meter-value" style={{ color: riskColor(inspection.risk_score) }}>{inspection.risk_score}</span>
                                                    </div>
                                                </td>
                                                <td><span className="badge badge-gray">{inspection.inspection_type || '-'}</span></td>
                                                <td className="truncate-cell">{inspection.remarks || '-'}</td>
                                                {(perms.update || perms.delete) && <td>
                                                    {perms.update && <button className="table-action-btn" onClick={() => handleEdit(inspection)}>E</button>}
                                                    {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(inspection.inspection_id)}>D</button>}
                                                </td>}
                                            </tr>
                                        ))}</tbody>
                                    </table>}
                    </div>
                </div>

                {schedules.length > 0 && (
                    <div className="content-card anim-fadeInUp section-gap">
                        <div className="content-card-header"><div className="content-card-title">Pending Schedules <span className="badge badge-amber" style={{ marginLeft: '6px' }}>{schedules.length}</span></div></div>
                        <div className="content-card-body" style={{ overflowX: 'auto' }}>
                            <table className="premium-table">
                                <thead><tr><th>Schedule ID</th><th>Product</th><th>Date</th><th>Type</th><th>Priority</th></tr></thead>
                                <tbody>{schedules.map((schedule) => (
                                    <tr key={schedule.schedule_id}>
                                        <td style={{ fontWeight: 700 }}>{schedule.schedule_id}</td>
                                        <td>{schedule.product_name}</td>
                                        <td>{schedule.scheduled_date?.split('T')[0]}</td>
                                        <td><span className="badge badge-teal">{schedule.inspection_type}</span></td>
                                        <td><span className={`badge ${schedule.priority_level === 'High' ? 'badge-red' : schedule.priority_level === 'Medium' ? 'badge-amber' : 'badge-green'}`}>{schedule.priority_level}</span></td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {showForm && <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                <div className="modal-panel">
                    <div className="modal-header"><div className="modal-title">{editing ? 'Edit Inspection' : 'New Inspection'}</div><button className="modal-close-btn" onClick={handleCancel}>×</button></div>
                    <form onSubmit={handleSubmit}><div className="modal-body">
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Inspection ID</label><input className="form-input" type="text" disabled value={editing ? formData.inspection_id : 'Auto-generated'} readOnly /></div>
                            <div className="form-group"><label className="form-label">Schedule</label><select className="form-select" required disabled={!!editing} value={formData.schedule_id} onChange={(e) => setFormData({ ...formData, schedule_id: e.target.value })}><option value="">Select</option>{schedules.map((schedule) => <option key={schedule.schedule_id} value={schedule.schedule_id}>{schedule.product_name} - {schedule.scheduled_date?.split('T')[0]}</option>)}</select></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" required value={formData.inspection_date} onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Result</label><select className="form-select" value={formData.inspection_result} onChange={(e) => setFormData({ ...formData, inspection_result: e.target.value })}><option value="Pass">Pass</option><option value="Fail">Fail</option></select></div>
                        </div>
                        <div className="form-group"><label className="form-label">Risk Score (0-100)</label><input className="form-input" type="number" min="0" max="100" required value={formData.risk_score} onChange={(e) => setFormData({ ...formData, risk_score: e.target.value })} /></div>
                        <div className="form-group"><label className="form-label">Remarks</label><input className="form-input" type="text" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} placeholder="Optional" /></div>
                    </div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button><button type="submit" className={`btn ${editing ? 'btn-warning' : 'btn-primary'}`}>{editing ? 'Update' : 'Create'}</button></div></form>
                </div>
            </div>}
        </div>
    );
};

export default Inspections;
