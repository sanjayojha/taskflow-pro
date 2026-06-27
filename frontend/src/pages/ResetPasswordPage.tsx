import { authApi } from "@/api/auth";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { type ResetPasswordFormValues, resetPasswordSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Layers } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";

export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    async function onSubmit(values: ResetPasswordFormValues) {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        setIsSubmitting(true);
        try {
            await authApi.resetPassword(token, values.password, values.confirmPassword);
            toast.success("Password reset. Please log in.");
            navigate("/login");
        } catch (err) {
            if (isAxiosError(err) && err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                console.log("Rest password error:", err);
                toast.error("This reset link may have expired.");
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
                    <h1 className="mb-1 text-xl font-semibold text-surface-900">Reset your password</h1>
                    <p className="mb-6 text-sm text-surface-500">Choose a new password for your account.</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input id="password" type="password" label="New password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
                        <Input id="confirmPassword" type="password" label="Confirm new password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
                        <p className="text-xs text-surface-400">Minimum 8 characters, with one uppercase letter and one number.</p>

                        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="mt-2 w-full">
                            Reset password
                        </Button>
                    </form>
                </div>
                <p className="mt-6 text-center text-sm text-surface-500">
                    <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
}
