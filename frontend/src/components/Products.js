import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';

const Products = ({ user }) => {
    const [data, setData] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'products');
    const [formData, setFormData] = useState({
        product_id: '', product_name: '', shelf_life: '', approval_status: 'Pending', manufacturer_id: '', category_id: ''
    });

    useEffect(() => { fetchData(); fetchManufacturers(); }, []);

    const showToast = (t, m) => { setToast({ type: t, message: m }); setTimeout(() => setToast(null), 3000); };
    const fetchData = async () => { try { const r = await api.get('/products'); setData(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
    const fetchManufacturers = async () => { try { const r = await api.get('/manufacturers'); setManufacturers(r.data); } catch (e) { console.error(e); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await api.put(`/products/${editing.product_id}`, formData); showToast('success', 'Product updated'); }
            else { await api.post('/products', formData); showToast('success', 'Product added'); }
            fetchData(); handleCancel();
        } catch (e) { showToast('error', e.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (item) => { setEditing(item); setFormData({ ...item }); setShowForm(true); };
    const handleDelete = async (id) => { if (window.confirm('Delete?')) { try { await api.delete(`/products/${id}`); showToast('success', 'Deleted'); fetchData(); } catch (e) { showToast('error', 'Failed'); } } };
    const handleCancel = () => { setShowForm(false); setEditing(null); setFormData({ product_id: '', product_name: '', shelf_life: '', approval_status: 'Pending', manufacturer_id: '', category_id: '' }); };

    const statusBadge = (s) => {
        const map = { 'Approved': 'badge-green', 'Pending': 'badge-amber', 'Rejected': 'badge-red' };
        return <span className={`badge ${map[s] || 'badge-gray'}`}><span className="badge-dot"></span>{s}</span>;
    };

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}
            <div className="main-header"><div className="main-header-row"><div><div className="main-header-title">Products</div><div className="main-header-subtitle">Manage food products and approval statuses</div></div>
                {perms.create && <div className="main-header-actions"><button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Product</button></div>}
            </div></div>

            <div className="main-body">
                {!perms.create && <div className="rbac-notice">View-only access — your role does not have permission to modify products.</div>}
                <div className="content-card anim-fadeInUp">
                    <div className="content-card-header"><div className="content-card-title">All Products <span className="badge badge-green" style={{ marginLeft: '6px' }}>{data.length}</span></div></div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                        : data.length === 0 ? <div className="empty-state"><div className="empty-state-icon">PR</div><div className="empty-state-title">No products found</div></div>
                        : <table className="premium-table">
                            <thead><tr><th>ID</th><th>Product Name</th><th>Manufacturer</th><th>Category</th><th>Shelf Life</th><th>Status</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                            <tbody>{data.map((p, i) => (
                                <tr key={p.product_id} className="anim-fadeInUp" style={{ animationDelay: `${i * 0.02}s` }}>
                                    <td style={{ fontWeight: 700 }}>{p.product_id}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.product_name}</td>
                                    <td>{p.first_name} {p.last_name}</td>
                                    <td><span className="badge badge-teal">{p.category_name}</span></td>
                                    <td>{p.shelf_life} days</td>
                                    <td>{statusBadge(p.approval_status)}</td>
                                    {(perms.update || perms.delete) && <td>
                                        {perms.update && <button className="table-action-btn" onClick={() => handleEdit(p)}>E</button>}
                                        {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(p.product_id)}>D</button>}
                                    </td>}
                                </tr>
                            ))}</tbody>
                        </table>}
                    </div>
                </div>
            </div>

            {showForm && <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                <div className="modal-panel">
                    <div className="modal-header"><div className="modal-title">{editing ? 'Edit Product' : 'Add Product'}</div><button className="modal-close-btn" onClick={handleCancel}>×</button></div>
                    <form onSubmit={handleSubmit}><div className="modal-body">
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Product ID</label><input className="form-input" type="number" required disabled={!!editing} value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Shelf Life (days)</label><input className="form-input" type="text" required value={formData.shelf_life} onChange={(e) => setFormData({ ...formData, shelf_life: e.target.value })} /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Product Name</label><input className="form-input" type="text" required value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} /></div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Manufacturer</label><select className="form-select" required value={formData.manufacturer_id} onChange={(e) => setFormData({ ...formData, manufacturer_id: e.target.value })}><option value="">Select</option>{manufacturers.map(m => <option key={m.manufacturer_id} value={m.manufacturer_id}>{m.first_name} {m.last_name}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Category ID</label><input className="form-input" type="number" required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Approval Status</label><select className="form-select" value={formData.approval_status} onChange={(e) => setFormData({ ...formData, approval_status: e.target.value })}><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></div>
                    </div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button><button type="submit" className={`btn ${editing ? 'btn-warning' : 'btn-primary'}`}>{editing ? 'Update' : 'Add'}</button></div></form>
                </div>
            </div>}
        </div>
    );
};

export default Products;