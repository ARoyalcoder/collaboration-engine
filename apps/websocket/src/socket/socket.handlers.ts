import type {

  Socket,
} from 'socket.io';

import {
  isWorkspaceMember,
} from '../authorization/workspace-access.service.js';

import {
  projectRoom,
  taskRoom,
  workspaceRoom,
} from '../rooms/room.utils.js';
import { canAccessProject } from '../authorization/project-access.service.js';
import { projectJoinSchema, taskJoinSchema, workspaceJoinSchema } from './socket.schema.js';
import { canAccessTask } from '../authorization/task-access.service.js';

export function registerSocketHandlers(

  socket: Socket,
): void {
  const user =
    socket.data.user;

  console.log(
    `User ${user.id} connected with socket ${socket.id}`,
  );

  socket.on(
    'workspace:join',
    async (
      workspaceId: unknown,
      callback?: (
        response: {
          success: boolean;
          message?: string;
        },
      ) => void,
    ) => {
      const parsed =
        workspaceJoinSchema.safeParse({
          workspaceId,
        });

      if (!parsed.success) {
        callback?.({
          success: false,
          message:
            'Invalid workspace ID',
        });

        return;
      }

      const {
        workspaceId: validWorkspaceId,
      } =
        parsed.data;

      try {
        const allowed =
          await isWorkspaceMember(
            validWorkspaceId,
            user.id,
          );

        if (!allowed) {
          callback?.({
            success: false,
            message:
              'Workspace access denied',
          });

          return;
        }

        const room =
          workspaceRoom(
            validWorkspaceId,
          );

        await socket.join(room);

        callback?.({
          success: true,
        });

        console.log(
          `User ${user.id} joined ${room}`,
        );
      } catch (error) {
        console.error(
          'Workspace join failed:',
          error,
        );

        callback?.({
          success: false,
          message:
            'Unable to join workspace',
        });
      }
    },
  );

  socket.on(
    'disconnect',
    (reason) => {
      console.log(
        `User ${user.id} disconnected`,
        reason,
      );
    },
  );

  socket.on(
    'project:join',
    async (
      payload: unknown,
      callback?: (
        response: {
          success: boolean;
          message?: string;
        },
      ) => void,
    ) => {
      const parsed =
        projectJoinSchema.safeParse(
          payload,
        );

      if (!parsed.success) {
        callback?.({
          success: false,
          message:
            'Invalid project information',
        });

        return;
      }

      const {
        workspaceId,
        projectId,
      } = parsed.data;

      try {
        const allowed =
          await canAccessProject(
            workspaceId,
            projectId,
            user.id,
          );

        if (!allowed) {
          callback?.({
            success: false,
            message:
              'Project access denied',
          });

          return;
        }

        const room =
          projectRoom(projectId);

        await socket.join(room);

        callback?.({
          success: true,
        });
      } catch {
        callback?.({
          success: false,
          message:
            'Unable to join project',
        });
      }
    },
  );

  socket.on(
    'task:join',
    async (
      payload: unknown,
      callback?: (
        response: {
          success: boolean;
          message?: string;
        },
      ) => void,
    ) => {
      const parsed =
        taskJoinSchema.safeParse(
          payload,
        );

      if (!parsed.success) {
        callback?.({
          success: false,
          message:
            'Invalid task information',
        });

        return;
      }

      const {
        workspaceId,
        projectId,
        taskId,
      } = parsed.data;

      try {
        const allowed =
          await canAccessTask(
            workspaceId,
            projectId,
            taskId,
            user.id,
          );

        if (!allowed) {
          callback?.({
            success: false,
            message:
              'Task access denied',
          });

          return;
        }

        const room =
          taskRoom(taskId);

        await socket.join(room);

        callback?.({
          success: true,
        });
      } catch {
        callback?.({
          success: false,
          message:
            'Unable to join task',
        });
      }
    },
  );
}




