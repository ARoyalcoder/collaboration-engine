type UserPresence = {
  socketIds: Set<string>;
};

const presence = new Map<string, UserPresence>();

export function addConnection(
  userId: string,
  socketId: string,
): boolean {
  const existing = presence.get(userId);

  if (existing) {
    existing.socketIds.add(socketId);

    return false;
  }

  presence.set(userId, {
    socketIds: new Set([socketId]),
  });

  return true;
}

export function removeConnection(
  userId: string,
  socketId: string,
): boolean {
  const existing = presence.get(userId);

  if (!existing) {
    return false;
  }

  existing.socketIds.delete(socketId);

  if (existing.socketIds.size > 0) {
    return false;
  }

  presence.delete(userId);

  return true;
}

export function isOnline(
  userId: string,
): boolean {
  return presence.has(userId);
}