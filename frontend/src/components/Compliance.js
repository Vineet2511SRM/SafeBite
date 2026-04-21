import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';

const Compliance = ({ user }) => {
    const [data, setData] = useState([]);
    const [standards, setStandards] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'compliance');
    const [formData, setFormData] = useState({
        compliance_id: '', product_id: '', batch_id: '', standard_id: '', compliance_status: 'Compliant', checked_date: '', violation_count: ''
    });

    useEffect(() => { fetchData(); fetchStandards(); fetchBatches(); }, []);

    const showToast = (t, m) => { setToast({ type: t, message: m }); setTimeout(() => setToast(null), 3000); };
    const fetchData = async () => { try { const r = await api.get('/compliance'); setData(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
    const fetchStandards = async () => { try { const r = await api.get('/compliance/standards'); setStandards(r.data); } catch (e) { console.error(e); } };
    const fetchBatches = async () => { try { const r = await api.get('/compliance/batches'); setBatches(r.data); } catch (e) { console.error(e); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await api.put(`/compliance/${editing.compliance_id}`, formData); showToast('success', 'Updated'); }
            else { await api.post('/compliance', formData); showToast('success', 'Added'); }
            fetchData(); handleCancel();
        } catch (e) { showToast('error', e.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({ compliance_id: item.compliance_id, product_id: item.product_id, batch_id: item.batch_id,
            standard_id: item.standard_id, compliance_status: item.compliance_status,
            checked_date: item.checked_date?.split('T')[0] || '', violation_count: item.violation_count });
        setShowForm(true);
    };

    const handleDelete = async (id) => { if (window.confirm('Delete?')) { try { await api.delete(`/compliance/${id}`); showToast('success', 'Deleted'); fetchData(); } catch (e) { showToast('error', 'Failed'); } } };
    const handleCancel = () => { setShowForm(false); setEditing(null); setFormData({ compliance_id: '', product_id: '', batch_id: '', standard_id: '', compliance_status: 'Compliant', checked_date: '', violation_count: '' }); };

    const statusBadge = (s) => {
        const map = { 'Compliant': 'badge-green', 'Non-Compliant': 'badge-red', 'Under Review': 'badge-amber' };
        return <span className={`badge ${map[s] || 'badge-gray'}`}><span className="badge-dot"></span>{s}</span>;
    };

    const compliant = data.filter(r => r.compliance_status === 'Compliant').length;
    const nonCompliant = data.filter(r => r.compliance_status === 'Non-Compliant').length;
    const underReview = data.filter(r => r.compliance_status === 'Under Review').length;

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}
            <div className="main-header"><div className="main-header-row"><div><div className="main-header-title">Compliance</div><div className="main-header-subtitle">Monitor compliance records against food safety standards</div></div>
                {perms.create && <div className="main-header-actions"><button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Record</button></div>}
            </div></div>

            <div className="main-body">
                {!perms.update && <div className="rbac-notice">View-only access — your role cannot modify compliance records.</div>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    {[
                        { label: 'Compliant', count: compliant, color: 'green', abbr: 'OK' },
                        { label: 'Non-Compliant', count: nonCompliant, color: 'red', abbr: 'NC' },
                        { label: 'Under Review', count: underReview, color: 'amber', abbr: 'UR' },
                    ].map((s, i) => (
                        <div key={s.label} className={`stat-card ${s.color} anim-fadeInUp`} style={{ animationDelay: `${i * 0.08}s` }}>
                            <div className="stat-card-header"><div className="stat-card-icon">{s.abbr}</div></div>
                            <div className="stat-card-number">{s.count}</div>
                            <div className="stat-card-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="content-card anim-fadeInUp" style={{ animationDelay: '0.25s' }}>
                    <div className="content-card-header"><div className="content-card-title">All Records <span className="badge badge-green" style={{ marginLeft: '6px' }}>{data.length}</span></div></div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                        : data.length === 0 ? <div className="empty-state"><div className="empty-state-icon">CM</div><div className="empty-state-title">No records</div></div>
                        : <table className="premium-table">
                            <thead><tr><th>ID</th><th>Product</th><th>Standard</th><th>Status</th><th>Violations</th><th>Checked</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                            <tbody>{data.map((r, i) => (
                                <tr key={r.compliance_id} className="anim-fadeInUp" style={{ animationDelay: `${i * 0.02}s` }}>
                                    <td style={{ fontWeight: 700 }}>{r.compliance_id}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.product_name}</td>
                                    <td>{r.standard_name}</td>
                                    <td>{statusBadge(r.compliance_status)}</td>
                                    <td><span style={{ fontWeight: 700, color: r.violation_count > 0 ? 'var(--danger)' : 'var(--success)' }}>{r.violation_count}</span></td>
                                    <td>{r.checked_date?.split('T')[0]}</td>
                                    {(perms.update || perms.delete) && <td>
                                        {perms.update && <button className="table-action-btn" onClick={() => handleEdit(r)}>E</button>}
                                        {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(r.compliance_id)}>D</button>}
                                    </td>}
                                </tr>
                            ))}</tbody>
                        </table>}
                    </div>
                </div>
            </div>

            {showForm && <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                <div className="modal-panel">
                    <div className="modal-header"><div className="modal-title">{editing ? 'Edit Record' : 'Add Record'}</div><button className="modal-close-btn" onClick={handleCancel}>×</button></div>
                    <form onSubmit={handleSubmit}><div className="modal-body">
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Compliance ID</label><input className="form-input" type="number" required disabled={!!editing} value={formData.compliance_id} onChange={(e) => setFormData({ ...formData, compliance_id: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Checked Date</label><input className="form-input" type="date" required value={formData.checked_date} onChange={(e) => setFormData({ ...formData, checked_date: e.target.value })} /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Batch</label><select className="form-select" required value={`${formData.product_id}-${formData.batch_id}`} onChange={(e) => { const [p, b] = e.target.value.split('-'); setFormData({ ...formData, product_id: p, batch_id: b }); }}><option value="">Select</option>{batches.map(b => <option key={`${b.product_id}-${b.batch_id}`} value={`${b.product_id}-${b.batch_id}`}>{b.product_name} — Batch {b.batch_id}</option>)}</select></div>
                        <div className="form-group"><label className="form-label">Standard</label><select className="form-select" required value={formData.standard_id} onChange={(e) => setFormData({ ...formData, standard_id: e.target.value })}><option value="">Select</option>{standards.map(s => <option key={s.standard_id} value={s.standard_id}>{s.standard_name}</option>)}</select></div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={formData.compliance_status} onChange={(e) => setFormData({ ...formData, compliance_status: e.target.value })}><option>Compliant</option><option>Non-Compliant</option><option>Under Review</option></select></div>
                            <div className="form-group"><label className="form-label">Violations</label><input className="form-input" type="number" min="0" required value={formData.violation_count} onChange={(e) => setFormData({ ...formData, violation_count: e.target.value })} /></div>
                        </div>
                    </div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button><button type="submit" className={`btn ${editing ? 'btn-warning' : 'btn-primary'}`}>{editing ? 'Update' : 'Add'}</button></div></form>
                </div>
            </div>}
        </div>
    );
};

export default Compliance;