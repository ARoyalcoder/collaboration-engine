import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  User,
} from './auth.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:5000/api/v1';

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ?? 'Something went wrong';

    throw new Error(message);
  }

  return data;
}

export async function login(
  input: LoginInput,
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    },
  );

  return parseResponse(response);
}

export async function register(
  input: RegisterInput,
): Promise<User> {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    },
  );

  return parseResponse(response);
}