import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export function PublicRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-surface-50">
                <div className="h-8 w-8 animate-spin border-2 border-surface-200 border-t-brand-600" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/app/dashboard" replace />;
    }

    return <Outlet />;
}
