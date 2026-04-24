import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';

const Products = ({ user }) => {
    const [data, setData] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'products');
    const [formData, setFormData] = useState({
        product_id: '', product_name: '', shelf_life: '', approval_status: 'Pending', manufacturer_id: '', category_id: '', certifications: []
    });
    const [newCertification, setNewCertification] = useState('');
    const resetFormData = () => ({
        product_id: '',
        product_name: '',
        shelf_life: '',
        approval_status: 'Pending',
        manufacturer_id: '',
        category_id: '',
        certifications: []
    });
    const normalizeItems = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

    useEffect(() => { fetchData(); fetchManufacturers(); fetchCategories(); }, []);

    const showToast = (t, m) => { setToast({ type: t, message: m }); setTimeout(() => setToast(null), 3000); };
    const fetchData = async () => {
        try {
            const r = await api.get('/products');
            const productsWithCerts = await Promise.all(r.data.map(async (p) => {
                try {
                    const certsRes = await api.get(`/product-certifications/${p.product_id}/certifications`);
                    return { ...p, certifications: certsRes.data.map(c => c.certification) };
                } catch {
                    return { ...p, certifications: [] };
                }
            }));
            setData(productsWithCerts);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    const fetchManufacturers = async () => { try { const r = await api.get('/manufacturers'); setManufacturers(r.data); } catch (e) { console.error(e); } };
    const fetchCategories = async () => { try { const r = await api.get('/categories'); setCategories(r.data); } catch (e) { console.error(e); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/products/${editing.product_id}`, { ...formData, certifications: undefined });
                const existing = await api.get(`/product-certifications/${editing.product_id}/certifications`);
                for (const c of existing.data) {
                    await api.delete(`/product-certifications/${editing.product_id}/certifications/${encodeURIComponent(c.certification)}`);
                }
                for (const cert of normalizeItems(formData.certifications)) {
                    await api.post('/product-certifications/certifications', { product_id: editing.product_id, certification: cert });
                }
                showToast('success', 'Product record updated successfully');
            } else {
                const result = await api.post('/products', { ...formData, product_id: undefined });
                const newId = result.data.id;
                for (const cert of normalizeItems(formData.certifications)) {
                    await api.post('/product-certifications/certifications', { product_id: newId, certification: cert });
                }
                showToast('success', 'Product record inserted successfully');
            }
            fetchData(); handleCancel();
        } catch (e) { showToast('error', e.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (item) => { setEditing(item); setFormData({ ...item, certifications: item.certifications || [] }); setShowForm(true); };
    const handleDelete = async (id) => { if (window.confirm('Delete?')) { try { await api.delete(`/products/${id}`); showToast('success', 'Product record deleted successfully'); fetchData(); } catch (e) { showToast('error', 'Failed'); } } };
    const handleCancel = () => { setShowForm(false); setEditing(null); setFormData(resetFormData()); setNewCertification(''); };

    const addCertification = () => {
        const certification = newCertification.trim();
        if (certification) {
            setFormData({ ...formData, certifications: normalizeItems([...formData.certifications, certification]) });
            setNewCertification('');
        }
    };

    const removeCertification = (index) => {
        setFormData({ ...formData, certifications: formData.certifications.filter((_, i) => i !== index) });
    };

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
                                    <thead><tr><th>ID</th><th>Product Name</th><th>Manufacturer</th><th>Category</th><th>Certifications</th><th>Shelf Life</th><th>Status</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                                    <tbody>{data.map((p, i) => (
                                        <tr key={p.product_id} className="anim-fadeInUp" style={{ animationDelay: `${i * 0.02}s` }}>
                                            <td style={{ fontWeight: 700 }}>{p.product_id}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.product_name}</td>
                                            <td>{p.first_name} {p.last_name}</td>
                                            <td><span className="badge badge-teal">{p.category_name}</span></td>
                                            <td>{p.certifications?.length ? p.certifications.map((c, idx) => <span key={idx} className="badge badge-teal" style={{ margin: '2px', display: 'inline-flex' }}>{c}</span>) : 'None'}</td>
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
                            <div className="form-group"><label className="form-label">Product ID</label><input className="form-input" type="number" disabled value={editing ? formData.product_id : 'Auto-generated'} readOnly /></div>
                            <div className="form-group"><label className="form-label">Shelf Life (days)</label><input className="form-input" type="text" required value={formData.shelf_life} onChange={(e) => setFormData({ ...formData, shelf_life: e.target.value })} /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Product Name</label><input className="form-input" type="text" required value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} /></div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Manufacturer</label><select className="form-select" required value={formData.manufacturer_id} onChange={(e) => setFormData({ ...formData, manufacturer_id: e.target.value })}><option value="">Select</option>{manufacturers.map(m => <option key={m.manufacturer_id} value={m.manufacturer_id}>{m.first_name} {m.last_name}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Category</label><select className="form-select" required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}><option value="">Select category</option>{categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}</select></div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Approval Status</label><select className="form-select" value={formData.approval_status} onChange={(e) => setFormData({ ...formData, approval_status: e.target.value })}><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></div>
                        <div className="form-group">
                            <label className="form-label">Certifications</label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input className="form-input" type="text" value={newCertification} onChange={(e) => setNewCertification(e.target.value)} placeholder="Add certification" />
                                <button type="button" className="btn btn-secondary" onClick={addCertification}>Add</button>
                            </div>
                            <div>
                                {formData.certifications.map((cert, index) => (
                                    <span key={index} style={{ display: 'inline-block', background: 'var(--bg)', padding: '4px 8px', margin: '2px', borderRadius: '4px' }}>
                                        {cert} <button type="button" onClick={() => removeCertification(index)} style={{ marginLeft: '4px', color: 'red' }}>×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button><button type="submit" className={`btn ${editing ? 'btn-warning' : 'btn-primary'}`}>{editing ? 'Update' : 'Add'}</button></div></form>
                </div>
            </div>}
        </div>
    );
};

export default Products;
