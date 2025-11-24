import { createContext, useContext, useEffect, useState } from "react";
import { auth } from '../FireBase'
import { onAuthStateChanged, signOut } from "firebase/auth";

const authContext = createContext();

function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsLoggedIn(!!user); // true if user exists, false otherwise
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    async function logout() {
        try {
            await signOut(auth);
            setCurrentUser(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    return (
        <authContext.Provider value={{ currentUser, isLoggedIn, logout, loading }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}

export default AuthProvider;