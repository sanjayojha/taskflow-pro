import { useAuth } from "@/hooks/useAuth";

function App() {
    const { isLoading, isAuthenticated, user } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-surface-50">
                <div className="h-8 w-8 animate-spin border-2 border-surface-200 border-t-brand-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-surface-50">
            <p className="text-surface-700">{isAuthenticated ? `Logged in as ${user?.name}` : "Not authenticated"}</p>
        </div>
    );
}

export default App;
