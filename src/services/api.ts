import { useUserStore } from '@/store/useUserStore';

const DEFAULT_BASE_URL = 'http://localhost:8080';

function getBaseUrl() {
  return process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { json?: unknown; auth?: boolean } = {}
): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as any),
  };

  if (options.json !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth) {
    const token = useUserStore.getState().token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
    });
  } catch (e: any) {
    // Typical on web when backend isn't reachable (CORS, connection refused, etc.)
    throw new Error('Бэкенд недоступен (network error). Проверь EXPO_PUBLIC_API_BASE_URL и что сервер запущен.');
  }

  const text = await res.text();
  let data: any = undefined;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === 'object' && 'message' in data && (data as any).message) ||
      `HTTP ${res.status}`;
    throw new Error(String(msg));
  }

  return data as T;
}

