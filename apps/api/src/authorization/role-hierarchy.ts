import type { WorkspaceRole } from './roles.js';

export const ROLE_LEVEL: Record<WorkspaceRole, number> = {
  VIEWER: 1,
  MEMBER: 2,
  ADMIN: 3,
  OWNER: 4,
};