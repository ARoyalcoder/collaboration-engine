export type Workspace = {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type CreateWorkspaceInput = {
  name: string;
};

export type UpdateWorkspaceInput = {
  name: string;
};

export type AddMemberInput = {
  email: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
};