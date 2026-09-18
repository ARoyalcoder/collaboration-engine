# WebSocket Service (@collaboration-engine/websocket)

Real-time WebSocket server for collaboration rooms and task event broadcasting.

## Features
- **Socket Authentication**: JWT access token authentication on connection via `authenticateSocket`.
- **Rooms Management**:
  - `workspace:<workspaceId>`: Workspace-wide event room with membership authorization (`workspace:join`).
  - `project:<projectId>`: Project collaboration room with access control (`project:join`).
  - `task:<taskId>`: Task detail room with access control (`task:join`).
- **Internal Event Broadcasting**: HTTP POST `/internal/events` endpoint secured by `INTERNAL_EVENT_SECRET` to broadcast events across rooms from the API.

## Environment Variables
- `PORT`: WebSocket service port (default: `4001`).
- `NODE_ENV`: Runtime environment (`development` / `production`).
- `WEB_ORIGIN`: Allowed CORS origin for web clients (e.g. `http://localhost:5173`).
- `JWT_ACCESS_SECRET`: Secret used to verify JWT access tokens.
- `INTERNAL_EVENT_SECRET`: Secret header key for internal publishing from the API service.
