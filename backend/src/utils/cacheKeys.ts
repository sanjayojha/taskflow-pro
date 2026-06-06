// TTL constants in seconds, one place to tune all cache lifetimes
export const CacheTTL = {
    SHORT: 60, // 1 min: tasks, comments (change frequently)
    MEDIUM: 300, // 5 min:  projects, members
    LONG: 600, // 10 min: orgs (change rarely)
};

export const CacheKeys = {
    // Org
    org: (orgId: string) => `org:${orgId}`,
    orgMembers: (orgId: string) => `org:${orgId}:members`,
    userOrgs: (userId: string) => `user:${userId}:orgs`,

    // Project
    project: (projectId: string) => `project:${projectId}`,
    orgProjects: (orgId: string) => `org:${orgId}:projects`,
    projectMembers: (projectId: string) => `project:${projectId}:members`,

    // Task
    task: (taskId: string) => `task:${taskId}`,
    projectTasks: (projectId: string) => `project:${projectId}:tasks`,
};
