import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [registrations, setRegistrations] = useState([]);
    const [stats, setStats] = useState({
        eventsJoined: 0,
        houseRank: '-',
        points: 0
    });

    useEffect(() => {
        // Fetch registrations
        // This would normally call an API like /api/registrations/user/:id
        // For now, we show a welcome message and basic role info
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/auth';
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar glass-panel">
                <div className="user-profile">
                    <div className="avatar">{user?.name?.charAt(0)}</div>
                    <h3>{user?.name}</h3>
                    <p className="role-badge">{user?.role?.replace('_', ' ')}</p>
                </div>
                <nav className="side-nav">
                    <a href="#overview" className="active">Overview</a>
                    <a href="#events">My Events</a>
                    <a href="#results">Results</a>
                    {user?.role === 'admin' && <a href="#admin">Admin Panel</a>}
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </nav>
            </aside>

            <main className="main-content">
                <header className="dash-header">
                    <h2>Welcome to DMI Fest Portal</h2>
                    <div className="date-display">{new Date().toDateString()}</div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card glass-panel">
                        <h4>Events Joined</h4>
                        <div className="stat-value">{stats.eventsJoined}</div>
                    </div>
                    <div className="stat-card glass-panel">
                        <h4>House Rank</h4>
                        <div className="stat-value">{stats.houseRank}</div>
                    </div>
                    <div className="stat-card glass-panel">
                        <h4>Total Points</h4>
                        <div className="stat-value">{stats.points}</div>
                    </div>
                </div>

                <div className="content-section glass-panel">
                    <h3>Recent Announcements</h3>
                    <div className="announcement-list">
                        <p className="empty-msg">No new announcements at the moment.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
