import { Badge } from "@/components/common/Badge";
import { useOrg } from "@/hooks/useOrg";
import { useProjects } from "@/hooks/useProjects";
import { ArrowRight, FolderKanban, Plus } from "lucide-react";
import { Link } from "react-router";

export const STATUS_VARIANT: Record<string, "success" | "warning" | "default"> = {
    active: "success",
    completed: "default",
    archived: "warning",
};
export default function DashboardPage() {
    const { activeOrg } = useOrg();
    const { data, isLoading } = useProjects(activeOrg?.id, { limit: 12 });

    const projects = data?.items ?? [];

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-surface-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-surface-500">{activeOrg ? `Projects in ${activeOrg.name}` : "Select an organization"}</p>
                </div>
                {activeOrg && (
                    <Link to={`/app/orgs/${activeOrg.id}/projects`} className="flex items-center gap-1.5 border border-surface-200 bg-white px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-50">
                        <Plus className="h-3.5 w-3.5" />
                        New project
                    </Link>
                )}
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 animate-pulse border border-surface-200 bg-surface-100" />
                    ))}
                </div>
            )}

            {!isLoading && projects.length === 0 && (
                <div className="flex flex-col items-center justify-center border border-dashed border-surface-200 bg-white py-16 text-center">
                    <FolderKanban className="mb-3 h-8 w-8 text-surface-300" />
                    <p className="text-sm font-medium text-surface-700">No projects yet</p>
                    <p className="mt-1 text-sm text-surface-400">Create your first project to start organizing tasks.</p>
                </div>
            )}

            {!isLoading && projects.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                        const total = project.taskSummary.total;
                        const done = project.taskSummary.done;
                        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

                        return (
                            <Link key={project.id} to={`/app/projects/${project.id}`} className="group border border-surface-200 bg-white p-5 transition-colors hover:border-brand-600">
                                <div className="mb-3 flex items-start justify-between">
                                    <h3 className="font-medium text-surface-900 group-hover:text-brand-600">{project.name}</h3>
                                    <Badge variant={STATUS_VARIANT[project.status] ?? "default"}>{project.status}</Badge>
                                </div>
                                {project.description && <p className="mb-4 line-clamp-2 text-sm text-surface-500">{project.description}</p>}

                                <div className="mb-2 flex items-center justify-between text-xs text-surface-400">
                                    <span>
                                        {done} of {total} tasks done
                                    </span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-surface-100">
                                    <div className="h-1.5 bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
                                </div>

                                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                                    Open project
                                    <ArrowRight className="h-3 w-3" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
