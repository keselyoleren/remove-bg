import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    signInWithRedirect,
    signOut,
    onAuthStateChanged,
    getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const redirectCheckRef = React.useRef(false);

    useEffect(() => {
        let redirectCheckComplete = false;

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setLoading(false);
            } else if (redirectCheckComplete) {
                setLoading(false);
            }
        });

        if (!redirectCheckRef.current) {
            redirectCheckRef.current = true;
            getRedirectResult(auth)
                .then((result) => {
                    redirectCheckComplete = true;
                    // If result exists, user is logged in. onAuthStateChanged will handle it.
                    // If result is null and no current user, we are not logged in.
                    if (!result && !auth.currentUser) {
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.error("Redirect auth error:", error);
                    redirectCheckComplete = true;
                    setLoading(false);
                });
        }

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    };

    const signInWithGoogleRedirect = async () => {
        try {
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error('Error signing in with Google Redirect:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithGoogleRedirect, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
