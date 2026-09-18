import type { PresenceUser } from './presence.types.js';

type PresenceListProps = {
  users: PresenceUser[];
};

export function PresenceList({
  users,
}: PresenceListProps) {
  return (
    <div>
      <h3>Online now</h3>

      {users.length === 0 ? (
        <p>No other users online.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.userId}>
              🟢 {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}