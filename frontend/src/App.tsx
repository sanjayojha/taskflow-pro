//import { useAuth } from "@/hooks/useAuth";

import { Routes, Route } from "react-router";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { PublicRoute } from "@/routes/PublicRoute";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>
        </Routes>
    );
}

export default App;
