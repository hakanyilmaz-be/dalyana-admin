import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                setUserRole(userDoc.data().role);
                setUserName(userDoc.data().name); // Firestore'dan kullanıcı adını alın
                setUserImageUrl(userDoc.data().imageUrl); // Firestore'dan kullanıcı resim URL'sini alın
            } else {
                setUserRole(null);
                setUserName(null);
                setUserImageUrl(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, userRole, userName, userImageUrl }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
