import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';

const Inspections = ({ user }) => {
    const [data, setData] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'inspections');
    const [formData, setFormData] = useState({
        inspection_id: '', schedule_id: '', inspection_date: '', inspection_result: 'Pass', risk_score: '', remarks: ''
    });

    useEffect(() => { fetchData(); fetchSchedules(); }, []);

    const showToast = (t, m) => { setToast({ type: t, message: m }); setTimeout(() => setToast(null), 3000); };
    const fetchData = async () => { try { const r = await api.get('/inspections'); setData(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
    const fetchSchedules = async () => { try { const r = await api.get('/inspections/schedules'); setSchedules(r.data); } catch (e) { console.error(e); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await api.put(`/inspections/${editing.inspection_id}`, formData); showToast('success', 'Updated'); }
            else { await api.post('/inspections', formData); showToast('success', 'Created'); }
            fetchData(); fetchSchedules(); handleCancel();
        } catch (e) { showToast('error', e.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({ inspection_id: item.inspection_id, schedule_id: item.schedule_id,
            inspection_date: item.inspection_date?.split('T')[0] || '', inspection_result: item.inspection_result,
            risk_score: item.risk_score, remarks: item.remarks || '' });
        setShowForm(true);
    };

    const handleDelete = async (id) => { if (window.confirm('Delete?')) { try { await api.delete(`/inspections/${id}`); showToast('success', 'Deleted'); fetchData(); fetchSchedules(); } catch (e) { showToast('error', 'Failed'); } } };
    const handleCancel = () => { setShowForm(false); setEditing(null); setFormData({ inspection_id: '', schedule_id: '', inspection_date: '', inspection_result: 'Pass', risk_score: '', remarks: '' }); };

    const resultBadge = (r) => r === 'Pass' ? <span className="badge badge-green"><span className="badge-dot"></span>Pass</span> : <span className="badge badge-red"><span className="badge-dot"></span>Fail</span>;
    const riskColor = (s) => s < 30 ? 'var(--success)' : s < 60 ? 'var(--warning)' : 'var(--danger)';

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}
            <div className="main-header"><div className="main-header-row"><div><div className="main-header-title">Inspections</div><div className="main-header-subtitle">Schedule and manage food safety inspections</div></div>
                {perms.create && <div className="main-header-actions"><button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Inspection</button></div>}
            </div></div>

            <div className="main-body">
                <div className="content-card anim-fadeInUp">
                    <div className="content-card-header"><div className="content-card-title">All Inspections <span className="badge badge-blue" style={{ marginLeft: '6px' }}>{data.length}</span></div></div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                        : data.length === 0 ? <div className="empty-state"><div className="empty-state-icon">IS</div><div className="empty-state-title">No inspections</div></div>
                        : <table className="premium-table">
                            <thead><tr><th>ID</th><th>Product</th><th>Date</th><th>Result</th><th>Risk</th><th>Type</th><th>Remarks</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                            <tbody>{data.map((ins, i) => (
                                <tr key={ins.inspection_id} className="anim-fadeInUp" style={{ animationDelay: `${i * 0.02}s` }}>
                                    <td style={{ fontWeight: 700 }}>{ins.inspection_id}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ins.product_name}</td>
                                    <td>{ins.inspection_date?.split('T')[0]}</td>
                                    <td>{resultBadge(ins.inspection_result)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '36px', height: '5px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden' }}>
                                                <div style={{ width: `${ins.risk_score}%`, height: '100%', background: riskColor(ins.risk_score), borderRadius: '3px' }}></div>
                                            </div>
                                            <span style={{ fontWeight: 700, color: riskColor(ins.risk_score), fontSize: '12px' }}>{ins.risk_score}</span>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-gray">{ins.inspection_type || '—'}</span></td>
                                    <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ins.remarks || '—'}</td>
                                    {(perms.update || perms.delete) && <td>
                                        {perms.update && <button className="table-action-btn" onClick={() => handleEdit(ins)}>E</button>}
                                        {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(ins.inspection_id)}>D</button>}
                                    </td>}
                                </tr>
                            ))}</tbody>
                        </table>}
                    </div>
                </div>

                {schedules.length > 0 && (
                    <div className="content-card anim-fadeInUp" style={{ marginTop: '20px' }}>
                        <div className="content-card-header"><div className="content-card-title">Pending Schedules <span className="badge badge-amber" style={{ marginLeft: '6px' }}>{schedules.length}</span></div></div>
                        <div className="content-card-body" style={{ overflowX: 'auto' }}>
                            <table className="premium-table">
                                <thead><tr><th>Schedule ID</th><th>Product</th><th>Date</th><th>Type</th><th>Priority</th></tr></thead>
                                <tbody>{schedules.map(s => (
                                    <tr key={s.schedule_id}>
                                        <td style={{ fontWeight: 700 }}>{s.schedule_id}</td><td>{s.product_name}</td><td>{s.scheduled_date?.split('T')[0]}</td>
                                        <td><span className="badge badge-teal">{s.inspection_type}</span></td>
                                        <td><span className={`badge ${s.priority_level === 'High' ? 'badge-red' : s.priority_level === 'Medium' ? 'badge-amber' : 'badge-green'}`}>{s.priority_level}</span></td>
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
                            <div className="form-group"><label className="form-label">Inspection ID</label><input className="form-input" type="number" required disabled={!!editing} value={formData.inspection_id} onChange={(e) => setFormData({ ...formData, inspection_id: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Schedule</label><select className="form-select" required disabled={!!editing} value={formData.schedule_id} onChange={(e) => setFormData({ ...formData, schedule_id: e.target.value })}><option value="">Select</option>{schedules.map(s => <option key={s.schedule_id} value={s.schedule_id}>{s.product_name} — {s.scheduled_date?.split('T')[0]}</option>)}</select></div>
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