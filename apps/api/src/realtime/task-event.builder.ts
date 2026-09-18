import crypto from 'node:crypto';

import type {
  TaskEventActor,
  TaskEventTask,
  TaskCreatedEvent,
  TaskUpdatedEvent,
  TaskDeletedEvent,
} from '@collaboration-engine/shared';

function toTaskEventTask(task: {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignedToId: string | null;
  createdById: string;
  dueDate: Date | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}): TaskEventTask {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignedToId: task.assignedToId,
    createdById: task.createdById,
    dueDate: task.dueDate?.toISOString() ?? null,
    version: task.version,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function buildTaskCreatedEvent(
  workspaceId: string,
  task: Parameters<typeof toTaskEventTask>[0],
  actor: TaskEventActor,
): TaskCreatedEvent {
  return {
    eventId: crypto.randomUUID(),
    type: 'task.created',
    workspaceId,
    projectId: task.projectId,
    task: toTaskEventTask(task),
    actor,
    occurredAt: new Date().toISOString(),
  };
}

export function buildTaskUpdatedEvent(
  workspaceId: string,
  task: Parameters<typeof toTaskEventTask>[0],
  actor: TaskEventActor,
): TaskUpdatedEvent {
  return {
    eventId: crypto.randomUUID(),
    type: 'task.updated',
    workspaceId,
    projectId: task.projectId,
    task: toTaskEventTask(task),
    actor,
    occurredAt: new Date().toISOString(),
  };
}

export function buildTaskDeletedEvent(
  workspaceId: string,
  projectId: string,
  taskId: string,
  actor: TaskEventActor,
): TaskDeletedEvent {
  return {
    eventId: crypto.randomUUID(),
    type: 'task.deleted',
    workspaceId,
    projectId,
    taskId,
    actor,
    occurredAt: new Date().toISOString(),
  };
}