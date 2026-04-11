const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, credentials = 'include' } = options;

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const config: RequestInit = {
    method,
    credentials,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  console.log(`Fetching: ${API_BASE_URL}${endpoint}`, { method, body });

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (err) {
    console.error('Fetch error:', err);
    throw new ApiError(0, 'Failed to connect to server');
  }

  const rawBody = await response.text();
  const parsedBody = rawBody
    ? (() => {
        try {
          return JSON.parse(rawBody);
        } catch {
          return rawBody;
        }
      })()
    : undefined;

  if (!response.ok) {
    const error = parsedBody && typeof parsedBody === 'object' ? parsedBody : { message: 'Request failed' };
    console.error('Response error:', response.status, error);
    throw new ApiError(response.status, error.message || 'Request failed');
  }

  return (parsedBody ?? {}) as T;
}

export const http = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'POST' }),
  put: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'PUT' }),
  delete: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
