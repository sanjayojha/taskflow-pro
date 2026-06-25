import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layers } from "lucide-react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { authApi } from "@/api/auth";
import { registerSchema, type RegisterFormValues } from "@/utils/validation";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(values: RegisterFormValues) {
        setIsSubmitting(true);
        try {
            await authApi.register(values);
            toast.success("Check your email to verify your account.");
            navigate("/login");
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
                    <h1 className="mb-1 text-xl font-semibold text-surface-900">Create your account</h1>
                    <p className="mb-6 text-sm text-surface-500">Start organizing your team's work.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input id="name" type="text" label="Full name" placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
                        <Input id="email" type="email" label="Email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
                        <Input id="password" type="password" label="Password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
                        <p className="text-xs text-surface-400">Minimum 8 characters, with one uppercase letter and one number.</p>

                        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="mt-2 w-full">
                            Create account
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-surface-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
