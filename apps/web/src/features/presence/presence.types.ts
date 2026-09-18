export type PresenceUser = {
  userId: string;
  name: string;
};

export type UserPresenceEvent = {
  eventId: string;
  type:
    | 'user.online'
    | 'user.offline';
  workspaceId: string;
  userId: string;
  name: string;
  occurredAt: string;
};
