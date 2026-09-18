export type UserPresenceEvent = {
  eventId: string;
  workspaceId: string;
  userId: string;
  name: string;
  occurredAt: string;
};

export type UserOnlineEvent =
  UserPresenceEvent & {
    type: 'user.online';
  };

export type UserOfflineEvent =
  UserPresenceEvent & {
    type: 'user.offline';
  };

export type PresenceEvent =
  | UserOnlineEvent
  | UserOfflineEvent;