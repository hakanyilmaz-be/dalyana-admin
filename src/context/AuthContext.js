// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null); // Kullanıcı adını saklamak için state ekleyin
    const [userImageUrl, setUserImageUrl] = useState(null); // Kullanıcı resim URL'sini saklamak için state ekleyin
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        await signOut(auth);
        setCurrentUser(null);
        setUserRole(null);
        setUserName(null);
        setUserImageUrl(null);

        // Clear session storage
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userImageUrl');
        localStorage.removeItem('loginTime');
    }, []);

    const checkSessionValidity = useCallback(() => {
        const loginTime = localStorage.getItem('loginTime');
        if (loginTime) {
            const loginDate = new Date(loginTime);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - loginDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();

            // Oturum süresi 7 günü aştıysa veya saat 00:01 ise oturumu kapat
            if (diffDays >= 7 || (currentHour === 0 && currentMinute === 1)) {
                logout();
            }
        }
    }, [logout]);

    useEffect(() => {
        checkSessionValidity();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                setUserRole(userDoc.data().role);
                setUserName(userDoc.data().name); // Firestore'dan kullanıcı adını alın
                setUserImageUrl(userDoc.data().imageUrl); // Firestore'dan kullanıcı resim URL'sini alın

                // Store user data in session storage
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                sessionStorage.setItem('userRole', userDoc.data().role);
                sessionStorage.setItem('userName', userDoc.data().name);
                sessionStorage.setItem('userImageUrl', userDoc.data().imageUrl);

                // Set login time if not already set
                if (!localStorage.getItem('loginTime')) {
                    localStorage.setItem('loginTime', new Date().toISOString());
                }
            } else {
                setCurrentUser(null);
                setUserRole(null);
                setUserName(null);
                setUserImageUrl(null);

                // Clear session storage
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('userRole');
                sessionStorage.removeItem('userName');
                sessionStorage.removeItem('userImageUrl');
                localStorage.removeItem('loginTime');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [checkSessionValidity]);

    return (
        <AuthContext.Provider value={{ currentUser, userRole, userName, userImageUrl, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

