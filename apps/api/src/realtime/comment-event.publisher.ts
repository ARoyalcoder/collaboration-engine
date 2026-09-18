import type { CommentEvent } from '@collaboration-engine/shared';

const websocketInternalUrl =
  process.env.WEBSOCKET_INTERNAL_URL ??
  'http://localhost:4001';

const internalEventSecret =
  process.env.INTERNAL_EVENT_SECRET;

export async function publishCommentEvent(
  event: CommentEvent,
): Promise<void> {
  if (!internalEventSecret) {
    throw new Error(
      'INTERNAL_EVENT_SECRET is not configured',
    );
  }

  const response = await fetch(
    `${websocketInternalUrl}/internal/events`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-event-secret':
          internalEventSecret,
      },
      body: JSON.stringify(event),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to publish comment event: ${response.status}`,
    );
  }
}