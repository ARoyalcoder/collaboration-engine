export type ProjectStatus =
  | 'PLANNING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'ARCHIVED';

export type Project = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectInput = {
  name: string;
  description?: string;
  status?: ProjectStatus;
};

export type UpdateProjectInput = {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
};