import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';

const Complaints = ({ user }) => {
    const [data, setData] = useState([]);
    const [consumers, setConsumers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'complaints');
    const [formData, setFormData] = useState({
        complaint_id: '', consumer_id: '', product_id: '', complaint_date: '', complaint_type: 'Quality', status: 'Open'
    });

    useEffect(() => { fetchData(); fetchConsumers(); fetchProducts(); }, []);

    const showToast = (t, m) => { setToast({ type: t, message: m }); setTimeout(() => setToast(null), 3000); };
    const fetchData = async () => { try { const r = await api.get('/complaints'); setData(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
    const fetchConsumers = async () => { try { const r = await api.get('/complaints/consumers'); setConsumers(r.data); } catch (e) { console.error(e); } };
    const fetchProducts = async () => { try { const r = await api.get('/products'); setProducts(r.data); } catch (e) { console.error(e); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await api.put(`/complaints/${editing.complaint_id}`, formData); showToast('success', 'Updated'); }
            else { await api.post('/complaints', formData); showToast('success', 'Added'); }
            fetchData(); handleCancel();
        } catch (e) { showToast('error', e.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (item) => { setEditing(item); setFormData({ ...item, complaint_date: item.complaint_date?.split('T')[0] || '' }); setShowForm(true); };
    const handleDelete = async (id) => { if (window.confirm('Delete?')) { try { await api.delete(`/complaints/${id}`); showToast('success', 'Deleted'); fetchData(); } catch (e) { showToast('error', 'Failed'); } } };
    const handleCancel = () => { setShowForm(false); setEditing(null); setFormData({ complaint_id: '', consumer_id: '', product_id: '', complaint_date: '', complaint_type: 'Quality', status: 'Open' }); };

    const statusBadge = (s) => {
        const map = { 'Resolved': 'badge-green', 'Closed': 'badge-green', 'Investigating': 'badge-amber', 'Open': 'badge-red', 'Escalated': 'badge-red', 'Under Review': 'badge-amber' };
        return <span className={`badge ${map[s] || 'badge-gray'}`}><span className="badge-dot"></span>{s}</span>;
    };

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}
            <div className="main-header"><div className="main-header-row"><div><div className="main-header-title">Complaints</div><div className="main-header-subtitle">Track and resolve consumer complaints</div></div>
                {perms.create && <div className="main-header-actions"><button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Log Complaint</button></div>}
            </div></div>

            <div className="main-body">
                {!perms.create && <div className="rbac-notice">View-only access — your role cannot modify complaints.</div>}
                <div className="content-card anim-fadeInUp">
                    <div className="content-card-header"><div className="content-card-title">All Complaints <span className="badge badge-amber" style={{ marginLeft: '6px' }}>{data.length}</span></div></div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                        : data.length === 0 ? <div className="empty-state"><div className="empty-state-icon">CP</div><div className="empty-state-title">No complaints</div></div>
                        : <table className="premium-table">
                            <thead><tr><th>ID</th><th>Consumer</th><th>Product</th><th>Type</th><th>Date</th><th>Status</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                            <tbody>{data.map((c, i) => (
                                <tr key={c.complaint_id} className="anim-fadeInUp" style={{ animationDelay: `${i * 0.02}s` }}>
                                    <td style={{ fontWeight: 700 }}>{c.complaint_id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--warning)' }}>{c.first_name?.[0]}{c.last_name?.[0]}</div>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.first_name} {c.last_name}</span>
                                        </div>
                                    </td>
                                    <td>{c.product_name}</td>
                                    <td><span className="badge badge-teal">{c.complaint_type}</span></td>
                                    <td>{c.complaint_date?.split('T')[0]}</td>
                                    <td>{statusBadge(c.status)}</td>
                                    {(perms.update || perms.delete) && <td>
                                        {perms.update && <button className="table-action-btn" onClick={() => handleEdit(c)}>E</button>}
                                        {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(c.complaint_id)}>D</button>}
                                    </td>}
                                </tr>
                            ))}</tbody>
                        </table>}
                    </div>
                </div>
            </div>

            {showForm && <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                <div className="modal-panel">
                    <div className="modal-header"><div className="modal-title">{editing ? 'Edit Complaint' : 'Log Complaint'}</div><button className="modal-close-btn" onClick={handleCancel}>×</button></div>
                    <form onSubmit={handleSubmit}><div className="modal-body">
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Complaint ID</label><input className="form-input" type="number" required disabled={!!editing} value={formData.complaint_id} onChange={(e) => setFormData({ ...formData, complaint_id: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" required value={formData.complaint_date} onChange={(e) => setFormData({ ...formData, complaint_date: e.target.value })} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Consumer</label><select className="form-select" required value={formData.consumer_id} onChange={(e) => setFormData({ ...formData, consumer_id: e.target.value })}><option value="">Select</option>{consumers.map(c => <option key={c.consumer_id} value={c.consumer_id}>{c.name}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Product</label><select className="form-select" required value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}><option value="">Select</option>{products.map(p => <option key={p.product_id} value={p.product_id}>{p.product_name}</option>)}</select></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={formData.complaint_type} onChange={(e) => setFormData({ ...formData, complaint_type: e.target.value })}><option>Quality</option><option>Packaging</option><option>Labeling</option><option>Allergen</option><option>Contamination</option><option>Other</option></select></div>
                            <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}><option>Open</option><option>Investigating</option><option>Resolved</option><option>Closed</option></select></div>
                        </div>
                    </div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button><button type="submit" className={`btn ${editing ? 'btn-warning' : 'btn-primary'}`}>{editing ? 'Update' : 'Log'}</button></div></form>
                </div>
            </div>}
        </div>
    );
};

export default Complaints;