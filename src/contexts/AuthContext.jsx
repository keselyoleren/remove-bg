import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import {
    GoogleAuthProvider,
    signInWithRedirect,
    signOut,
    onAuthStateChanged,
    getRedirectResult,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login() {
        const provider = new GoogleAuthProvider();
        try {
            await setPersistence(auth, browserLocalPersistence);
            return signInWithRedirect(auth, provider);
        } catch (error) {
            console.error("Login setup error:", error);
            throw error;
        }
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        console.log("AuthProvider mounted");
        let isMounted = true;

        const initAuth = async () => {
            try {
                // Check for redirect result first
                const redirectResult = await getRedirectResult(auth);
                if (redirectResult && isMounted) {
                    console.log("Redirect result found:", redirectResult.user.email);
                    setCurrentUser(redirectResult.user);
                }
            } catch (error) {
                console.error("Redirect auth error:", error);
            }
        };

        initAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!isMounted) return;
            console.log("Auth state changed:", user ? `User: ${user.email}` : "No user");
            setCurrentUser(user);
            setLoading(false);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const value = {
        currentUser,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen bg-zinc-950 flex items-center justify-center flex-col gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-zinc-500 text-sm">Verifying authentication...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}
