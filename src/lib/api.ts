const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

class ApiError extends Error {
  status: number;

  data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/** Pulls a human-readable message out of DRF's various error shapes
 * (`{"detail": "..."}`, `{"field": ["error"]}`, or a plain string). */
const extractErrorMessage = (data: unknown, fallback: string): string => {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.detail === 'string') return record.detail;
    const firstKey = Object.keys(record)[0];
    if (firstKey) {
      const value = record[firstKey];
      const firstMessage = Array.isArray(value) ? value[0] : value;
      if (typeof firstMessage === 'string') return firstMessage;
    }
  }
  return fallback;
};

type RequestOptions = Omit<RequestInit, 'body'> & {
  /** JSON-serializable request body. */
  json?: unknown;
  /** Skip the refresh-on-401 retry (login/OTP/forgot-password/etc — a 401
   * from those means bad credentials, not an expired session). */
  skipAuth?: boolean;
  /** Internal — prevents infinite refresh loops. */
  isRetry?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

/**
 * Asks the backend to mint a fresh access cookie from the httpOnly refresh
 * cookie — no tokens pass through JS at any point. Shared across
 * concurrent 401s so a burst of requests only triggers one refresh call.
 */
const refreshAccessToken = async (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/token/refresh/`, {
          method: 'POST',
          credentials: 'include',
        });
        return res.ok;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { json, skipAuth, isRetry, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    // Auth is a same-origin httpOnly cookie now (see next.config.js
    // rewrites) — the browser attaches it automatically, but only if the
    // request opts in via `credentials`.
    credentials: 'include',
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });

  if (response.status === 401 && !skipAuth && !isRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, isRetry: true });
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data,
      extractErrorMessage(
        data,
        `Request failed with status ${response.status}`,
      ),
    );
  }

  return data as T;
}

export { ApiError, apiFetch };
