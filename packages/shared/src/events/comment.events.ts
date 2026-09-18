export type CommentEventActor = {
  id: string;
  name: string;
};

export type CommentEventComment = {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentCreatedEvent = {
  eventId: string;
  type: 'comment.created';

  workspaceId: string;
  projectId: string;
  taskId: string;

  comment: CommentEventComment;

  actor: CommentEventActor;

  occurredAt: string;
};

export type CommentUpdatedEvent = {
  eventId: string;
  type: 'comment.updated';

  workspaceId: string;
  projectId: string;
  taskId: string;

  comment: CommentEventComment;

  actor: CommentEventActor;

  occurredAt: string;
};

export type CommentDeletedEvent = {
  eventId: string;
  type: 'comment.deleted';

  workspaceId: string;
  projectId: string;
  taskId: string;

  commentId: string;

  actor: CommentEventActor;

  occurredAt: string;
};

export type CommentEvent =
  | CommentCreatedEvent
  | CommentUpdatedEvent
  | CommentDeletedEvent;