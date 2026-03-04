/**
 * LetterRevealOverlay
 * Cinematic reveal sequence played when a letter is opened from an email link.
 *
 * Sequence:
 *  Phase 0 (0–1.4s)   — Horizons logo fades in
 *  Phase 1 (1.4–2.8s) — Gift box drops in, ribbon unties
 *  Phase 2 (2.8–3.4s) — Box lid flips open, petals burst out
 *  Phase 3 (3.4–3.8s) — Overlay fades away → onDone() called
 */

import React, { useEffect, useState } from 'react';

interface LetterRevealOverlayProps {
  /** Called when the animation finishes and the overlay has faded out */
  onDone: () => void;
}

// ─── Petal burst helpers ────────────────────────────────────────────────────

const PETALS = ['🌸', '🌺', '✨', '🌷', '💮', '🌼', '💫', '🌸', '🌺', '✨'];

// ─── Component ───────────────────────────────────────────────────────────────

type Phase = 'logo' | 'gift' | 'open' | 'fade';

export const LetterRevealOverlay: React.FC<LetterRevealOverlayProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<Phase>('logo');
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('gift'), 1400);
    const t2 = setTimeout(() => setPhase('open'), 2800);
    const t3 = setTimeout(() => {
      setPhase('fade');
      setOverlayOpacity(0);
    }, 3400);
    const t4 = setTimeout(() => onDone(), 3850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onDone]);

  return (
    <>
      {/* ── Keyframe definitions ── */}
      <style>{`
        @keyframes logoFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes giftDrop {
          0%   { opacity: 0; transform: translateY(-60px) scale(0.85); }
          60%  { transform: translateY(6px)   scale(1.04); }
          80%  { transform: translateY(-3px)  scale(0.98); }
          100% { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes ribbonUnwrap {
          0%   { stroke-dashoffset: 300; opacity: 0.9; }
          100% { stroke-dashoffset: 0;   opacity: 0;   }
        }
        @keyframes lidFlip {
          0%   { transform: perspective(300px) rotateX(0deg)   translateY(0);    }
          100% { transform: perspective(300px) rotateX(-110deg) translateY(-20px); }
        }
        @keyframes overlayFade {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        ${PETALS.map((_, i) => {
          const angle = (i / PETALS.length) * 360;
          const distance = 80 + (i % 3) * 25;
          const rad = (angle * Math.PI) / 180;
          const tx = Math.cos(rad) * distance;
          const ty = Math.sin(rad) * distance;
          return `
            @keyframes petalBurst${i} {
              0%   { opacity:1; transform: translate(-50%,-50%) translate(0,0) scale(1); }
              100% { opacity:0; transform: translate(-50%,-50%) translate(${tx}px,${ty}px) scale(0.4) rotate(${angle}deg); }
            }
          `;
        }).join('')}
      `}</style>

      {/* ── Overlay backdrop ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'linear-gradient(160deg, #1a0a10 0%, #2d1020 50%, #1a0814 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          opacity: overlayOpacity,
          transition: overlayOpacity === 0 ? 'opacity 0.45s ease' : undefined,
          pointerEvents: 'none',
        }}
      >
        {/* ── Logo ── */}
        {(phase === 'logo' || phase === 'gift' || phase === 'open') && (
          <div
            style={{
              animation: 'logoFadeIn 0.7s ease-out forwards',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <img
              src="/images/horizons-logo.svg"
              alt="Horizons"
              style={{ width: '72px', height: '72px', filter: 'brightness(1.1)' }}
            />
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '15px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(255,220,230,0.75)',
                fontWeight: 400,
              }}
            >
              HORIZONS
            </div>
          </div>
        )}

        {/* ── Gift box ── */}
        {(phase === 'gift' || phase === 'open') && (
          <div
            style={{
              position: 'relative',
              animation: 'giftDrop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* SVG gift box */}
            <svg
              width="120"
              height="130"
              viewBox="0 0 120 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Box body */}
              <rect x="10" y="55" width="100" height="70" rx="4" fill="#B5304E" />
              <rect x="10" y="55" width="100" height="70" rx="4" stroke="#D4909A" strokeWidth="1.5" />

              {/* Box lid */}
              <g style={phase === 'open' ? { animation: 'lidFlip 0.45s ease-in forwards', transformOrigin: '60px 55px' } : {}}>
                <rect x="5" y="38" width="110" height="22" rx="4" fill="#C84060" />
                <rect x="5" y="38" width="110" height="22" rx="4" stroke="#D4909A" strokeWidth="1.5" />

                {/* Ribbon on lid */}
                <rect x="55" y="38" width="10" height="22" fill="#FFB8C8" />
                {/* Bow */}
                <ellipse cx="43" cy="40" rx="13" ry="8" fill="#FFB8C8" transform="rotate(-15 43 40)" />
                <ellipse cx="77" cy="40" rx="13" ry="8" fill="#FFB8C8" transform="rotate(15 77 40)" />
                <circle cx="60" cy="40" r="7" fill="#FF9EB5" />
              </g>

              {/* Vertical ribbon stripe on body */}
              <rect x="55" y="55" width="10" height="70" fill="#FF9EB5" opacity="0.7" />

              {/* Ribbon unwrap animation overlay */}
              {phase === 'gift' && (
                <>
                  <line
                    x1="60" y1="10" x2="60" y2="38"
                    stroke="#FFB8C8"
                    strokeWidth="4"
                    strokeDasharray="300"
                    strokeDashoffset="0"
                    style={{ animation: 'ribbonUnwrap 0.8s ease-out 0.15s forwards' }}
                  />
                  <line
                    x1="10" y1="49" x2="110" y2="49"
                    stroke="#FFB8C8"
                    strokeWidth="3"
                    strokeDasharray="300"
                    strokeDashoffset="0"
                    style={{ animation: 'ribbonUnwrap 0.8s ease-out 0.3s forwards' }}
                  />
                </>
              )}
            </svg>

            {/* Petal burst when box opens */}
            {phase === 'open' && (
              <div style={{ position: 'absolute', top: '30%', left: '50%' }}>
                {PETALS.map((petal, i) => (
                  <span
                    key={i}
                    style={{
                      position: 'absolute',
                      fontSize: `${16 + (i % 3) * 6}px`,
                      animation: `petalBurst${i} 0.65s ease-out forwards`,
                      top: 0,
                      left: 0,
                      transform: 'translate(-50%, -50%)',
                      display: 'block',
                    } as React.CSSProperties}
                  >
                    {petal}
                  </span>
                ))}
              </div>
            )}

            {/* Hint text */}
            {phase === 'gift' && (
              <div
                style={{
                  marginTop: '20px',
                  fontFamily: 'Georgia, serif',
                  fontSize: '14px',
                  color: 'rgba(255,200,215,0.6)',
                  letterSpacing: '0.05em',
                  animation: 'logoFadeIn 0.5s ease-out forwards',
                }}
              >
                A letter is waiting for you…
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
