import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getPermissions } from '../rbac';
import PageHeader from './PageHeader';
import { EmptyState, ErrorState, LoadingState } from './DataState';

const Compliance = ({ user }) => {
    const [data, setData] = useState([]);
    const [standards, setStandards] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const perms = getPermissions(user?.role, 'compliance');
    const [formData, setFormData] = useState({
        compliance_id: '',
        product_id: '',
        batch_id: '',
        standard_id: '',
        compliance_status: 'Compliant',
        checked_date: '',
        violation_count: ''
    });

    const resetFormData = () => ({
        compliance_id: '',
        product_id: '',
        batch_id: '',
        standard_id: '',
        compliance_status: 'Compliant',
        checked_date: '',
        violation_count: ''
    });

    useEffect(() => { fetchData(); fetchStandards(); fetchBatches(); }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = async () => {
        try {
            const response = await api.get('/compliance');
            setData(response.data);
            setError('');
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || 'Unable to load compliance records right now.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStandards = async () => {
        try {
            const response = await api.get('/compliance/standards');
            setStandards(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchBatches = async () => {
        try {
            const response = await api.get('/compliance/batches');
            setBatches(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/compliance/${editing.compliance_id}`, formData);
                showToast('success', 'Compliance record updated successfully');
            } else {
                await api.post('/compliance', { ...formData, compliance_id: undefined });
                showToast('success', 'Compliance record inserted successfully');
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
            compliance_id: item.compliance_id,
            product_id: item.product_id,
            batch_id: item.batch_id,
            standard_id: item.standard_id,
            compliance_status: item.compliance_status,
            checked_date: item.checked_date?.split('T')[0] || '',
            violation_count: item.violation_count
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this compliance record?')) {
            try {
                await api.delete(`/compliance/${id}`);
                showToast('success', 'Compliance record deleted successfully');
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
        const map = { Compliant: 'badge-green', 'Non-Compliant': 'badge-red', 'Under Review': 'badge-amber' };
        return <span className={`badge ${map[status] || 'badge-gray'}`}><span className="badge-dot"></span>{status}</span>;
    };

    const compliant = data.filter((record) => record.compliance_status === 'Compliant').length;
    const nonCompliant = data.filter((record) => record.compliance_status === 'Non-Compliant').length;
    const underReview = data.filter((record) => record.compliance_status === 'Under Review').length;

    return (
        <div className="main-content">
            {toast && <div className="toast-container"><div className={`toast toast-${toast.type}`}>{toast.message}</div></div>}
            <PageHeader
                title="Compliance"
                subtitle="Monitor compliance records against food safety standards"
                actions={perms.create ? <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Record</button> : null}
            />

            <div className="main-body">
                {!perms.update && <div className="rbac-notice">View-only access - your role cannot modify compliance records.</div>}

                <div className="mini-stats-grid">
                    {[
                        { label: 'Compliant', count: compliant, color: 'green', abbr: 'OK' },
                        { label: 'Non-Compliant', count: nonCompliant, color: 'red', abbr: 'NC' },
                        { label: 'Under Review', count: underReview, color: 'amber', abbr: 'UR' },
                    ].map((item, index) => (
                        <div key={item.label} className={`stat-card ${item.color} anim-fadeInUp`} style={{ animationDelay: `${index * 0.08}s` }}>
                            <div className="stat-card-header"><div className="stat-card-icon">{item.abbr}</div></div>
                            <div className="stat-card-number">{item.count}</div>
                            <div className="stat-card-label">{item.label}</div>
                        </div>
                    ))}
                </div>

                <div className="content-card anim-fadeInUp" style={{ animationDelay: '0.25s' }}>
                    <div className="content-card-header"><div className="content-card-title">All Records <span className="badge badge-green" style={{ marginLeft: '6px' }}>{data.length}</span></div></div>
                    <div className="content-card-body" style={{ overflowX: 'auto' }}>
                        {loading ? <LoadingState />
                            : error ? <ErrorState message={error} />
                                : data.length === 0 ? <EmptyState icon="CM" title="No records" description="Compliance records will appear here once checks are recorded." />
                                    : <table className="premium-table">
                                        <thead><tr><th>ID</th><th>Product</th><th>Standard</th><th>Status</th><th>Violations</th><th>Checked</th>{(perms.update || perms.delete) && <th>Actions</th>}</tr></thead>
                                        <tbody>{data.map((record, index) => (
                                            <tr key={record.compliance_id} className="anim-fadeInUp" style={{ animationDelay: `${index * 0.02}s` }}>
                                                <td style={{ fontWeight: 700 }}>{record.compliance_id}</td>
                                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{record.product_name}</td>
                                                <td>{record.standard_name}</td>
                                                <td>{statusBadge(record.compliance_status)}</td>
                                                <td><span style={{ fontWeight: 700, color: record.violation_count > 0 ? 'var(--danger)' : 'var(--success)' }}>{record.violation_count}</span></td>
                                                <td>{record.checked_date?.split('T')[0]}</td>
                                                {(perms.update || perms.delete) && <td>
                                                    {perms.update && <button className="table-action-btn" onClick={() => handleEdit(record)}>E</button>}
                                                    {perms.delete && <button className="table-action-btn danger" onClick={() => handleDelete(record.compliance_id)}>D</button>}
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
                            <div className="form-group"><label className="form-label">Compliance ID</label><input className="form-input" type="text" disabled value={editing ? formData.compliance_id : 'Auto-generated'} readOnly /></div>
                            <div className="form-group"><label className="form-label">Checked Date</label><input className="form-input" type="date" required value={formData.checked_date} onChange={(e) => setFormData({ ...formData, checked_date: e.target.value })} /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Batch</label><select className="form-select" required value={`${formData.product_id}-${formData.batch_id}`} onChange={(e) => { const [productId, batchId] = e.target.value.split('-'); setFormData({ ...formData, product_id: productId, batch_id: batchId }); }}><option value="">Select</option>{batches.map((batch) => <option key={`${batch.product_id}-${batch.batch_id}`} value={`${batch.product_id}-${batch.batch_id}`}>{batch.product_name} - Batch {batch.batch_id}</option>)}</select></div>
                        <div className="form-group"><label className="form-label">Standard</label><select className="form-select" required value={formData.standard_id} onChange={(e) => setFormData({ ...formData, standard_id: e.target.value })}><option value="">Select</option>{standards.map((standard) => <option key={standard.standard_id} value={standard.standard_id}>{standard.standard_name}</option>)}</select></div>
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
