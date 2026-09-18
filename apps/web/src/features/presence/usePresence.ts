import { useEffect, useState } from 'react';

import { socket } from '../../services/socket.js';
import type {
  UserPresenceEvent,
} from './presence.types.js';

export function usePresence(
  workspaceId: string,
) {
  const [users, setUsers] =
    useState<Map<string, string>>(
      new Map(),
    );

  useEffect(() => {
    const handleOnline = (
      event: UserPresenceEvent,
    ) => {
      if (
        event.workspaceId !== workspaceId
      ) {
        return;
      }

      setUsers((current) => {
        const next = new Map(current);

        next.set(
          event.userId,
          event.name,
        );

        return next;
      });
    };

    const handleOffline = (
      event: UserPresenceEvent,
    ) => {
      if (
        event.workspaceId !== workspaceId
      ) {
        return;
      }

      setUsers((current) => {
        const next = new Map(current);

        next.delete(event.userId);

        return next;
      });
    };

    socket.on(
      'user.online',
      handleOnline,
    );

    socket.on(
      'user.offline',
      handleOffline,
    );

    return () => {
      socket.off(
        'user.online',
        handleOnline,
      );

      socket.off(
        'user.offline',
        handleOffline,
      );
    };
  }, [workspaceId]);

  return [...users.entries()].map(
    ([userId, name]) => ({
      userId,
      name,
    }),
  );
}