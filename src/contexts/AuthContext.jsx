import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login() {
        // Try popup first, but we might want to switch to redirect if popup fails consistently
        return signInWithPopup(auth, googleProvider);
    }

    async function loginWithRedirect() {
        return signInWithRedirect(auth, googleProvider);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Handle redirect result
        getRedirectResult(auth).catch((error) => {
            console.error("Redirect auth error:", error);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        // loginWithRedirect,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
