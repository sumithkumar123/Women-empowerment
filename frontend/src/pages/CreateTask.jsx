import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Sun } from 'lucide-react';

const CreateTask = ({ user }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: '',
        category: 'General',
        budget: '',
        delivery_mode: 'Online'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                posted_by: user.phone,
                posted_by_name: user.name,
                address: user.address,
                lat: 17.3850,
                lng: 78.4867
            };

            const res = await axios.post('http://localhost:5000/api/tasks/create', payload);
            if (res.data.success) {
                navigate('/dashboard');
            }
        } catch (err) {
            alert('Failed to post task');
        }
    };

    return (
        <div className="dashboard-container">
            {/* Simple Navbar */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel"
                style={{ padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'sticky', top: 20, zIndex: 100 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'transparent', display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={24} color="var(--primary)" />
                    </button>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>{t('create_task')}</h2>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #FF9966, #FF5E62)', padding: 8, borderRadius: '50%', display: 'flex' }}>
                    <Sun size={20} color="white" />
                </div>
            </motion.nav>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ width: '100%', maxWidth: '700px', padding: '40px', margin: '0 auto' }}
            >

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Category</label>
                        <select
                            className="input-field"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>General</option>
                            <option>Tailoring</option>
                            <option>Food</option>
                            <option>Cleaning</option>
                            <option>Online Work</option>
                            <option>Tuition</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>{t('task_desc')}</label>
                        <textarea
                            className="input-field"
                            rows="5"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the task in detail. Be specific about requirements."
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>{t('budget')} (₹)</label>
                            <input
                                className="input-field"
                                type="number"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                placeholder="e.g. 500"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Delivery Mode</label>
                            <select
                                className="input-field"
                                value={formData.delivery_mode}
                                onChange={(e) => setFormData({ ...formData, delivery_mode: e.target.value })}
                            >
                                <option>Online</option>
                                <option>Pickup</option>
                                <option>Home Service</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: 20, padding: 15, background: 'rgba(255,255,255,0.5)', borderRadius: 12, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        <p style={{ margin: 0 }}><strong>Note:</strong> Your address ({user.address}) will be shared only with the accepted worker.</p>
                    </div>

                    <button type="submit" className="primary-btn" style={{ marginTop: 20 }}>Post Task for Workers</button>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateTask;
