export function workspaceRoom(
    workspaceId: string,
): string {
    return `workspace:${workspaceId}`;
}

export function projectRoom(
    projectId: string,
): string {
    return `project:${projectId}`;
}

export function taskRoom(
    taskId: string,
): string {
    return `task:${taskId}`;
}