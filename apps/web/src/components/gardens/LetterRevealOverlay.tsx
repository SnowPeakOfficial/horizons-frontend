/**
 * LetterRevealOverlay
 * Cinematic reveal sequence played when a letter is opened from an email link.
 *
 * Sequence:
 *  Phase 0 (0–2s)     — Big Horizons logo on light background (SakuraIntro style)
 *  Phase 1 (2–3.6s)   — Large envelope drops in
 *  Phase 2 (3.6–4.6s) — Flap opens, big petal burst falls down
 *  Phase 3 (4.6–5.1s) — Overlay fades out → onDone()
 */

import React, { useEffect, useState } from 'react';
import { typography } from '../../styles/typography';
import { theme } from '../../styles/theme';

interface LetterRevealOverlayProps {
  onDone: () => void;
}

// 24 particles for a full explosive burst
const PETALS = [
  '🌸','🌺','✨','🌷','💮','🌼','💫','🌸',
  '🌺','✨','🌸','🌷','🌼','💫','🌺','✨',
  '🌸','💮','🌷','🌼','🌺','✨','🌸','💫',
];

type Phase = 'logo' | 'envelope' | 'open' | 'fade';

// Build per-petal keyframes: downward-biased gravity, large distances
function buildPetalKeyframes(): string {
  return PETALS.map((_, i) => {
    const angle = (i / PETALS.length) * 360;
    const rad   = (angle * Math.PI) / 180;
    // Base horizontal/vertical travel
    const baseDist = 180 + (i % 5) * 30; // 180–300px
    const tx = Math.cos(rad) * baseDist;
    let ty = Math.sin(rad) * baseDist;
    // Gravity: add downward pull to all particles
    const gravityPull = 60 + (i % 4) * 20; // 60–120px extra downward
    ty += gravityPull;
    return `
      @keyframes lro-petal${i} {
        0%   { opacity:1; transform:translate(-50%,-50%) translate(0,0) scale(1.3); }
        60%  { opacity:0.85; }
        100% { opacity:0; transform:translate(-50%,-50%) translate(${tx}px,${ty}px) scale(0.2) rotate(${angle * 2}deg); }
      }
    `;
  }).join('');
}

