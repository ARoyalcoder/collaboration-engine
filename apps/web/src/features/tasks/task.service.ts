import type {
  CreateTaskInput,
  Task,
} from './task.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:5000/api/v1';

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

export async function listTasks(
  workspaceId: string,
  projectId: string,
  accessToken: string,
): Promise<Task[]> {
  return request<Task[]>(
    `${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    accessToken,
  );
}

export async function getTask(
  workspaceId: string,
  projectId: string,
  taskId: string,
  accessToken: string,
): Promise<Task> {
  return request<Task>(
    `${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    accessToken,
  );
}

export async function createTask(
  workspaceId: string,
  projectId: string,
  input: CreateTaskInput,
  accessToken: string,
): Promise<Task> {
  return request<Task>(
    `${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
}