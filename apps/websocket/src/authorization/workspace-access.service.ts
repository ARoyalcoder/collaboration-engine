import { prisma } from '@collaboration-engine/database';

export async function isWorkspaceMember(
    workspaceId: string,
    userId: string,
): Promise<boolean> {
    const membership =
        await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
            select: {
                id: true,
            },
        });

    return Boolean(membership);
}