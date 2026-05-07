import React, { useState } from 'react';
import { shortenUrl, ShortenResult } from '../api.js';

interface Props {
  onResult: (data: ShortenResult) => void;
  onError: (msg: string) => void;
}

export default function ShortenForm({ onResult, onError }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    try {
      const data = await shortenUrl(url.trim());
      onResult(data);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        // eslint-disable-next-line url-shorty/no-hardcoded-urls
        placeholder="https://example.com/very/long/url"
        required
        style={{ flex: 1, padding: '8px 12px', fontSize: 16 }}
        data-testid="url-input"
      />
      <button type="submit" disabled={loading} data-testid="shorten-btn">
        {loading ? '...' : 'Shorten'}
      </button>
    </form>
  );
}
