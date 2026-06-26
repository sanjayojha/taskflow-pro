import { authApi } from "@/api/auth";
import { Button } from "@/components/common/Button";
import { CheckCircle2, Layers, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

type VerifyStatus = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<VerifyStatus>("verifying");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        authApi
            .verifyEmail(token)
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"));
    }, [token]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-50 px-6">
            <div className="w-full max-w-sm text-center">
                <Link to="/" className="mb-8 flex items-center justify-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center bg-brand-600">
                        <Layers className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-semibold text-surface-900">TaskFlow Pro</span>
                </Link>

                <div className="border border-surface-200 bg-white p-8">
                    {status === "verifying" && (
                        <>
                            <div className="mx-auto mb-4 h-8 w-8 animate-spin border-2 border-surface-200 border-t-brand-600" />
                            <h1 className="text-lg font-semibold text-surface-900">Verifying your email…</h1>
                            <p className="mt-1 text-sm text-surface-500">This will only take a moment.</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-green-600" strokeWidth={1.5} />
                            <h1 className="text-lg font-semibold text-surface-900">Email verified</h1>
                            <p className="mt-1 text-sm text-surface-500">Your account is ready. You can log in now.</p>
                            <Link to="/login">
                                <Button variant="primary" size="md" className="mt-6 w-full">
                                    Go to login
                                </Button>
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <XCircle className="mx-auto mb-4 h-10 w-10 text-danger-600" strokeWidth={1.5} />
                            <h1 className="text-lg font-semibold text-surface-900">Verification failed</h1>
                            <p className="mt-1 text-sm text-surface-500">This link may have expired or already been used.</p>
                            <Link to="/login">
                                <Button variant="secondary" size="md" className="mt-6 w-full">
                                    Back to login
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
