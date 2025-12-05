import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            if (res.data.success) {
                onLogin(res.data.user);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div className="center-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}
            >
                <div style={{ marginBottom: 30 }}>
                    <h2 style={{ fontSize: '2rem' }}>{t('login')}</h2>
                    <p style={{ color: 'var(--text-light)' }}>Welcome back, Sister</p>
                </div>

                {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <input
                            className="input-field"
                            type="text"
                            name="phone"
                            placeholder={t('phone')}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="input-field"
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="primary-btn" style={{ marginTop: '10px' }}>{t('login')}</button>
                </form>

                <div style={{ marginTop: '30px' }}>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Don't have an account?</p>
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                        {t('register')} Now
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
