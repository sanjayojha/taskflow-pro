import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router";

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-surface-50">
                <div className="h-8 w-8 animate-spin border-2 border-surface-200 border-t-brand-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Preserve where the user was headed so we can return them after login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
