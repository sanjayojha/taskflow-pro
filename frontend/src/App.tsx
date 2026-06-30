//import { useAuth } from "@/hooks/useAuth";

import { Routes, Route } from "react-router";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { PublicRoute } from "@/routes/PublicRoute";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { OrgProvider } from "@/context/OrgContext";
import { AppShell } from "@/components/layout/AppShell";
import DashboardPage from "@/pages/DashboardPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/app"
                    element={
                        <OrgProvider>
                            <AppShell />
                        </OrgProvider>
                    }
                >
                    <Route path="dashboard" element={<DashboardPage />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
