import React, { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './ResetPassword.css'; // CSS dosyasını import edin

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent!');
            setError('');
        } catch (error) {
            setError('Failed to send password reset email.');
            setMessage('');
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div className="reset-password-container">
            <form onSubmit={handleResetPassword} className="reset-password-form">
                <h3>Réinitialiser le mot de passe</h3>
                {message && <p className="message">{message}</p>}
                {error && <p className="error">{error}</p>}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                    required
                    className="reset-password-input"
                />
                <button type="submit" className="reset-password-button">Envoyer l'email de réinitialisation</button>
            </form>
        </div>
    );
};

export default ResetPassword;
