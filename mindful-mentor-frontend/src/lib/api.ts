export type Journal = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood_tag: string | null;
  created_at: string;
  embedded?: boolean;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function createJournal(params: {
  userId: string;
  title?: string;
  content: string;
  moodTag?: string;
}): Promise<Journal> {
  return api<Journal>('/api/journals', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function listJournals(userId: string, limit = 50): Promise<{ items: Journal[] }> {
  const q = new URLSearchParams({ userId, limit: String(limit) }).toString();
  return api<{ items: Journal[] }>(`/api/journals?${q}`);
}
