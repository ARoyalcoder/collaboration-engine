export type UserOnlineEvent = {
    eventId: string;
    type: 'user.online';

    user: {
        id: string;
        name: string;
    };

    occurredAt: string;
};

export type UserOfflineEvent = {
    eventId: string;
    type: 'user.offline';

    user: {
        id: string;
        name: string;
    };

    occurredAt: string;
};

export type PresenceEvent =
    | UserOnlineEvent
    | UserOfflineEvent;