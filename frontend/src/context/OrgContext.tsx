import { useOrgs } from "@/hooks/useOrgs";
import type { Organization } from "@/types";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface OrgContextValue {
    orgs: Organization[];
    activeOrg: Organization | null;
    isLoading: boolean;
    setActiveOrgId: (orgId: string) => void;
}

const STORAGE_KEY = "taskflow_active_org_id";

const OrgContext = createContext<OrgContextValue | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
    const { data: orgs, isLoading } = useOrgs();
    const [activeOrgId, setActiveOrgIdState] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));

    // If no org is selected yet (or the stored one no longer exists), default to the first.
    useEffect(() => {
        if (!orgs || orgs.length === 0) return;

        const storedOrgIsValid = orgs.some((org) => org.id === activeOrgId);
        if (!activeOrgId || !storedOrgIsValid) {
            setActiveOrgIdState(orgs[0].id);
        }
    }, [orgs, activeOrgId]);

    const setActiveOrgId = useCallback((orgId: string) => {
        setActiveOrgIdState(orgId);
        localStorage.setItem(STORAGE_KEY, orgId);
    }, []);

    const activeOrg = orgs?.find((org) => org.id === activeOrgId) ?? null;

    const value: OrgContextValue = {
        orgs: orgs ?? [],
        activeOrg,
        isLoading,
        setActiveOrgId,
    };

    return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrgContext(): OrgContextValue {
    const context = useContext(OrgContext);
    if (context === undefined) {
        throw new Error("useOrgContext must be used within an OrgProvider");
    }
    return context;
}
