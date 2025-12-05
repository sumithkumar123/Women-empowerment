import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const LanguageSelect = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const handleLanguageSelect = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        navigate('/login');
    };

    return (
        <div className="center-page">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', marginBottom: 40 }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    {/* New Transparent Logo */}
                    <img src="/logo.png" alt="Feminine Shakthi" style={{ width: 120, height: 120, objectFit: 'contain' }} />
                </div>
                <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', background: 'linear-gradient(90deg, #D44286, #FF9966)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Feminine Shakthi</h1>
                <p style={{ color: 'var(--text)', fontSize: '1.2rem', maxWidth: 400, margin: '0 0 20px 0', opacity: 0.8 }}>
                    Empowering women through secure, verified service connections.
                </p>
                <p style={{ color: 'var(--text-light)', fontSize: '1rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{t('choose_language')}</p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '15px',
                    width: '100%',
                    maxWidth: '500px'
                }}
            >
                {languages.map((lang) => (
                    <motion.button
                        key={lang.code}
                        variants={item}
                        whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.95)' }}
                        whileTap={{ scale: 0.95 }}
                        className="glass-panel"
                        style={{
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.7)',
                            border: '1px solid rgba(255,255,255,0.8)'
                        }}
                        onClick={() => handleLanguageSelect(lang.code)}
                    >
                        <span style={{ fontSize: '1.4rem', marginBottom: '5px', color: 'var(--primary)' }}>{lang.native}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500 }}>{lang.name}</span>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

export default LanguageSelect;
