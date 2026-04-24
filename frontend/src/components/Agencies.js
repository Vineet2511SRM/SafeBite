import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';

const Agencies = ({ user }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'agencies');
    const [formData, setFormData] = useState({
        agency_id: '', agency_name: '', accreditation_number: '', region: '', email: '', contacts: []
    });
    const [newContact, setNewContact] = useState('');
    const resetFormData = () => ({
        agency_id: '',
        agency_name: '',
        accreditation_number: '',
        region: '',
        email: '',
        contacts: []
    });
    const normalizeItems = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

    useEffect(() => { fetchData(); }, []);

    const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 3000); };

    const fetchData = async () => {
        try {
            const r = await api.get('/agencies');
            const agenciesWithContacts = await Promise.all(r.data.map(async (a) => {
                try {
                    const contactsRes = await api.get(`/agency-contacts/${a.agency_id}/contacts`);
                    return { ...a, contacts: contactsRes.data.map(c => c.contact_number) };
                } catch {
                    return { ...a, contacts: [] };
                }
            }));
            setData(agenciesWithContacts);
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
                await api.put(`/agencies/${editing.agency_id}`, { ...formData, contacts: undefined });
                const existing = await api.get(`/agency-contacts/${editing.agency_id}/contacts`);
                for (const c of existing.data) {
                    await api.delete(`/agency-contacts/${editing.agency_id}/contacts/${encodeURIComponent(c.contact_number)}`);
                }
                for (const contact of normalizeItems(formData.contacts)) {
                    await api.post('/agency-contacts/contacts', { agency_id: editing.agency_id, contact_number: contact });
                }
                showToast('success', 'Agency updated successfully');
            } else {
                const result = await api.post('/agencies', { ...formData, agency_id: undefined });
                const newId = result.data.id;
                for (const contact of normalizeItems(formData.contacts)) {
                    await api.post('/agency-contacts/contacts', { agency_id: newId, contact_number: contact });
                }
                showToast('success', 'Agency added successfully');
            }
            fetchData(); handleCancel();
        } catch (e) {
            showToast('error', e.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({ ...item, contacts: item.contacts || [] });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this agency?')) {
            try {
                await api.delete(`/agencies/${id}`);
                showToast('success', 'Agency deleted successfully');
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
        setNewContact('');
    };

    const addContact = () => {
        const contact = newContact.trim();
        if (contact) {
            setFormData({ ...formData, contacts: normalizeItems([...formData.contacts, contact]) });
            setNewContact('');
        }
    };

    const removeContact = (index) => {
        setFormData({ ...formData, contacts: formData.contacts.filter((_, i) => i !== index) });
    };

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}

            <div className="main-header">
                <div className="main-header-row">
                    <div>
                        <div className="main-header-title">Agencies</div>
                        <div className="main-header-subtitle">Manage inspection agencies and contacts</div>
                    </div>
                    {perms.create && (
                        <div className="main-header-actions">
                            <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Agency</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="main-body">
                {!perms.create && <div className="rbac-notice">View-only access — your role does not have permission to add or modify agencies.</div>}

                <div className="content-card anim-fadeInUp">
                    <div className="content-card-header">
                        <div className="content-card-title">
                            All Agencies
                            <span className="badge badge-teal" style={{ marginLeft: '6px' }}>{data.length}</span>
                        </div>
                    </div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                        ) : data.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">AG</div>
                                <div className="empty-state-title">No agencies found</div>
                                <div className="empty-state-desc">Add your first agency to get started</div>
                            </div>
                        ) : (
                            <table className="premium-table">
                                <thead><tr><th>ID</th><th>Name</th><th>Accreditation No.</th><th>Region</th><th>Email</th><th>Contact Numbers</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                                <tbody>
                                    {data.map((a, i) => (
                                        <tr key={a.agency_id} className="anim-fadeInUp" style={{ animationDelay: `${i * 0.02}s` }}>
                                            <td style={{ fontWeight: 700 }}>{a.agency_id}</td>
                                            <td>{a.agency_name}</td>
                                            <td><code style={{ background: 'var(--bg)', padding: '3px 6px', borderRadius: '4px', fontSize: '11px' }}>{a.accreditation_number}</code></td>
                                            <td>{a.region}</td>
                                            <td>{a.email}</td>
                                            <td>{a.contacts ? a.contacts.join(', ') : 'None'}</td>
                                            {(perms.update || perms.delete) && (
                                                <td>
                                                    {perms.update && <button className="table-action-btn" onClick={() => handleEdit(a)} title="Edit">E</button>}
                                                    {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(a.agency_id)} title="Delete">D</button>}
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
                            <div className="modal-title">{editing ? 'Edit Agency' : 'Add Agency'}</div>
                            <button className="modal-close-btn" onClick={handleCancel}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">Agency ID</label><input className="form-input" type="text" disabled value={editing ? formData.agency_id : 'Auto-generated'} readOnly /></div>
                                    <div className="form-group"><label className="form-label">Agency Name</label><input className="form-input" type="text" required value={formData.agency_name} onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })} /></div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">Accreditation Number</label><input className="form-input" type="text" required value={formData.accreditation_number} onChange={(e) => setFormData({ ...formData, accreditation_number: e.target.value })} /></div>
                                    <div className="form-group"><label className="form-label">Region</label><input className="form-input" type="text" required value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} /></div>
                                </div>
                                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                                <div className="form-group">
                                    <label className="form-label">Contact Numbers</label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input className="form-input" type="text" value={newContact} onChange={(e) => setNewContact(e.target.value)} placeholder="Add contact number" />
                                        <button type="button" className="btn btn-secondary" onClick={addContact}>Add</button>
                                    </div>
                                    <div>
                                        {formData.contacts.map((contact, index) => (
                                            <span key={index} style={{ display: 'inline-block', background: 'var(--bg)', padding: '4px 8px', margin: '2px', borderRadius: '4px' }}>
                                                {contact} <button type="button" onClick={() => removeContact(index)} style={{ marginLeft: '4px', color: 'red' }}>×</button>
                                            </span>
                                        ))}
                                    </div>
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

export default Agencies;
