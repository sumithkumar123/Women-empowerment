import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, ShieldCheck, ArrowLeft, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const Chat = ({ user }) => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [taskId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/chat/${taskId}`);
            setMessages(res.data);
        } catch (err) {
            // silent fail
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('http://localhost:5000/api/chat/send', {
                task_id: taskId,
                sender: user.phone,
                text: newMessage
            });
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            alert("Failed to send");
        }
    };

    return (
        <div className="center-page" style={{ justifyContent: 'flex-start', padding: '20px', height: '100vh', boxSizing: 'border-box' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{
                    width: '100%', maxWidth: '600px', height: '100%',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    padding: 0
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '15px 20px',
                    background: 'rgba(255,255,255,0.8)',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'transparent' }}>
                            <ArrowLeft size={24} color="var(--primary)" />
                        </button>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Secure Chat</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'green' }}>
                                <ShieldCheck size={12} /> Safe Mode On
                            </div>
                        </div>
                    </div>
                    <MoreVertical size={20} color="var(--text-light)" />
                </div>

                {/* Messages */}
                <div className="chat-messages" style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'rgba(255,255,255,0.4)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: '0.75rem', background: '#e0f2f1', color: '#00695c', padding: '4px 12px', borderRadius: 20 }}>
                            🔒 End-to-end Safe. Do not share bank details.
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg, idx) => {
                            const isMine = msg.sender === user.phone;
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                                        maxWidth: '75%'
                                    }}
                                >
                                    <div style={{
                                        background: isMine ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'white',
                                        color: isMine ? 'white' : 'var(--text)',
                                        padding: '12px 16px',
                                        borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.4'
                                    }}>
                                        {msg.text}
                                    </div>
                                    <small style={{ display: 'block', textAlign: isMine ? 'right' : 'left', marginTop: 4, fontSize: '0.7rem', opacity: 0.7 }}>
                                        {new Date(msg.timestamp?.$date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </small>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSend} style={{
                    padding: '15px',
                    background: 'white',
                    borderTop: '1px solid var(--glass-border)',
                    display: 'flex', alignItems: 'center', gap: 10
                }}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={{
                            flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd',
                            background: '#f8f9fa', fontSize: '1rem', outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        style={{
                            width: 45, height: 45, borderRadius: '50%',
                            background: newMessage.trim() ? 'var(--primary)' : '#ccc', 'color': 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </form>

            </motion.div>
        </div>
    );
};

export default Chat;
