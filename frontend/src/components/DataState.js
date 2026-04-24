import React from 'react';

export const LoadingState = ({ label = 'Loading...' }) => (
    <div className="table-feedback-state">{label}</div>
);

export const ErrorState = ({ message = 'Something went wrong while loading data.' }) => (
    <div className="table-feedback-state error">{message}</div>
);

export const EmptyState = ({ icon, title, description }) => (
    <div className="empty-state">
        <div className="empty-state-icon">{icon}</div>
        <div className="empty-state-title">{title}</div>
        {description ? <div className="empty-state-desc">{description}</div> : null}
    </div>
);
