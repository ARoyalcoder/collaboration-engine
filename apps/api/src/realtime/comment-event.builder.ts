import crypto from 'node:crypto';

import type {
    CommentCreatedEvent,
    CommentUpdatedEvent,
    CommentDeletedEvent,
    CommentEventActor,
} from '@collaboration-engine/shared';

type CommentRecord = {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

function toCommentEventComment(
    comment: CommentRecord,
) {
    return {
        id: comment.id,
        taskId: comment.taskId,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
    };
}

export function buildCommentCreatedEvent(
    workspaceId: string,
    projectId: string,
    comment: CommentRecord,
    actor: CommentEventActor,
): CommentCreatedEvent {
    return {
        eventId: crypto.randomUUID(),
        type: 'comment.created',
        workspaceId,
        projectId,
        taskId: comment.taskId,
        comment: toCommentEventComment(comment),
        actor,
        occurredAt: new Date().toISOString(),
    };
}

export function buildCommentUpdatedEvent(
    workspaceId: string,
    projectId: string,
    comment: CommentRecord,
    actor: CommentEventActor,
): CommentUpdatedEvent {
    return {
        eventId: crypto.randomUUID(),
        type: 'comment.updated',
        workspaceId,
        projectId,
        taskId: comment.taskId,
        comment: toCommentEventComment(comment),
        actor,
        occurredAt: new Date().toISOString(),
    };
}

export function buildCommentDeletedEvent(
    workspaceId: string,
    projectId: string,
    taskId: string,
    commentId: string,
    actor: CommentEventActor,
): CommentDeletedEvent {
    return {
        eventId: crypto.randomUUID(),
        type: 'comment.deleted',
        workspaceId,
        projectId,
        taskId,
        commentId,
        actor,
        occurredAt: new Date().toISOString(),
    };
}

import type { CommentEvent } from '@collaboration-engine/shared';

const websocketInternalUrl =
  process.env.WEBSOCKET_INTERNAL_URL ??
  'http://localhost:4001';

const internalEventSecret =
  process.env.INTERNAL_EVENT_SECRET;

export async function publishCommentEvent(
  event: CommentEvent,
): Promise<void> {
  if (!internalEventSecret) {
    throw new Error(
      'INTERNAL_EVENT_SECRET is not configured',
    );
  }

  const response = await fetch(
    `${websocketInternalUrl}/internal/events`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-event-secret':
          internalEventSecret,
      },
      body: JSON.stringify(event),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to publish comment event: ${response.status}`,
    );
  }
}