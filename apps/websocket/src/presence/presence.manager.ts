import type {
  PresenceState,
  PresenceUser,
} from './presence.types.js';

export class PresenceManager {
  private readonly users = new Map<
    string,
    PresenceState
  >();

  private readonly workspaceUsers =
    new Map<
      string,
      Map<string, Set<string>>
    >();

  addConnection(
    user: PresenceUser,
    socketId: string,
  ): boolean {
    let state = this.users.get(user.userId);

    const wasOffline =
      !state || state.socketIds.size === 0;

    if (!state) {
      state = {
        userId: user.userId,
        name: user.name,
        socketIds: new Set(),
        lastSeenAt: null,
      };

      this.users.set(user.userId, state);
    }

    state.socketIds.add(socketId);

    return wasOffline;
  }

  removeConnection(
    userId: string,
    socketId: string,
  ): boolean {
    const state = this.users.get(userId);

    if (!state) {
      return false;
    }

    state.socketIds.delete(socketId);

    if (state.socketIds.size > 0) {
      return false;
    }

    state.lastSeenAt = Date.now();

    return true;
  }

  joinWorkspace(
    workspaceId: string,
    userId: string,
    socketId: string,
  ): boolean {
    let users =
      this.workspaceUsers.get(workspaceId);

    if (!users) {
      users = new Map();
      this.workspaceUsers.set(
        workspaceId,
        users,
      );
    }

    let sockets = users.get(userId);

    const wasAbsent =
      !sockets || sockets.size === 0;

    if (!sockets) {
      sockets = new Set();
      users.set(userId, sockets);
    }

    sockets.add(socketId);

    return wasAbsent;
  }

  leaveWorkspace(
    workspaceId: string,
    userId: string,
    socketId: string,
  ): boolean {
    const users =
      this.workspaceUsers.get(workspaceId);

    if (!users) {
      return false;
    }

    const sockets = users.get(userId);

    if (!sockets) {
      return false;
    }

    sockets.delete(socketId);

    if (sockets.size > 0) {
      return false;
    }

    users.delete(userId);

    if (users.size === 0) {
      this.workspaceUsers.delete(
        workspaceId,
      );
    }

    return true;
  }

  getWorkspaceOnlineUsers(
    workspaceId: string,
  ): string[] {
    const users =
      this.workspaceUsers.get(workspaceId);

    if (!users) {
      return [];
    }

    return [...users.keys()];
  }
}