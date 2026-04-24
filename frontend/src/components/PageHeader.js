import React from 'react';

const PageHeader = ({ title, subtitle, actions, badge }) => (
    <div className="main-header">
        <div className="main-header-row">
            <div>
                <div className="main-header-title-row">
                    <div className="main-header-title">{title}</div>
                    {badge}
                </div>
                {subtitle && <div className="main-header-subtitle">{subtitle}</div>}
            </div>
            {actions ? <div className="main-header-actions">{actions}</div> : null}
        </div>
    </div>
);

export default PageHeader;
