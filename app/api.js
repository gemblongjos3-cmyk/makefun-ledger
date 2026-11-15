const API = 'https://make.fun/api';
const memory = new Map();
const PREFIX = 'mf1:';

async function fetchJson(path) {
  const key = `${PREFIX}${path}`;
  let cached = memory.get(key);
  if (!cached) {
    try {
      cached = JSON.parse(sessionStorage.getItem(key) || 'null');
    } catch {
      cached = null;
    }
    if (cached) memory.set(key, cached);
  }

  const headers = new Headers({ accept: 'application/json' });
  if (cached?.etag) headers.set('If-None-Match', cached.etag);
  const response = await fetch(`${API}${path}`, { headers });
  if (response.status === 304 && cached) return cached.body;
  if (!response.ok) throw new Error(`make.fun API returned ${response.status}`);

  const body = await response.json();
  const next = { etag: response.headers.get('etag'), body };
  memory.set(key, next);
  try {
    sessionStorage.setItem(key, JSON.stringify(next));
  } catch {
    // Storage can be unavailable or full; in-memory caching still works.
  }
  return body;
}

export function getBounties() {
  return fetchJson('/competitions?status=open&activity=times');
}

export function getBounty(slug) {
  return fetchJson(`/competitions/${encodeURIComponent(slug)}`);
}

export function getLeaderboard(slug) {
  return fetchJson(`/competitions/${encodeURIComponent(slug)}/leaderboard`);
}

export function getProfile(handle) {
  return fetchJson(`/profiles/${encodeURIComponent(handle)}`);
}
