const BASE = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = 'eventflow:token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable: ignore
  }
}

// One place for every server call
export async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Cannot reach the server. Please try again.');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error || 'Something went wrong.');
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }
  return data;
}