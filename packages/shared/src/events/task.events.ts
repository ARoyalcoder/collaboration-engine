export type TaskEventActor = {
  id: string;
  name: string;
};

export type TaskEventTask = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignedToId: string | null;
  createdById: string;
  dueDate: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type TaskCreatedEvent = {
  eventId: string;
  type: 'task.created';

  workspaceId: string;
  projectId: string;

  task: TaskEventTask;

  actor: TaskEventActor;

  occurredAt: string;
};

export type TaskUpdatedEvent = {
  eventId: string;
  type: 'task.updated';

  workspaceId: string;
  projectId: string;

  task: TaskEventTask;

  actor: TaskEventActor;

  occurredAt: string;
};

export type TaskDeletedEvent = {
  eventId: string;
  type: 'task.deleted';

  workspaceId: string;
  projectId: string;

  taskId: string;

  actor: TaskEventActor;

  occurredAt: string;
};

export type TaskEvent =
  | TaskCreatedEvent
  | TaskUpdatedEvent
  | TaskDeletedEvent;