// hooks/useLogin.ts
import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser, logoutUser } from "../services/auth";

export const useLogin = () => {
    const { setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = useCallback(async (user: string, password: string) => {
        setIsLoading(true);
        const res = await loginUser(user.trim(), password);
        setIsLoading(false);

        if (res.ok) {
            setUser(res.data.user);
            return true;
        }
        return false;
    }, [setUser]);

    const handleLogout = useCallback(async () => {
        setIsLoading(true);
        const res = await logoutUser();
        setIsLoading(false);

        if (res.ok) {
            setUser(null as any);
            return true;
        }
        return false;
    }, [setUser]);

    return { isLoading, handleLogin, handleLogout };
};
