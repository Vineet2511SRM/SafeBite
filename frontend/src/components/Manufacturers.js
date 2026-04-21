import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';

const Manufacturers = ({ user }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'manufacturers');
    const [formData, setFormData] = useState({
        manufacturer_id: '', first_name: '', last_name: '', license_number: '',
        street: '', city: '', state: '', pincode: '', registration_date: ''
    });

    useEffect(() => { fetchData(); }, []);

    const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 3000); };

    const fetchData = async () => {
        try { const r = await api.get('/manufacturers'); setData(r.data); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/manufacturers/${editing.manufacturer_id}`, formData);
                showToast('success', 'Manufacturer updated');
            } else {
                await api.post('/manufacturers', formData);
                showToast('success', 'Manufacturer added');
            }
            fetchData(); handleCancel();
        } catch (e) { showToast('error', e.response?.data?.message || 'Operation failed'); }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({ ...item, registration_date: item.registration_date?.split('T')[0] || '' });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this manufacturer?')) {
            try { await api.delete(`/manufacturers/${id}`); showToast('success', 'Deleted'); fetchData(); }
            catch (e) { showToast('error', e.response?.data?.message || 'Delete failed'); }
        }
    };

    const handleCancel = () => {
        setShowForm(false); setEditing(null);
        setFormData({ manufacturer_id: '', first_name: '', last_name: '', license_number: '',
            street: '', city: '', state: '', pincode: '', registration_date: '' });
    };

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}

            <div className="main-header">
                <div className="main-header-row">
                    <div>
                        <div className="main-header-title">Manufacturers</div>
                        <div className="main-header-subtitle">Manage food manufacturers and registrations</div>
                    </div>
                    {perms.create && (
                        <div className="main-header-actions">
                            <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Manufacturer</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="main-body">
                {!perms.create && <div className="rbac-notice">View-only access — your role does not have permission to add or modify manufacturers.</div>}

                <div className="content-card anim-fadeInUp">
                    <div className="content-card-header">
                        <div className="content-card-title">
                            All Manufacturers
                            <span className="badge badge-teal" style={{ marginLeft: '6px' }}>{data.length}</span>
                        </div>
                    </div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                        ) : data.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">MF</div>
                                <div className="empty-state-title">No manufacturers found</div>
                                <div className="empty-state-desc">Add your first manufacturer to get started</div>
                            </div>
                        ) : (
                            <table className="premium-table">
                                <thead><tr><th>ID</th><th>Name</th><th>License No.</th><th>Location</th><th>Pincode</th><th>Reg. Date</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                                <tbody>
                                    {data.map((m, i) => (
                                        <tr key={m.manufacturer_id} className="anim-fadeInUp" style={{ animationDelay: `${i * 0.02}s` }}>
                                            <td style={{ fontWeight: 700 }}>{m.manufacturer_id}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{
                                                        width: '28px', height: '28px', borderRadius: '7px',
                                                        background: 'var(--primary-ultra-light)', border: '1px solid var(--primary-light)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '11px', fontWeight: 700, color: 'var(--primary)'
                                                    }}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.first_name} {m.last_name}</span>
                                                </div>
                                            </td>
                                            <td><code style={{ background: 'var(--bg)', padding: '3px 6px', borderRadius: '4px', fontSize: '11px' }}>{m.license_number}</code></td>
                                            <td>{m.city}, {m.state}</td>
                                            <td>{m.pincode}</td>
                                            <td>{m.registration_date?.split('T')[0]}</td>
                                            {(perms.update || perms.delete) && (
                                                <td>
                                                    {perms.update && <button className="table-action-btn" onClick={() => handleEdit(m)} title="Edit">E</button>}
                                                    {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(m.manufacturer_id)} title="Delete">D</button>}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                    <div className="modal-panel">
                        <div className="modal-header">
                            <div className="modal-title">{editing ? 'Edit Manufacturer' : 'Add Manufacturer'}</div>
                            <button className="modal-close-btn" onClick={handleCancel}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">Manufacturer ID</label><input className="form-input" type="number" required disabled={!!editing} value={formData.manufacturer_id} onChange={(e) => setFormData({ ...formData, manufacturer_id: e.target.value })} /></div>
                                    <div className="form-group"><label className="form-label">License Number</label><input className="form-input" type="text" required value={formData.license_number} onChange={(e) => setFormData({ ...formData, license_number: e.target.value })} /></div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">First Name</label><input className="form-input" type="text" required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} /></div>
                                    <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" type="text" required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} /></div>
                                </div>
                                <div className="form-group"><label className="form-label">Street</label><input className="form-input" type="text" required value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} /></div>
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">City</label><input className="form-input" type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></div>
                                    <div className="form-group"><label className="form-label">State</label><input className="form-input" type="text" required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} /></div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">Pincode</label><input className="form-input" type="text" required value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} /></div>
                                    <div className="form-group"><label className="form-label">Registration Date</label><input className="form-input" type="date" required value={formData.registration_date} onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })} /></div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
                                <button type="submit" className={`btn ${editing ? 'btn-warning' : 'btn-primary'}`}>{editing ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Manufacturers;