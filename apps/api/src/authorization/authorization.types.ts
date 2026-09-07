import type { WorkspaceRole } from './roles.js';

export type WorkspaceMembership = {
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
};