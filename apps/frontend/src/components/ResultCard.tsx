import React, { useState } from 'react';
import { ShortenResult } from '../api.js';

interface Props {
  result: ShortenResult;
}

export default function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ marginTop: 24, padding: 16, border: '1px solid #ccc', borderRadius: 6 }}>
      <p style={{ margin: '0 0 8px' }}>Short URL:</p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <a href={result.shortUrl} target="_blank" rel="noreferrer" data-testid="short-url">
          {result.shortUrl}
        </a>
        <button onClick={copy} data-testid="copy-btn">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
