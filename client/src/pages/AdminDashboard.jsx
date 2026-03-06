import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Reuse dashboard styles

const AdminDashboard = () => {
    const [students, setStudents] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [settings, setSettings] = useState({});
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, sports, cultural, food, gallery, content

    const fetchData = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
            if (filter === 'gallery') {
                const res = await axios.get(`${apiUrl}/api/gallery`);
                setGallery(res.data);
            } else if (filter === 'content') {
                const resSet = await axios.get(`${apiUrl}/api/settings`);
                const resAnn = await axios.get(`${apiUrl}/api/announcements`);
                setSettings(resSet.data);
                setAnnouncements(resAnn.data);
            } else {
                const res = await axios.get(`${apiUrl}/api/admin/students`);
                setStudents(res.data);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    const [newPhoto, setNewPhoto] = useState({ image_url: '', category: 'sports' });
    const [newAnn, setNewAnn] = useState({ title: '', content: '' });

    const handleSettingUpdate = async (key, value) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
            await axios.post(`${apiUrl}/api/admin/settings`, { key, value });
            fetchData();
        } catch (err) { alert('Update failed'); }
    };

    const handleAddAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
            await axios.post(`${apiUrl}/api/admin/announcements`, newAnn);
            setNewAnn({ title: '', content: '' });
            fetchData();
        } catch (err) { alert('Failed to add news'); }
    };

    const handleDeleteAnn = async (id) => {
        if (window.confirm('Delete this news?')) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
                await axios.delete(`${apiUrl}/api/admin/announcements/${id}`);
                fetchData();
            } catch (err) { alert('Delete failed'); }
        }
    };

    const handleAddPhoto = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
            await axios.post(`${apiUrl}/api/admin/gallery/add`, newPhoto);
            alert('New photo added!');
            setNewPhoto({ image_url: '', category: 'sports' });
            fetchData();
        } catch (err) {
            alert('Failed to add photo');
        }
    };

    const handleGalleryUpdate = async (id, newUrl) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
            await axios.post(`${apiUrl}/api/admin/gallery/${id}`, { image_url: newUrl });
            alert('Image updated successfully!');
            fetchData(); // Refresh
        } catch (err) {
            alert('Update failed');
        }
    };

    const filteredData = filter === 'all'
        ? students
        : students.filter(s => s.reg_type === filter);

    const handleDeleteRegistration = async (id) => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
                await axios.delete(`${apiUrl}/api/admin/registrations/${id}`);
                fetchData();
            } catch (err) {
                alert('Failed to delete registration');
            }
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar glass-panel">
                <div className="user-profile">
                    <div className="avatar">A</div>
                    <h3>Admin Panel</h3>
                    <p className="role-badge">Super Admin</p>
                </div>
                <nav className="side-nav">
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Registrations</button>
                    <button className={filter === 'sports' ? 'active' : ''} onClick={() => setFilter('sports')}>🏆 Sports Day</button>
                    <button className={filter === 'cultural' ? 'active' : ''} onClick={() => setFilter('cultural')}>🎭 Cultural Fest</button>
                    <button className={filter === 'food' ? 'active' : ''} onClick={() => setFilter('food')}>🥘 Food Fest</button>
                    <button className={filter === 'gallery' ? 'active' : ''} onClick={() => setFilter('gallery')}>🖼️ Manage Gallery</button>
                    <button className={filter === 'content' ? 'active' : ''} onClick={() => setFilter('content')}>📝 Manage Content</button>

                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'block', padding: '10px' }}>Back to Website</Link>
                        <button
                            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', textAlign: 'left', padding: '10px', fontSize: '0.9rem', width: '100%' }}
                        >
                            Sign Out
                        </button>
                    </div>
                </nav>
            </aside>

            <main className="main-content">
                <header className="dash-header">
                    <h2 style={{ textTransform: 'capitalize' }}>
                        {filter === 'gallery' ? 'Gallery Management' : (filter === 'content' ? 'Site Content' : (filter === 'all' ? 'All' : filter) + ' Registrations')}
                    </h2>
                    <div className="date-display">
                        Total: {filter === 'gallery' ? gallery.length : (filter === 'content' ? announcements.length + ' news' : filteredData.length)}
                    </div>
                </header>

                <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : filter === 'content' ? (
                        <div className="content-manager">
                            <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                    <h3>📍 General Info</h3>
                                    <div className="form-group" style={{ marginTop: '15px' }}>
                                        <label style={{ fontSize: '0.8rem' }}>College Name</label>
                                        <input type="text" defaultValue={settings.college_name} onBlur={(e) => handleSettingUpdate('college_name', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.8rem' }}>Event Title</label>
                                        <input type="text" defaultValue={settings.event_title} onBlur={(e) => handleSettingUpdate('event_title', e.target.value)} />
                                    </div>
                                </div>
                                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                    <h3>📊 Statistics</h3>
                                    <div className="form-group" style={{ marginTop: '15px' }}>
                                        <label style={{ fontSize: '0.8rem' }}>Mega Events (e.g. 3+)</label>
                                        <input type="text" defaultValue={settings.stats_mega_events} onBlur={(e) => handleSettingUpdate('stats_mega_events', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.8rem' }}>Participants (e.g. 1000+)</label>
                                        <input type="text" defaultValue={settings.stats_participants} onBlur={(e) => handleSettingUpdate('stats_participants', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.8rem' }}>Volunteers (e.g. 50+)</label>
                                        <input type="text" defaultValue={settings.stats_volunteers} onBlur={(e) => handleSettingUpdate('stats_volunteers', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                <h3>📢 News & Announcements</h3>
                                <form onSubmit={handleAddAnnouncement} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '15px', alignItems: 'end', marginTop: '15px' }}>
                                    <input type="text" placeholder="Title" value={newAnn.title} onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })} required />
                                    <input type="text" placeholder="Content/Message" value={newAnn.content} onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })} required />
                                    <button type="submit" className="auth-btn" style={{ padding: '10px' }}>Add News</button>
                                </form>

                                <div style={{ marginTop: '20px' }}>
                                    {announcements.map((ann) => (
                                        <div key={ann.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <strong style={{ color: 'var(--accent-2)' }}>{ann.title}</strong>
                                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{ann.content}</p>
                                            </div>
                                            <button onClick={() => handleDeleteAnn(ann.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : filter === 'gallery' ? (
                        <div className="gallery-manager">
                            <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px', background: 'rgba(255,255,255,0.03)' }}>
                                <h3 style={{ marginBottom: '15px' }}>➕ Add New Photo</h3>
                                <form onSubmit={handleAddPhoto} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.8rem' }}>Image URL</label>
                                        <input
                                            type="text"
                                            value={newPhoto.image_url}
                                            onChange={(e) => setNewPhoto({ ...newPhoto, image_url: e.target.value })}
                                            placeholder="Paste URL (e.g. /src/assets/photo.png or https://...)"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.8rem' }}>Category</label>
                                        <select
                                            value={newPhoto.category}
                                            onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                                            style={{ padding: '10px' }}
                                        >
                                            <option value="sports">Sports</option>
                                            <option value="food">Food Fest</option>
                                            <option value="cultural">Cultural</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="auth-btn" style={{ padding: '10px 25px' }}>Add Photo</button>
                                </form>
                            </div>

                            <p style={{ marginBottom: '20px', opacity: 0.7 }}>Existing Photos (Manage Below):</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {gallery.map((item) => (
                                    <div key={item.id} className="glass-panel" style={{ padding: '15px' }}>
                                        <div style={{ height: '140px', background: '#000', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}>
                                            <img src={item.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.75rem', marginBottom: '5px', display: 'block' }}>URL ({item.category})</label>
                                            <input
                                                type="text"
                                                defaultValue={item.image_url}
                                                onBlur={(e) => handleGalleryUpdate(item.id, e.target.value)}
                                                placeholder="Paste URL..."
                                                style={{ fontSize: '0.8rem', padding: '8px' }}
                                            />
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Delete this photo?')) {
                                                    try {
                                                        const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
                                                        await axios.delete(`${apiUrl}/api/admin/gallery/${item.id}`);
                                                        fetchData();
                                                    } catch (err) { alert('Delete failed'); }
                                                }
                                            }}
                                            style={{ color: '#ff4d4d', background: 'none', border: 'none', fontSize: '0.75rem', cursor: 'pointer', marginTop: '10px', padding: '0' }}
                                        >
                                            🗑️ Remove Photo
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Reg No</th>
                                    <th>Category</th>
                                    <th>Event</th>
                                    <th>Dept/Year</th>
                                    <th>House</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>{s.reg_no}</td>
                                        <td>
                                            <span className={`cat-tag ${s.reg_type}`}>
                                                {s.reg_type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: '500', color: 'var(--accent-2)' }}>{s.event_name}</td>
                                        <td>{s.dept} - {s.year}</td>
                                        <td>
                                            {s.house_name ? (
                                                <span className={`house-tag ${s.house_name.split(' ')[0].toLowerCase()}`}>
                                                    {s.house_name}
                                                </span>
                                            ) : (
                                                <span className="house-tag none">N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteRegistration(s.id)}
                                                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}
                                                title="Delete Registration"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No registrations found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
