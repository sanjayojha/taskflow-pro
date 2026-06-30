import { useOrg } from "@/hooks/useOrg";
import { Bell, FolderKanban, Layers, LayoutDashboard, Settings } from "lucide-react";
import { NavLink } from "react-router";

const navItems = [
    { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/notifications", label: "Notifications", icon: Bell },
    { to: "/app/settings/profile", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const { activeOrg } = useOrg();
    return (
        <aside className="flex h-screen w-60 flex-col bg-surface-900">
            <div className="flex h-14 items-center gap-2 border-b border-white/10 px-5">
                <div className="flex h-7 w-7 items-center justify-center bg-brand-600">
                    <Layers className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-semibold text-white">TaskFlow Pro</span>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {activeOrg && (
                    <NavLink
                        to={`/app/orgs/${activeOrg.id}/projects`}
                        className={({ isActive }) => `mb-1 flex items-center gap-3 px-3 py-2 text-sm transition-colors ${isActive ? "bg-brand-600 text-white" : "text-surface-300 hover:bg-white/5 hover:text-white"}`}
                    >
                        <FolderKanban className="h-4 w-4" />
                        Projects
                    </NavLink>
                )}
                {navItems.map((item) => (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `mb-1 flex items-center gap-3 px-3 py-2 text-sm transition-colors ${isActive ? "bg-brand-600 text-white" : "text-surface-300 hover:bg-white/5 hover:text-white"}`}>
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
