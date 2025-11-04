let accessToken: string | null = null;
type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export function setAccessToken(token: string | null) {
  accessToken = token;
  listeners.forEach((l) => l(accessToken));
}

export function getAccessToken() {
  return accessToken;
}

export function subscribeToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}


