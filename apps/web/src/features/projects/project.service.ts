import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from './project.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:4000/api/v1';

async function parseResponse(
  response: Response,
) {
  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
        'Something went wrong',
    );
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

export async function listProjects(
  workspaceId: string,
  accessToken: string,
): Promise<Project[]> {
  return request<Project[]>(
    `${API_BASE_URL}/workspaces/${workspaceId}/projects`,
    accessToken,
  );
}

export async function getProject(
  workspaceId: string,
  projectId: string,
  accessToken: string,
): Promise<Project> {
  return request<Project>(
    `${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}`,
    accessToken,
  );
}

export async function createProject(
  workspaceId: string,
  input: CreateProjectInput,
  accessToken: string,
): Promise<Project> {
  return request<Project>(
    `${API_BASE_URL}/workspaces/${workspaceId}/projects`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
}

export async function updateProject(
  workspaceId: string,
  projectId: string,
  input: UpdateProjectInput,
  accessToken: string,
): Promise<Project> {
  return request<Project>(
    `${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}`,
    accessToken,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
}

export async function deleteProject(
  workspaceId: string,
  projectId: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.error?.message ??
        'Unable to delete project',
    );
  }
}