import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { OrgSwitcher } from "./OrgSwitcher";
import { Bell, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { Avatar } from "../common/Avatar";

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    if (!user) return null;

    return (
        <header className="flex h-14 items-center justify-between border-b border-surface-200 bg-white px-6">
            <OrgSwitcher />

            <div className="flex items-center gap-4">
                <button className="relative text-surface-500 hover:text-surface-800">
                    <Bell className="h-5 w-5" />
                </button>
                <div ref={containerRef} className="relative">
                    <button onClick={() => setIsOpen((prev) => !prev)} className="flex items-center gap-2">
                        {/* <Avatar name={user.name} avatarUrl={user.avatarUrl} size="sm" /> */}
                        <ChevronDown className="h-3.5 w-3.5 text-surface-400" />
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 top-full z-20 mt-1 w-48 border border-surface-200 bg-white shadow-sm">
                            <div className="border-b border-surface-100 px-3 py-2">
                                <p className="text-sm font-medium text-surface-800">{user.name}</p>
                                <p className="text-xs text-surface-400">{user.email}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate("/app/settings/profile");
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-surface-700 hover:bg-surface-50"
                            >
                                <UserIcon className="h-3.5 w-3.5" />
                                Profile
                            </button>
                            <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger-600 hover:bg-surface-50">
                                <LogOut className="h-3.5 w-3.5" />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
