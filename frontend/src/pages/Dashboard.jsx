import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { User, MapPin, Briefcase, PlusCircle, LogOut, Shield, Heart, Info, Phone, Scissors, Utensils, Monitor, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ user, onLogout }) => {
    const { t } = useTranslation();

    return (
        <div className="dashboard-container">
            {/* Navbar with Shakthi Logo */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel"
                style={{ padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'sticky', top: 20, zIndex: 100 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    {/* Logo with Multiply Blend to handle white background */}
                    <img src="/logo.png" alt="Logo" style={{ width: 45, height: 45, objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(90deg, #D44286, #FF9966)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Feminine Shakthi</h2>
                </div>
                <button onClick={onLogout} style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LogOut size={18} color="var(--text)" />
                </button>
            </motion.nav>

            {/* Hero / User Section (STATIC INFO - Glass Panel) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 30 }}>
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel"
                    style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}
                >
                    <img src={user.profile_pic} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid white', boxShadow: 'var(--glass-shadow)' }} />
                    <div>
                        <div className="role-badge" style={{ display: 'inline-block', marginBottom: '8px' }}>
                            {user.role === 'customer' ? t('role_customer') : t('role_worker')}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text)' }}>{user.name}</h3>
                        <p style={{ margin: '5px 0', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <MapPin size={16} color="var(--primary)" /> {user.address || t('loc_not_set')}
                        </p>
                    </div>
                </motion.div>

                {/* Quote / Motivator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel"
                    style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.5)' }}
                >
                    <h3 style={{ fontSize: '1.2rem', marginBottom: 10, color: 'var(--primary)' }}>{t('empowering_you')}</h3>
                    <p style={{ fontStyle: 'italic', margin: 0, color: 'var(--text-light)' }}>"{t('quote')}"</p>
                    <div style={{ marginTop: 15, width: '50px', height: '4px', background: 'var(--accent)', borderRadius: 2 }}></div>
                </motion.div>
            </div>

            <h3 style={{ marginBottom: 20, paddingLeft: 10, borderLeft: '4px solid var(--primary)', fontSize: '1.4rem' }}>{t('quick_actions')}</h3>

            {/* Primary Actions (INTERACTIVE - Action Cards with Gradients) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: 40 }}>
                {user.role === 'customer' ? (
                    <>
                        <Link to="/create-task" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="action-card"
                                style={{
                                    background: 'linear-gradient(135deg, #FF512F, #DD2476)', // Strong Pink-Red Gradient
                                    padding: 30, height: '100%'
                                }}
                            >
                                <div style={{ background: 'rgba(255,255,255,0.2)', width: 60, height: 60, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                    <PlusCircle size={32} color="white" />
                                </div>
                                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: 10 }}>{t('create_task')}</h3>
                                <p style={{ opacity: 0.9, fontSize: '1rem', lineHeight: '1.5' }}>{t('create_task_desc')}</p>
                            </motion.div>
                        </Link>
                        <Link to="/tasks?role=customer" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="action-card"
                                style={{
                                    background: 'linear-gradient(135deg, #1A2980, #26D0CE)', // Blue-Teal Gradient
                                    padding: 30, height: '100%'
                                }}
                            >
                                <div style={{ background: 'rgba(255,255,255,0.2)', width: 60, height: 60, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                    <Briefcase size={32} color="white" />
                                </div>
                                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: 10 }}>{t('my_posted_tasks')}</h3>
                                <p style={{ opacity: 0.9, fontSize: '1rem', lineHeight: '1.5' }}>{t('my_posted_tasks_desc')}</p>
                            </motion.div>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/tasks" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="action-card"
                                style={{
                                    background: 'linear-gradient(135deg, #8E2DE2, #4A00E0)', // Purple Gradient
                                    padding: 30, height: '100%'
                                }}
                            >
                                <Briefcase size={40} style={{ marginBottom: 20, opacity: 0.9 }} />
                                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: 10 }}>{t('find_work')}</h3>
                                <p style={{ opacity: 0.9, fontSize: '1rem', lineHeight: '1.5' }}>{t('find_work_desc')} {user.skills.join(', ')}</p>
                            </motion.div>
                        </Link>
                        <Link to="/tasks?role=worker" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="action-card"
                                style={{
                                    background: 'linear-gradient(135deg, #FF512F, #DD2476)', // Pink-Red Gradient
                                    padding: 30, height: '100%'
                                }}
                            >
                                <Briefcase size={40} style={{ marginBottom: 20, opacity: 0.9 }} />
                                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: 10 }}>{t('my_accepted_tasks')}</h3>
                                <p style={{ opacity: 0.9, fontSize: '1rem', lineHeight: '1.5' }}>{t('my_accepted_tasks_desc')}</p>
                            </motion.div>
                        </Link>
                    </>
                )}
            </div>

            {/* Categories Section (INTERACTIVE - Smaller Grid Cards) */}
            {/* Added marginTop: 60 to fix overlap */}
            <h3 style={{ marginBottom: 20, marginTop: 60, paddingLeft: 10, borderLeft: '4px solid var(--accent)', fontSize: '1.4rem' }}>{t('browse_categories')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
                {[
                    { icon: Scissors, label: "tailoring", color: "#FF9966", bg: "linear-gradient(135deg, #fff, #ffeadd)" },
                    { icon: Utensils, label: "cooking", color: "#FF5E62", bg: "linear-gradient(135deg, #fff, #ffddde)" },
                    { icon: Monitor, label: "online", color: "#8E44AD", bg: "linear-gradient(135deg, #fff, #e9dff5)" },
                    { icon: PenTool, label: "crafts", color: "#D44286", bg: "linear-gradient(135deg, #fff, #f5dce9)" }
                ].map((cat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                        className="glass-panel"
                        style={{
                            padding: 20, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                            background: cat.bg, border: 'none'
                        }}
                    >
                        <div style={{ background: 'white', padding: 15, borderRadius: '50%', marginBottom: 15, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                            <cat.icon size={24} color={cat.color} />
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{t(cat.label)}</span>
                    </motion.div>
                ))}
            </div>

            {/* Safety & Community Section (STATIC) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: 40 }}>
                <motion.div className="glass-panel" style={{ padding: 25, background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.2rem', color: '#006064' }}>
                        <Shield size={20} color="#00bcd4" /> {t('safety_guidelines')}
                    </h4>
                    <ul style={{ paddingLeft: 20, color: '#455a64', lineHeight: '1.6' }}>
                        <li>{t('safety_1')}</li>
                        <li>{t('safety_2')}</li>
                        <li>{t('safety_3')}</li>
                    </ul>
                </motion.div>

                <motion.div className="glass-panel" style={{ padding: 25, background: 'linear-gradient(135deg, #fce4ec 0%, #fff 100%)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.2rem', color: '#c2185b' }}>
                        <Heart size={20} color="#e91e63" /> {t('success_stories')}
                    </h4>
                    <div style={{ marginTop: 15 }}>
                        <p style={{ color: '#880e4f', marginBottom: 10 }}>"{t('testimonial_text')}" - <strong>{t('testimonial_author')}</strong></p>
                        <div style={{ background: 'rgba(255,255,255,0.8)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #f06292, #e91e63)' }}></div>
                        </div>
                        <small style={{ display: 'block', marginTop: 5, textAlign: 'right', color: '#c2185b' }}>{t('top_rated_worker')}</small>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 20, textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Info size={14} /> {t('about_us')}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Shield size={14} /> {t('privacy_policy')}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={14} /> {t('contact_support')}</span>
                </div>
                <p>© 2025 Feminine Shakthi. Built for Hackathon.</p>
            </footer>

        </div>
    );
};

export default Dashboard;
