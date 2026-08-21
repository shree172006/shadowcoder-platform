const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom fetch client with credentials support and automatic 401 refresh token flow.
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Timeout controller (default 8s or custom timeout from options)
  const timeoutMs = options.timeout || 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const config = {
    ...options,
    headers: defaultHeaders,
    credentials: 'include', // Always transmit HttpOnly cookies
    signal: options.signal || controller.signal,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (fetchErr) {
    clearTimeout(timeoutId);
    if (fetchErr.name === 'AbortError') {
      const timeoutError = new Error('Request timed out. Backend service may be waking up.');
      timeoutError.status = 408;
      throw timeoutError;
    }
    throw fetchErr;
  } finally {
    clearTimeout(timeoutId);
  }

  // If unauthorized (401), attempt to refresh token once (except for auth endpoints)
  const isAuthEndpoint =
    endpoint.includes('/auth/login') ||
    endpoint.includes('/auth/register') ||
    endpoint.includes('/auth/refresh') ||
    endpoint.includes('/auth/firebase') ||
    endpoint.includes('/auth/me');

  if (response.status === 401 && !isAuthEndpoint) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        // Retry original request with refreshed cookie
        response = await fetch(url, config);
      }
    } catch (refreshErr) {
      console.warn('Failed to auto-refresh session', refreshErr);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'An HTTP error occurred');
    error.status = response.status;
    error.errors = data.errors || [];
    throw error;
  }

  return data;
};
