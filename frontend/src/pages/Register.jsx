import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const Register = ({ onLogin }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [aadhaar, setAadhaar] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '', // Added name field
        phone: '',
        password: '',
        role: 'worker',
        skills: '',
        address: '' // Added address field
    });

    const handleVerifyAadhaar = () => {
        if (aadhaar.length !== 12) {
            setError("Aadhaar must be 12 digits");
            return;
        }
        setStep(2);
        setError('');
    };

    const handleVerifyOtp = () => {
        if (otp !== '1234') {
            setError("Invalid OTP (Use 1234)");
            return;
        }
        if (aadhaar.startsWith('2')) {
            setError("Gender verification failed: Not Female (Simulated)");
            return;
        }
        // Pre-fill mock data but allow editing
        setFormData(prev => ({
            ...prev,
            name: "Verified User",
            address: "123, Shakti Nagar, Hyderabad"
        }));
        setStep(3);
        setError('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                aadhaar,
                skills: formData.skills.split(',').map(s => s.trim())
            };

            const res = await axios.post('http://localhost:5000/api/auth/register', payload);
            if (res.data.success) {
                onLogin(res.data.user);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Failed');
        }
    };

    // Demo Helpers
    const fillDemo = () => {
        setAadhaar('111122223333');
    }

    return (
        <div className="center-page">
            <motion.div
                className="glass-panel"
                style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative' }}
            >
                <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 20, left: 20, background: 'none' }}><ArrowLeft /></button>
                <h2 style={{ fontSize: '2rem', marginBottom: 5 }}>{t('register')}</h2>
                <p style={{ color: 'green', fontSize: '0.9rem', marginBottom: 20 }}>{t('security_check')}</p>

                {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

                <AnimatePresence mode='wait'>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{ marginBottom: 20, textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{t('aadhaar')}</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    value={aadhaar}
                                    onChange={(e) => setAadhaar(e.target.value)}
                                    placeholder="111122223333"
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                                    <small style={{ color: 'var(--text-light)' }}>Starts with '1' for Female</small>
                                    <button onClick={fillDemo} style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'none' }}>Demo: Fill</button>
                                </div>
                            </div>
                            <button onClick={handleVerifyAadhaar} className="primary-btn" style={{ width: '100%' }}>{t('verify')}</button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{ marginBottom: 20, textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{t('enter_otp')}</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="1234"
                                />
                                <small style={{ display: 'block', marginTop: 5, color: 'var(--text-light)' }}>Demo OTP: 1234</small>
                            </div>
                            <button onClick={handleVerifyOtp} className="primary-btn" style={{ width: '100%' }}>{t('verify')}</button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.form
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleRegister}
                            style={{ display: 'flex', flexDirection: 'column', gap: 15, textAlign: 'left' }}
                        >
                            <div style={{ background: '#e8f5e9', padding: 10, borderRadius: 8, fontSize: '0.85rem', color: '#2e7d32' }}>
                                Scan Verified! You can now update your details.
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>Full Name</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>Address</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>{t('phone')}</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder={t('phone')}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>Password</label>
                                <input
                                    className="input-field"
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>I want to:</label>
                                <select
                                    className="input-field"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="worker">{t('take_work')}</option>
                                    <option value="customer">{t('give_work')}</option>
                                </select>
                            </div>
                            {formData.role === 'worker' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>Skills</label>
                                    <input
                                        className="input-field"
                                        type="text"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        placeholder="e.g. Tailoring, Cooking"
                                    />
                                </div>
                            )}
                            <button type="submit" className="primary-btn" style={{ marginTop: 10 }}>{t('register')}</button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Register;
