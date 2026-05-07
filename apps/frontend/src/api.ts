const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export interface ShortenResult {
  code: string;
  shortUrl: string;
}

export interface StatsResult {
  code: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export async function shortenUrl(url: string): Promise<ShortenResult> {
  const res = await fetch(`${BASE}/api/v1/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<ShortenResult>;
}

export async function getStats(code: string): Promise<StatsResult> {
  const res = await fetch(`${BASE}/api/v1/stats/${code}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<StatsResult>;
}
