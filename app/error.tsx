'use client';

import React from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error('Global client error boundary caught:', error);
  return (
    <html>
      <body style={{ padding: 20, fontFamily: 'ui-sans-serif, system-ui, -apple-system' }}>
        <h2>Something went wrong</h2>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f1f5f9', padding: 12, borderRadius: 8 }}>
          {error?.message}
        </pre>
        <button onClick={() => reset()} style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: '#0ea5e9', color: 'white' }}>
          Try again
        </button>
      </body>
    </html>
  );
}


