import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { Layers } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function LoginPage() {
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const from = (location.state as { from?: Location })?.from?.pathname ?? "/app/dashboard";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(values: LoginFormValues) {
        setIsSubmitting(true);
        try {
            await login(values);
            navigate(from, { replace: true });
        } catch (err) {
            if (isAxiosError(err) && err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-50 px-6">
            <div className="w-full max-w-sm">
                <Link to="/" className="mb-8 flex items-center justify-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center bg-brand-600">
                        <Layers className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-semibold text-surface-900">TaskFlow Pro</span>
                </Link>

                <div className="border border-surface-200 bg-white p-8">
                    <h1 className="mb-1 text-xl font-semibold text-surface-900">Log in</h1>
                    <p className="mb-6 text-sm text-surface-500">Welcome back. Enter your details.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input id="email" type="email" label="Email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
                        <Input id="password" type="password" label="Password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-700">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="mt-2 w-full">
                            Log in
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-surface-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
