import { getInitials } from "@/utils";

interface AvatarProps {
    name: string;
    avatarUrl?: string;
    size?: "sm" | "md" | "lg";
}

const sizeStyles = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
};

export function Avatar({ name, avatarUrl, size = "md" }: AvatarProps) {
    if (avatarUrl) {
        return <img src={avatarUrl} alt={name} className={`${sizeStyles[size]} object-cover`} />;
    }

    return <div className={`flex items-center justify-center bg-brand-600 font-medium text-white ${sizeStyles[size]}`}>{getInitials(name)}</div>;
}
