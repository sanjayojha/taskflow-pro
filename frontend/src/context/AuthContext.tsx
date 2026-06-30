import { authApi, type LoginPayload } from "@/api/auth";
import { setAccessToken } from "@/api/tokenStore";
import type { User } from "@/types";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On app load: try to silently restore a session from the refresh cookie.
    useEffect(() => {
        let isMounted = true;

        async function restoreSession() {
            try {
                const { data } = await authApi.refresh();
                setAccessToken(data.data.accessToken);
                const meResponse = await authApi.me();
                if (isMounted) {
                    setUser(meResponse.data.data.user);
                }
            } catch {
                // No valid refresh cookie, user is simply logged out. Not an error.
                setAccessToken(null);
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }
        restoreSession();
        return () => {
            isMounted = false;
        };
    }, []);

    const login = useCallback(async (payload: LoginPayload) => {
        const { data } = await authApi.login(payload);
        setAccessToken(data.data.accessToken);
        setUser(data.data.user);
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    }, []);

    const value: AuthContextValue = {
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        logout,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
