import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';

const Categories = ({ user }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'categories');
    const [formData, setFormData] = useState({
        category_id: '', category_name: '', description: '', risk_level: 'Low', is_active: 'Y', guidelines: []
    });
    const [newGuideline, setNewGuideline] = useState('');
    const resetFormData = () => ({
        category_id: '',
        category_name: '',
        description: '',
        risk_level: 'Low',
        is_active: 'Y',
        guidelines: []
    });
    const normalizeItems = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

    useEffect(() => { fetchData(); }, []);

    const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 3000); };

    const fetchData = async () => {
        try {
            const r = await api.get('/categories');
            const categoriesWithGuidelines = await Promise.all(r.data.map(async (c) => {
                try {
                    const guidelinesRes = await api.get(`/category-guidelines/${c.category_id}/guidelines`);
                    return { ...c, guidelines: guidelinesRes.data.map(g => g.guideline) };
                } catch {
                    return { ...c, guidelines: [] };
                }
            }));
            setData(categoriesWithGuidelines);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/categories/${editing.category_id}`, { ...formData, guidelines: undefined });
                const existing = await api.get(`/category-guidelines/${editing.category_id}/guidelines`);
                for (const g of existing.data) {
                    await api.delete(`/category-guidelines/${editing.category_id}/guidelines/${encodeURIComponent(g.guideline)}`);
                }
                for (const guideline of normalizeItems(formData.guidelines)) {
                    await api.post('/category-guidelines/guidelines', { category_id: editing.category_id, guideline });
                }
                showToast('success', 'Category updated successfully');
            } else {
                const result = await api.post('/categories', { ...formData, category_id: undefined });
                const newId = result.data.id;
                for (const guideline of normalizeItems(formData.guidelines)) {
                    await api.post('/category-guidelines/guidelines', { category_id: newId, guideline });
                }
                showToast('success', 'Category added successfully');
            }
            fetchData(); handleCancel();
        } catch (e) {
            showToast('error', e.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({ ...item, guidelines: item.guidelines || [] });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category?')) {
            try {
                await api.delete(`/categories/${id}`);
                showToast('success', 'Category deleted successfully');
                fetchData();
            } catch (e) {
                showToast('error', e.response?.data?.message || 'Delete failed');
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditing(null);
        setFormData(resetFormData());
        setNewGuideline('');
    };

    const addGuideline = () => {
        const guideline = newGuideline.trim();
        if (guideline) {
            setFormData({ ...formData, guidelines: normalizeItems([...formData.guidelines, guideline]) });
            setNewGuideline('');
        }
    };

    const removeGuideline = (index) => {
        setFormData({ ...formData, guidelines: formData.guidelines.filter((_, i) => i !== index) });
    };

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}

            <div className="main-header">
                <div className="main-header-row">
                    <div>
                        <div className="main-header-title">Categories</div>
                        <div className="main-header-subtitle">Manage food categories and storage guidelines</div>
                    </div>
                    {perms.create && (
                        <div className="main-header-actions">
                            <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Category</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="main-body">
                {!perms.create && <div className="rbac-notice">View-only access — your role does not have permission to add or modify categories.</div>}

                <div className="content-card anim-fadeInUp">
                    <div className="content-card-header">
                        <div className="content-card-title">
                            All Categories
                            <span className="badge badge-teal" style={{ marginLeft: '6px' }}>{data.length}</span>
                        </div>
                    </div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                        ) : data.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">CT</div>
                                <div className="empty-state-title">No categories found</div>
                                <div className="empty-state-desc">Add your first category to get started</div>
                            </div>
                        ) : (
                            <table className="premium-table">
                                <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Risk Level</th><th>Active</th><th>Storage Guidelines</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                                <tbody>
                                    {data.map((c, i) => (
                                        <tr key={c.category_id} className="anim-fadeInUp" style={{ animationDelay: `${i * 0.02}s` }}>
                                            <td style={{ fontWeight: 700 }}>{c.category_id}</td>
                                            <td>{c.category_name}</td>
                                            <td>{c.description}</td>
                                            <td><span className={`badge ${c.risk_level === 'High' ? 'badge-red' : c.risk_level === 'Medium' ? 'badge-amber' : 'badge-green'}`}>{c.risk_level}</span></td>
                                            <td>{c.is_active === 'Y' ? 'Yes' : 'No'}</td>
                                            <td>
                                                {c.guidelines && c.guidelines.length > 0 ? (
                                                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                                        {c.guidelines.map((g, idx) => <li key={idx}>{g}</li>)}
                                                    </ul>
                                                ) : 'None'}
                                            </td>
                                            {(perms.update || perms.delete) && (
                                                <td>
                                                    {perms.update && <button className="table-action-btn" onClick={() => handleEdit(c)} title="Edit">E</button>}
                                                    {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(c.category_id)} title="Delete">D</button>}
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
                            <div className="modal-title">{editing ? 'Edit Category' : 'Add Category'}</div>
                            <button className="modal-close-btn" onClick={handleCancel}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">Category ID</label><input className="form-input" type="text" disabled value={editing ? formData.category_id : 'Auto-generated'} readOnly /></div>
                                    <div className="form-group"><label className="form-label">Category Name</label><input className="form-input" type="text" required value={formData.category_name} onChange={(e) => setFormData({ ...formData, category_name: e.target.value })} /></div>
                                </div>
                                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">Risk Level</label><select className="form-input" value={formData.risk_level} onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}>
                                        <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                                    </select></div>
                                    <div className="form-group"><label className="form-label">Active</label><select className="form-input" value={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}>
                                        <option value="Y">Yes</option><option value="N">No</option>
                                    </select></div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Storage Guidelines</label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input className="form-input" type="text" value={newGuideline} onChange={(e) => setNewGuideline(e.target.value)} placeholder="Add guideline" />
                                        <button type="button" className="btn btn-secondary" onClick={addGuideline}>Add</button>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                        {formData.guidelines.map((g, index) => (
                                            <li key={index}>{g} <button type="button" onClick={() => removeGuideline(index)} style={{ marginLeft: '4px', color: 'red' }}>×</button></li>
                                        ))}
                                    </ul>
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

export default Categories;
