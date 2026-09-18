import type {
    ActivityAction,
    ActivityEntityType,
} from '@collaboration-engine/database';

export type CreateActivityInput = {
    workspaceId: string;
    userId: string;
    action: ActivityAction;
    entityType: ActivityEntityType;
    entityId: string;
    metadata?: Record<string, unknown>;
};