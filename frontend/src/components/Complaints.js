import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';
import PageHeader from './PageHeader';
import { EmptyState, ErrorState, LoadingState } from './DataState';

const Complaints = ({ user }) => {
    const [data, setData] = useState([]);
    const [consumers, setConsumers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'complaints');
    const [formData, setFormData] = useState({
        complaint_id: '',
        consumer_id: '',
        product_id: '',
        complaint_date: '',
        complaint_type: 'Quality',
        status: 'Open'
    });

    const resetFormData = () => ({
        complaint_id: '',
        consumer_id: '',
        product_id: '',
        complaint_date: '',
        complaint_type: 'Quality',
        status: 'Open'
    });

    useEffect(() => { fetchData(); fetchConsumers(); fetchProducts(); }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = async () => {
        try {
            const response = await api.get('/complaints');
            setData(response.data);
            setError('');
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || 'Unable to load complaints right now.');
        } finally {
            setLoading(false);
        }
    };

    const fetchConsumers = async () => {
        try {
            const response = await api.get('/complaints/consumers');
            setConsumers(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/complaints/${editing.complaint_id}`, formData);
                showToast('success', 'Complaint record updated successfully');
            } else {
                await api.post('/complaints', { ...formData, complaint_id: undefined });
                showToast('success', 'Complaint record inserted successfully');
            }
            fetchData();
            handleCancel();
        } catch (e) {
            showToast('error', e.response?.data?.message || 'Failed');
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({
            ...item,
            complaint_date: item.complaint_date?.split('T')[0] || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this complaint?')) {
            try {
                await api.delete(`/complaints/${id}`);
                showToast('success', 'Complaint record deleted successfully');
                fetchData();
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

    const statusBadge = (status) => {
        const map = {
            Resolved: 'badge-green',
            Closed: 'badge-green',
            Investigating: 'badge-amber',
            Open: 'badge-red',
            Escalated: 'badge-red',
            'Under Review': 'badge-amber'
        };
        return <span className={`badge ${map[status] || 'badge-gray'}`}><span className="badge-dot"></span>{status}</span>;
    };

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}
            <PageHeader
                title="Complaints"
                subtitle="Track and resolve consumer complaints"
                actions={perms.create ? <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Log Complaint</button> : null}
            />

            <div className="main-body">
                {!perms.create && <div className="rbac-notice">View-only access - your role cannot modify complaints.</div>}
                <div className="content-card anim-fadeInUp">
                    <div className="content-card-header"><div className="content-card-title">All Complaints <span className="badge badge-amber" style={{ marginLeft: '6px' }}>{data.length}</span></div></div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? <LoadingState />
                            : error ? <ErrorState message={error} />
                                : data.length === 0 ? <EmptyState icon="CP" title="No complaints" description="Complaint records will appear here once they are logged." />
                                    : <table className="premium-table">
                                        <thead><tr><th>ID</th><th>Consumer</th><th>Product</th><th>Type</th><th>Date</th><th>Status</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                                        <tbody>{data.map((complaint, index) => (
                                            <tr key={complaint.complaint_id} className="anim-fadeInUp" style={{ animationDelay: `${index * 0.02}s` }}>
                                                <td style={{ fontWeight: 700 }}>{complaint.complaint_id}</td>
                                                <td>
                                                    <div className="identity-cell">
                                                        <div className="identity-avatar warning">{complaint.first_name?.[0]}{complaint.last_name?.[0]}</div>
                                                        <span className="identity-name">{complaint.first_name} {complaint.last_name}</span>
                                                    </div>
                                                </td>
                                                <td>{complaint.product_name}</td>
                                                <td><span className="badge badge-teal">{complaint.complaint_type}</span></td>
                                                <td>{complaint.complaint_date?.split('T')[0]}</td>
                                                <td>{statusBadge(complaint.status)}</td>
                                                {(perms.update || perms.delete) && <td>
                                                    {perms.update && <button className="table-action-btn" onClick={() => handleEdit(complaint)}>E</button>}
                                                    {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(complaint.complaint_id)}>D</button>}
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
                            <div className="form-group"><label className="form-label">Complaint ID</label><input className="form-input" type="text" disabled value={editing ? formData.complaint_id : 'Auto-generated'} readOnly /></div>
                            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" required value={formData.complaint_date} onChange={(e) => setFormData({ ...formData, complaint_date: e.target.value })} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Consumer</label><select className="form-select" required value={formData.consumer_id} onChange={(e) => setFormData({ ...formData, consumer_id: e.target.value })}><option value="">Select</option>{consumers.map((consumer) => <option key={consumer.consumer_id} value={consumer.consumer_id}>{consumer.name}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Product</label><select className="form-select" required value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}><option value="">Select</option>{products.map((product) => <option key={product.product_id} value={product.product_id}>{product.product_name}</option>)}</select></div>
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
