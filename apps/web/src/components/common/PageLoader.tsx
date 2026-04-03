/**
 * PageLoader — shown by Suspense while a lazy route chunk is downloading.
 * Kept in its own file to satisfy the fast-refresh ESLint rule.
 */

import React from 'react';

export const PageLoader: React.FC = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #FDFCFA 0%, #FFF9F7 50%, #FFFFFF 100%)',
  }}>
    <img
      src="/images/horizons-logo-wordmark.svg"
      alt="Horizons"
      style={{
        height: 'clamp(72px, 10vw, 120px)',
        width: 'auto',
        opacity: 0.55,
      }}
    />
  </div>
);
