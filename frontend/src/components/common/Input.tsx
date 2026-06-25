import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, className = "", ...rest }, ref) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-surface-700">
                    {label}
                </label>
            )}
            <input
                id={id}
                ref={ref}
                className={`border bg-white px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:ring-1 ${
                    error ? "border-danger-500 focus:ring-danger-500" : "border-surface-200 focus:border-brand-600 focus:ring-brand-600"
                } ${className}`}
                {...rest}
            />
            {error && <p className="text-xs text-danger-600">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";
