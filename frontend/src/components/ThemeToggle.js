import React from 'react';

const ThemeToggle = ({ theme, onToggle, compact = false, iconOnly = false }) => {
    const isDark = theme === 'dark' || theme === 'blue';

    if (iconOnly) {
        return (
            <button
                type="button"
                className={`theme-toggle-icon ${isDark ? 'is-dark' : 'is-light'}`}
                onClick={onToggle}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
                <span className="theme-toggle-icon-core"></span>
            </button>
        );
    }

    return (
        <button
            type="button"
            className={`theme-toggle ${compact ? 'theme-toggle-compact' : ''}`}
            onClick={onToggle}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <span className="theme-toggle-track">
                <span className={`theme-toggle-option ${!isDark ? 'active' : ''}`}>Light</span>
                <span className={`theme-toggle-option ${isDark ? 'active' : ''}`}>Dark</span>
                <span className={`theme-toggle-thumb ${isDark ? 'is-dark' : ''}`}></span>
            </span>
        </button>
    );
};

export default ThemeToggle;
