import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialType = searchParams.get('type') || 'sports';

    const [houses, setHouses] = useState([]);
    const [regType, setRegType] = useState(initialType); // sports, cultural, food
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        reg_no: '',
        dept: '',
        year: 'I',
        house_id: '',
        phone: '',
        event_name: ''
    });

    const sportsEvents = ['100m Race', '200m Race', 'Relay', 'Long Jump', 'Shot Put', 'Cricket', 'Volleyball', 'Football', 'Badminton'];
    const culturalEvents = ['Dance (Solo)', 'Dance (Group)', 'Singing (Solo)', 'Singing (Group)', 'Drama', 'Mime', 'Instrumental', 'Photography', 'Art/Painting'];
    const foodEvents = ['Fireless Cooking', 'Dessert Making', 'Traditional Food', 'Fruit Carving', 'Street Food Challenge'];

    const getEvents = () => {
        if (regType === 'sports') return sportsEvents;
        if (regType === 'cultural') return culturalEvents;
        return foodEvents;
    };

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
                const res = await axios.get(`${apiUrl}/api/houses`);
                if (Array.isArray(res.data)) {
                    setHouses(res.data);
                } else {
                    console.error('Invalid houses data format');
                }
            } catch (err) {
                console.error('Error fetching houses:', err);
            }
        };
        fetchHouses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [isSuccess, setIsSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = { ...formData, reg_type: regType };
            if (regType === 'cultural' || regType === 'food') {
                delete dataToSubmit.house_id;
            }

            const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
            const res = await axios.post(`${apiUrl}/api/auth/register`, dataToSubmit);
            setSuccessMsg(res.data.message);
            setIsSuccess(true);
            // Reset only event related fields
            setFormData(prev => ({ ...prev, event_name: '' }));
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response) {
                alert(err.response.data?.message || 'Registration failed');
            } else if (err.request) {
                alert('Connection to server failed. Please ensure the backend is running and accessible.');
            } else {
                alert('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <Link to="/" className="auth-close-btn">&times;</Link>
                <h2>Event Registration</h2>
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Choose a category and register. You can register for multiple events!</p>

                <div className="reg-type-toggle">
                    <button className={regType === 'sports' ? 'active' : ''} onClick={() => { setRegType('sports'); setIsSuccess(false); }}>🏆 Sports</button>
                    <button className={regType === 'cultural' ? 'active' : ''} onClick={() => { setRegType('cultural'); setIsSuccess(false); }}>🎭 Cultural</button>
                    <button className={regType === 'food' ? 'active' : ''} onClick={() => { setRegType('food'); setIsSuccess(false); }}>🥘 Food Fest</button>
                </div>

                {isSuccess ? (
                    <div className="success-view" style={{ textAlign: 'center', padding: '30px 0' }}>
                        <div className="success-icon" style={{
                            fontSize: '4rem', color: 'var(--accent-2)', marginBottom: '15px',
                            background: 'rgba(0, 240, 255, 0.1)', width: '80px', height: '80px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '50%', margin: '0 auto 15px'
                        }}>✓</div>
                        <h3 style={{ color: '#fff', marginBottom: '10px' }}>Registered Successfully!</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', fontSize: '0.95rem' }}>{successMsg}</p>
                        <button className="auth-btn" onClick={() => setIsSuccess(false)}>
                            Register for Another Event
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Register No</label>
                                <input type="text" name="reg_no" value={formData.reg_no} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <select name="dept" value={formData.dept} onChange={handleChange} required>
                                    <option value="">Select Dept</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="MECH">MECH</option>
                                    <option value="CIVIL">CIVIL</option>
                                    <option value="IT">IT</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Select Event</label>
                                <select name="event_name" value={formData.event_name} onChange={handleChange} required>
                                    <option value="">Choose Event</option>
                                    {getEvents().map(ev => (
                                        <option key={ev} value={ev}>{ev}</option>
                                    ))}
                                </select>
                            </div>
                            {regType === 'sports' ? (
                                <div className="form-group">
                                    <label>House</label>
                                    <select name="house_id" value={formData.house_id} onChange={handleChange} required>
                                        <option value="">Select House</option>
                                        {houses.map(h => (
                                            <option key={h.id} value={h.id}>{h.name}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Year</label>
                                    <select name="year" value={formData.year} onChange={handleChange}>
                                        <option value="I">I Year</option>
                                        <option value="II">II Year</option>
                                        <option value="III">III Year</option>
                                        <option value="IV">IV Year</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="form-row">
                            {regType === 'sports' && (
                                <div className="form-group">
                                    <label>Year</label>
                                    <select name="year" value={formData.year} onChange={handleChange}>
                                        <option value="I">I Year</option>
                                        <option value="II">II Year</option>
                                        <option value="III">III Year</option>
                                        <option value="IV">IV Year</option>
                                    </select>
                                </div>
                            )}
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>

                        <button type="submit" className="auth-btn">
                            Register for {formData.event_name || 'Event'}
                        </button>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <a href="/admin-login" style={{ color: 'var(--accent-2)', fontSize: '0.8rem', textDecoration: 'none' }}>Coordinator Login</a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Auth;
