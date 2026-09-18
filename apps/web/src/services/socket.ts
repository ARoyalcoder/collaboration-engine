import { io, type Socket } from 'socket.io-client';

const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string | undefined) ??
  'http://localhost:4001';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});

export function connectSocket(accessToken: string): void {
  socket.auth = {
    token: accessToken,
  };

  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket(): void {
  if (socket.connected) {
    socket.disconnect();
  }
}


export function joinWorkspace(
  workspaceId: string,
): Promise<{
  success: boolean;
  message?: string;
}> {
  return new Promise((resolve) => {
    socket.emit(
      'workspace:join',
      workspaceId,
      resolve,
    );
  });
}

export function joinTask(
  workspaceId: string,
  projectId: string,
  taskId: string,
): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      'task:join',
      {
        workspaceId,
        projectId,
        taskId,
      },
      resolve,
    );
  });
}
export function leaveTask(
  taskId: string,
): void {
  socket.emit('task:leave', {
    taskId,
  });
}