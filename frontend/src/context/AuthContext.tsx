// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createApiCaller } from "../utils/apiFactory";

type MeResponse = { user: string };

interface AuthContextType {
    user: string | null;
    setUser: (user: string | null) => void;
    clearUser: () => void;
    authReady: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const res = await createApiCaller<MeResponse>({
                method: "GET",
                url: "/me/",
            })();
            if (!mounted) return;
            if (res.ok) setUser(res.data.user);
            setAuthReady(true);
        })();
        return () => { mounted = false; };
    }, []);

    const clearUser = () => setUser(null);

    const value = useMemo<AuthContextType>(() => ({
        user,
        setUser,
        clearUser,
        authReady,
        isAuthenticated: !!user,
    }), [user, authReady]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
