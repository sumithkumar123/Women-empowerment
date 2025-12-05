import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle, MapPin, Clock, ArrowLeft, Filter, Sun, LogOut, Info, Shield, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskList = ({ user, onLogout }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('');

    const isMyTasks = new URLSearchParams(location.search).has('role');
    const roleParam = new URLSearchParams(location.search).get('role');

    useEffect(() => {
        fetchTasks();
    }, [location.search, filter]);

    const fetchTasks = async () => {
        try {
            let url = 'http://localhost:5000/api/tasks/list';
            let params = {};

            if (isMyTasks) {
                url = 'http://localhost:5000/api/tasks/my';
                params = { phone: user.phone, role: roleParam || user.role };
            } else {
                if (filter) params.category = filter;
            }

            const res = await axios.get(url, { params });
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAccept = async (taskId) => {
        try {
            await axios.post('http://localhost:5000/api/tasks/accept', {
                task_id: taskId,
                worker_phone: user.phone,
                worker_name: user.name
            });
            alert("Task Accepted!");
            fetchTasks();
        } catch (err) {
            alert(err.response?.data?.message || "Failed");
        }
    };

    return (
        <div className="dashboard-container">
            {/* Simplified Navbar for Inner Pages */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel"
                style={{ padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'sticky', top: 20, zIndex: 100 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={24} color="var(--primary)" />
                    </button>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)' }}>{isMyTasks ? 'My Tasks' : t('find_work')}</h2>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #FF9966, #FF5E62)', padding: 8, borderRadius: '50%', display: 'flex' }}>
                    <Sun size={20} color="white" />
                </div>
            </motion.nav>

            {!isMyTasks && (
                <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Filter size={18} /> Filter:</span>
                    <select
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 8, fontSize: '1rem', padding: '5px 10px', outline: 'none', minWidth: 150 }}
                    >
                        <option value="">All Categories</option>
                        <option>Tailoring</option>
                        <option>Food</option>
                        <option>Online Work</option>
                        <option>Tuition</option>
                    </select>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', minHeight: '60vh' }}>
                {tasks.length === 0 && (
                    <div className="glass-panel" style={{ padding: 40, textAlign: 'center', gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>No tasks found.</p>
                        {!isMyTasks && <p>Be the first to apply when new jobs appear!</p>}
                    </div>
                )}

                {tasks.map((task, idx) => (
                    <motion.div
                        key={task._id?.$oid || task._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-panel card"
                        style={{ background: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 15 }}>
                            <span className="role-badge" style={{ background: 'var(--accent)', fontSize: '0.7rem' }}>{task.category}</span>
                            <span style={{
                                color: task.status === 'OPEN' ? 'green' : 'orange',
                                fontWeight: 'bold', fontSize: '0.8rem',
                                background: 'rgba(255,255,255,0.5)', padding: '4px 8px', borderRadius: 8
                            }}>
                                {task.status}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', flex: 1 }}>{task.description}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '15px 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>₹ {task.budget}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <MapPin size={14} /> {task.location.address ? task.location.address.split(',')[1] : 'Online'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Clock size={14} /> {new Date(task.created_at?.$date || Date.now()).toLocaleDateString()}
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: 15, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            {user.role === 'worker' && task.status === 'OPEN' && !isMyTasks && (
                                <button
                                    className="primary-btn"
                                    style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}
                                    onClick={() => handleAccept(task._id?.$oid || task._id)}
                                >
                                    Accept Job
                                </button>
                            )}

                            {(task.assigned_to === user.phone || task.posted_by === user.phone) && task.status !== 'OPEN' && (
                                <Link to={`/chat/${task._id?.$oid || task._id}`} style={{ textDecoration: 'none' }}>
                                    <button className="glass-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        <MessageCircle size={18} /> Open Chat
                                    </button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 20, textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem', marginTop: 40 }}>
                <p>© 2025 Feminine Shakthi. Built for Hackathon.</p>
            </footer>
        </div>
    );
};

export default TaskList;
