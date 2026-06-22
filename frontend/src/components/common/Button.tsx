import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "lg" | "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-surface-200 disabled:text-surface-500",
    secondary: "bg-white text-surface-800 border border-surface-200 hover:bg-surface-50 disabled:text-surface-300",
    danger: "bg-danger-600 text-white hover:bg-danger-700 disabled:bg-surface-200 disabled:text-surface-500",
    ghost: "bg-transparent text-surface-700 hover:bg-surface-100 disabled:text-surface-300",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "primary", size = "md", isLoading, disabled, children, className = "", ...rest }, ref) => {
    return (
        <button ref={ref} disabled={disabled || isLoading} className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...rest}>
            {isLoading && <span className="h-3.5 w-3.5 animate-spin border-2 border-current border-t-transparent" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";
