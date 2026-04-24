import React from 'react';
import ThemeToggle from './ThemeToggle';

const Landing = ({ onNavigateToLogin, theme, onToggleTheme }) => {
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="landing-logo">
                    <div className="landing-logo-icon">SB</div>
                    <div className="landing-logo-text">Safe<span>Bite</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <ThemeToggle theme={theme} onToggle={onToggleTheme} iconOnly />
                    <button className="landing-nav-btn" onClick={onNavigateToLogin}>Get Started</button>
                </div>
            </nav>

            <main className="landing-hero">
                <div className="landing-hero-content">
                    <div className="landing-badge">
                        <div className="landing-badge-dot"></div>
                        Food Safety Compliance System
                    </div>

                    <h1 className="landing-title">
                        Ensuring Global <br />
                        <span className="landing-title-highlight">Food Quality & Safety</span>
                    </h1>

                    <p className="landing-subtitle">
                        Enterprise-grade inspection and compliance management. Monitor manufacturers, track product lifecycles, and enforce critical safety standards with confidence.
                    </p>

                    <div className="landing-cta-group">
                        <button className="landing-cta-primary" onClick={onNavigateToLogin}>
                            View Dashboard
                        </button>
                    </div>

                    <div id="platform-stats" className="landing-stats">
                        <div className="landing-stat">
                            <div className="landing-stat-number">15+</div>
                            <div className="landing-stat-label">Manufacturers</div>
                        </div>
                        <div className="landing-stat">
                            <div className="landing-stat-number">50+</div>
                            <div className="landing-stat-label">Products</div>
                        </div>
                        <div className="landing-stat">
                            <div className="landing-stat-number">100k</div>
                            <div className="landing-stat-label">Inspections</div>
                        </div>
                        <div className="landing-stat">
                            <div className="landing-stat-number">99%</div>
                            <div className="landing-stat-label">Compliance Rate</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
