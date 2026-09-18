export type PresenceUser = {
    userId: string;
    name: string;
};

export type PresenceConnection = {
    socketId: string;
    userId: string;
    connectedAt: number;
};

export type PresenceState = {
    userId: string;
    name: string;
    socketIds: Set<string>;
    lastSeenAt: number | null;
};

export type WorkspacePresenceState = {
    workspaceId: string;
    userSockets: Map<string, Set<string>>;
};

export type SocketPresenceState = {
    userId: string;
    workspaceIds: Set<string>;
};