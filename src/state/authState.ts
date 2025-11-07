const TOKEN_STORAGE_KEY = 'auth_access_token';

// Initialize token from localStorage if available
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

let accessToken: string | null = getStoredToken();
type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export function setAccessToken(token: string | null) {
  accessToken = token;
  
  // Persist to localStorage
  if (typeof window !== 'undefined') {
    try {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to persist token to localStorage:', error);
    }
  }
  
  listeners.forEach((l) => l(accessToken));
}

export function getAccessToken() {
  // If token is null but might be in localStorage, try to load it
  if (!accessToken && typeof window !== 'undefined') {
    const stored = getStoredToken();
    if (stored) {
      accessToken = stored;
    }
  }
  return accessToken;
}

export function subscribeToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}


