import { useOrg } from "@/hooks/useOrg";
import { Building2, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function OrgSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { orgs, activeOrg, setActiveOrgId } = useOrg();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!activeOrg) return null;

    return (
        <div ref={containerRef} className="relative">
            <button onClick={() => setIsOpen((prev) => !prev)} className="flex items-center gap-2 border border-surface-200 px-3 py-1.5 text-sm hover:bg-surface-50">
                <Building2 className="h-4 w-4 text-surface-500" />
                <span className="font-medium text-surface-800">{activeOrg.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-surface-400" />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-56 border border-surface-200 bg-white shadow-sm">
                    {orgs.map((org) => (
                        <button
                            key={org.id}
                            onClick={() => {
                                setActiveOrgId(org.id);
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-surface-700 hover:bg-surface-50"
                        >
                            <span>{org.name}</span>
                            {org.id === activeOrg.id && <Check className="h-3.5 w-3.5 text-brand-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
