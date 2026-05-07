import React, { useState } from 'react';
import ShortenForm from './components/ShortenForm.js';
import ResultCard from './components/ResultCard.js';
import { ShortenResult } from './api.js';

export default function App() {
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleResult(data: ShortenResult) {
    setResult(data);
    setError(null);
  }

  function handleError(msg: string) {
    setError(msg);
    setResult(null);
  }

  return (
    <main style={{ maxWidth: 560, margin: '80px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h1>url-shorty</h1>
      <ShortenForm onResult={handleResult} onError={handleError} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <ResultCard result={result} />}
    </main>
  );
}
