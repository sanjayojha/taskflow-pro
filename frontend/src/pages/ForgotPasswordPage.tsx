import { authApi } from "@/api/auth";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { forgetPasswordSchema, type ForgotPasswordFormValues } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Layers, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgetPasswordSchema),
    });

    async function onSumbit(values: ForgotPasswordFormValues) {
        setIsSubmitting(true);
        try {
            await authApi.forgotPassword(values.email);
            setIsSent(true);
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
                    {isSent ? (
                        <div className="text-center">
                            <MailCheck className="mx-auto mb-4 h-10 w-10 text-brand-600" strokeWidth={1.5} />
                            <h1 className="text-lg font-semibold text-surface-900">Check your email</h1>
                            <p className="mt-1 text-sm text-surface-500">If an account exists for that address, we've sent a link to reset your password.</p>
                        </div>
                    ) : (
                        <>
                            <h1 className="mb-1 text-xl font-semibold text-surface-900">Forgot password?</h1>
                            <p className="mb-6 text-sm text-surface-500">Enter your email and we'll send you a reset link.</p>
                            <form onSubmit={handleSubmit(onSumbit)} className="flex flex-col gap-4">
                                <Input id="email" type="email" label="Email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
                                <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="mt-2 w-full">
                                    Send reset link
                                </Button>
                            </form>
                        </>
                    )}
                </div>
                <p className="mt-6 text-center text-sm text-surface-500">
                    Remembered your password?{" "}
                    <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
