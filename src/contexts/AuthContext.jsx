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
        return signInWithPopup(auth, googleProvider);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        let redirectCheckComplete = false;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                setLoading(false);
            } else if (redirectCheckComplete) {
                setLoading(false);
            }
        });

        // Handle redirect result
        getRedirectResult(auth)
            .then(() => {
                redirectCheckComplete = true;
                if (!auth.currentUser) {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error("Redirect auth error:", error);
                redirectCheckComplete = true;
                setLoading(false);
            });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