export const LetterRevealOverlay: React.FC<LetterRevealOverlayProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<Phase>('logo');
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('envelope'), 2000);
    const t2 = setTimeout(() => setPhase('open'),     3600);
    const t3 = setTimeout(() => { setPhase('fade'); setFading(true); }, 4600);
    const t4 = setTimeout(() => onDone(), 5150);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <>
      <style>{`
        /* Logo */
        @keyframes lro-logoIn {
          from { opacity: 0; transform: translateY(16px) scale(0.94); }
          to   { opacity: 0.7; transform: translateY(0) scale(1); }
        }
        @keyframes lro-logoOut {
          from { opacity: 0.7; }
          to   { opacity: 0; }
        }
        /* Envelope drop with bounce */
        @keyframes lro-envDrop {
          0%   { opacity: 0; transform: translateY(-100px) scale(0.78); }
          55%  { transform: translateY(12px) scale(1.04); }
          75%  { transform: translateY(-6px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* Flap opens upward (3D perspective flip) */
        @keyframes lro-flapOpen {
          0%   { transform: perspective(600px) rotateX(0deg); }
          100% { transform: perspective(600px) rotateX(-160deg); }
        }
        /* Hint text */
        @keyframes lro-hintIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Petal keyframes */
        ${buildPetalKeyframes()}
      `}</style>

      {/* Backdrop — light, matching SakuraIntro */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'linear-gradient(180deg, #FDFCFA 0%, #FFF9F7 50%, #FFFFFF 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 0.5s ease' : undefined,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Subtle mesh gradient (same as SakuraIntro hero) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 30%, rgba(232,180,188,0.08) 0%, transparent 50%),
                       radial-gradient(circle at 80% 70%, rgba(197,169,208,0.06) 0%, transparent 50%)`,
          pointerEvents: 'none',
        }} />

        {/* ═══ PHASE 0 — Big logo (0–2s) ═══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: phase === 'logo'
              ? 'lro-logoIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards'
              : 'lro-logoOut 0.45s ease forwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 2.5vw, 40px)' }}>
            <img
              src="/images/horizons-logo.svg"
              alt="Horizons"
              style={{
                height: 'clamp(80px, 12vw, 140px)',
                width: 'auto',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
            <span
              style={{
                fontFamily: typography.fontFamily.serif,
                fontSize: 'clamp(80px, 12vw, 140px)',
                fontWeight: typography.fontWeight.medium,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                color: theme.text.tertiary,
                textShadow: '0 1px 3px rgba(0,0,0,0.08)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              HORIZONS
            </span>
          </div>
        </div>

        {/* ═══ PHASES 1 & 2 — Envelope ═══ */}
        {(phase === 'envelope' || phase === 'open') && (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'lro-envDrop 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}
          >
            {/* Envelope SVG */}
            <div style={{ position: 'relative', width: '340px', height: '240px' }}>
              <svg
                width="340"
                height="240"
                viewBox="0 0 340 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                <defs>
                  <filter id="lro-envShadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="6" stdDeviation="16" floodColor="#C09090" floodOpacity="0.18" />
                  </filter>
                  <filter id="lro-flapShadow" x="-5%" y="-5%" width="110%" height="120%">
                    <feDropShadow dx="0" dy="3" stdDeviation="7" floodColor="#C09090" floodOpacity="0.12" />
                  </filter>
                  <linearGradient id="lro-envBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFF8F0" />
                    <stop offset="100%" stopColor="#F5E8DC" />
                  </linearGradient>
                  <linearGradient id="lro-envFlap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.colors.rose[400]} />
                    <stop offset="100%" stopColor={theme.colors.rose[600]} />
                  </linearGradient>
                </defs>

                {/* Envelope body */}
                <rect
                  x="10" y="85" width="320" height="145" rx="8"
                  fill="url(#lro-envBody)"
                  stroke={theme.colors.rose[200]}
                  strokeWidth="1.5"
                  filter="url(#lro-envShadow)"
                />

                {/* Inner diagonal fold lines */}
                <line x1="10" y1="230" x2="170" y2="158" stroke={theme.colors.rose[200]} strokeWidth="1" opacity="0.6" />
                <line x1="330" y1="230" x2="170" y2="158" stroke={theme.colors.rose[200]} strokeWidth="1" opacity="0.6" />

                {/* Envelope flap */}
                <g
                  style={phase === 'open' ? {
                    animation: 'lro-flapOpen 0.55s cubic-bezier(0.4,0,0.2,1) forwards',
                    transformOrigin: '170px 85px',
                  } : {}}
                  filter="url(#lro-flapShadow)"
                >
                  <path
                    d="M10 85 L170 165 L330 85 Z"
                    fill="url(#lro-envFlap)"
                    stroke={theme.colors.rose[300]}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  {/* Wax seal */}
                  <circle cx="170" cy="122" r="20" fill={theme.colors.rose[600]} stroke={theme.colors.rose[300]} strokeWidth="1.5" />
                  <circle cx="170" cy="122" r="14" fill={theme.colors.rose[700]} />
                  <text
                    x="170" y="127"
                    textAnchor="middle"
                    fontFamily="Georgia, serif"
                    fontSize="15"
                    fontWeight="bold"
                    fill="rgba(255,230,235,0.95)"
                  >H</text>
                </g>
              </svg>

              {/* Petal burst from envelope center */}
              {phase === 'open' && (
                <div style={{ position: 'absolute', top: '45%', left: '50%' }}>
                  {PETALS.map((petal, i) => (
                    <span
                      key={i}
                      style={{
                        position: 'absolute',
                        fontSize: `${24 + (i % 5) * 8}px`, // 24–56px
                        top: 0,
                        left: 0,
                        transform: 'translate(-50%,-50%)',
                        display: 'block',
                        animation: `lro-petal${i} 1.2s ease-out ${i * 30}ms forwards`,
                      } as React.CSSProperties}
                    >
                      {petal}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Hint text */}
            <div
              style={{
                marginTop: '24px',
                fontFamily: typography.fontFamily.serif,
                fontSize: '16px',
                color: theme.text.tertiary,
                letterSpacing: '0.06em',
                animation: 'lro-hintIn 0.6s ease-out 0.3s forwards',
                opacity: 0,
              }}
            >
              {phase === 'envelope' ? 'A letter is waiting for you…' : ''}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
