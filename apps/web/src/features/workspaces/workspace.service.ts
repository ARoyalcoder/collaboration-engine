import type {
  AddMemberInput,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  Workspace,
  WorkspaceMember,
} from './workspace.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:5000/api/v1';

async function parseResponse(
  response: Response,
) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ??
      'Something went wrong';

    throw new Error(message);
  }

  return data;
}

async function request<T>(
  url: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  return parseResponse(response);
}

export async function listWorkspaces(
  accessToken: string,
): Promise<Workspace[]> {
  const data = await request<{ workspaces?: Workspace[] } | Workspace[]>(
    `${API_BASE_URL}/workspaces`,
    accessToken,
  );
  if (Array.isArray(data)) {
    return data;
  }
  return data?.workspaces ?? [];
}

export async function getWorkspace(
  workspaceId: string,
  accessToken: string,
): Promise<Workspace> {
  const data = await request<{ workspace?: Workspace } | Workspace>(
    `${API_BASE_URL}/workspaces/${workspaceId}`,
    accessToken,
  );
  return (data as { workspace?: Workspace })?.workspace ?? (data as Workspace);
}

export async function createWorkspace(
  input: CreateWorkspaceInput,
  accessToken: string,
): Promise<Workspace> {
  const data = await request<{ workspace?: Workspace } | Workspace>(
    `${API_BASE_URL}/workspaces`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
  return (data as { workspace?: Workspace })?.workspace ?? (data as Workspace);
}

export async function updateWorkspace(
  workspaceId: string,
  input: UpdateWorkspaceInput,
  accessToken: string,
): Promise<Workspace> {
  const data = await request<{ workspace?: Workspace } | Workspace>(
    `${API_BASE_URL}/workspaces/${workspaceId}`,
    accessToken,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
  return (data as { workspace?: Workspace })?.workspace ?? (data as Workspace);
}

export async function listMembers(
  workspaceId: string,
  accessToken: string,
): Promise<WorkspaceMember[]> {
  const data = await request<{ members?: WorkspaceMember[] } | WorkspaceMember[]>(
    `${API_BASE_URL}/workspaces/${workspaceId}/members`,
    accessToken,
  );
  if (Array.isArray(data)) {
    return data;
  }
  return data?.members ?? [];
}

export async function addMember(
  workspaceId: string,
  input: AddMemberInput,
  accessToken: string,
): Promise<WorkspaceMember> {
  const data = await request<{ member?: WorkspaceMember } | WorkspaceMember>(
    `${API_BASE_URL}/workspaces/${workspaceId}/members`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
  return (data as { member?: WorkspaceMember })?.member ?? (data as WorkspaceMember);
}