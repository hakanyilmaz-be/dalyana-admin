import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './AdminPanel.css';

const AdminPanel = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Kullanıcı adı için ek alan
    const [showPassword, setShowPassword] = useState(false); // Şifre gösterme durumu
    const [role, setRole] = useState('employee'); // Default role

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                name: name, // Kullanıcı adı alanı ekleniyor
                role: role
            });
            console.log('User added successfully');
            // Reset form fields after successful user addition
            setEmail('');
            setPassword('');
            setName('');
            setRole('employee');
        } catch (error) {
            console.error('Error adding user: ', error);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="admin-panel-container">
            <h2>Panneau d'administration</h2>
            <form onSubmit={handleAddUser} className="admin-panel-form">
                <div className="form-group">
                    <label>Nom</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Saisir le nom de l'utilisateur"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Saisir l'email de l'utilisateur"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe</label>
                    <div className="input-icon">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Saisir un mot de passe"
                            required
                        />
                        <span onClick={toggleShowPassword} className="password-icon">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label>Rôle</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Administrateur</option>
                        <option value="employee">Employé</option>
                    </select>
                </div>
                <button type="submit" className="add-user-button">Ajouter un utilisateur</button>
            </form>
        </div>
    );
};

export default AdminPanel;
