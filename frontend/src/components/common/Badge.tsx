interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
    default: "bg-surface-100 text-surface-600",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-danger-50 text-danger-600",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
    return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${variantStyles[variant]}`}>{children}</span>;
}
