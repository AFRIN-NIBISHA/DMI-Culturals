import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
            const res = await axios.post(`${apiUrl}/api/auth/login`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.location.href = '/admin-dashboard';
        } catch (err) {
            console.error('Login error:', err);
            if (err.response) {
                alert(err.response.data?.message || 'Login failed');
            } else if (err.request) {
                alert('Connection to server failed. Please ensure the backend is running and accessible.');
            } else {
                alert('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <Link to="/" className="auth-close-btn">&times;</Link>
                <h2>Staff Login</h2>
                <p>Enter your credentials to manage registrations.</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="auth-btn">
                        Login as Admin
                    </button>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link to="/auth" style={{ color: 'var(--accent-2)', fontSize: '0.8rem', textDecoration: 'none' }}>Back to Student Registration</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
