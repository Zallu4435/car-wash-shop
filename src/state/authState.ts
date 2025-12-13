const TOKEN_STORAGE_KEY = 'auth_access_token';

// Initialize token from sessionStorage if available (isolated per tab)
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

let accessToken: string | null = getStoredToken();
type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export function setAccessToken(token: string | null) {
  accessToken = token;
  
  // Persist to sessionStorage (isolated per tab, prevents cross-tab token conflicts)
  if (typeof window !== 'undefined') {
    try {
      if (token) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to persist token to sessionStorage:', error);
    }
  }
  
  listeners.forEach((l) => l(accessToken));
}

export function getAccessToken() {
  // If token is null but might be in sessionStorage, try to load it
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


