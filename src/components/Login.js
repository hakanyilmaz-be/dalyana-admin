// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, setPersistence, browserSessionPersistence } from 'firebase/auth';
import './Login.css'; // CSS dosyasını import edin
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Şifre gösterme durumu
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await setPersistence(auth, browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Başarılı girişten sonra yönlendirme
        } catch (error) {
            console.error('Login failed', error);
            // Hata durumunda bir hata mesajı gösterin
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await setPersistence(auth, browserSessionPersistence);
            await signInWithPopup(auth, googleProvider);
            navigate('/'); // Başarılı girişten sonra yönlendirme
        } catch (error) {
            console.error('Google login failed', error);
            // Hata durumunda bir hata mesajı gösterin
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
      <div className="login-page">
        <div className="login-left">{/* Sol taraf görseli */}</div>
        <div className="login-right">
          <div className="login-form-container">
            <h2>
              Bienvenue
              <br />
              à Dalyana Home
            </h2>
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label>E-mail</label>
                <div className="input-icon">
                  <FaEnvelope className="icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrer votre Email"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Mot de passe</label>
                <div className="input-icon">
                  <FaLock className="icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrer votre mot de passe"
                    required
                  />
                  <span onClick={toggleShowPassword} className="password-icon">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="login-options">
                <a href="/reset-password">Mot de passe oublié?</a>
              </div>
              <button type="submit" className="login-button">
                Connexion
              </button>
              <div className="divider">Ou</div>
              <button
                type="button"
                className="google-login-button"
                onClick={handleGoogleLogin}
              >
                <img
                  src="https://img.icons8.com/color/16/000000/google-logo.png"
                  alt="Google logo"
                />{" "}
                Se connecter avec Google
              </button>
            </form>
          </div>
        </div>
      </div>
    );
};

export default Login;
