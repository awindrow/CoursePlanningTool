// src/routes/RequireAuth.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, authReady } = useAuth();
    const location = useLocation();

    if (!authReady) {
        // Optional: return a spinner or null while checking session
        return null;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    return <>{children}</>;
};

export default RequireAuth;
