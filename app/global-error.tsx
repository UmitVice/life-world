'use client';

import React from 'react';

/**
 * Root-level error boundary. Renders inside <body> when the entire app
 * (including the root layout) crashes. Per Next.js docs it must include
 * <html> and <body> tags. Keep the markup self-contained — no shared
 * layout, no session/theme providers.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Root error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          background: '#0f172a',
          color: '#f1f5f9',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: '100%',
            background: '#1e293b',
            padding: 32,
            borderRadius: 16,
            border: '1px solid #334155',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 24, marginBottom: 12, marginTop: 0 }}>
            Application error
          </h2>
          <p
            style={{
              fontSize: 14,
              color: '#cbd5e1',
              marginBottom: 16,
            }}
          >
            A fatal error occurred. Reloading may resolve the issue.
          </p>
          {error?.message && (
            <pre
              style={{
                textAlign: 'left',
                fontSize: 12,
                background: '#0f172a',
                color: '#cbd5e1',
                padding: 12,
                borderRadius: 8,
                overflow: 'auto',
                marginBottom: 20,
                maxHeight: 200,
                whiteSpace: 'pre-wrap',
              }}
            >
              {error.message}
              {error.digest ? `\n\ndigest: ${error.digest}` : ''}
            </pre>
          )}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: '#10b981',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
