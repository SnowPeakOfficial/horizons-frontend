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

type Phase = 'logo' | 'envelope' | 'open' | 'fade';

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
            {/* Premium Envelope SVG */}
            <div style={{ position: 'relative', width: '400px', height: '280px' }}>
              <svg
                width="400"
                height="280"
                viewBox="0 0 400 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                <defs>
                  <filter id="lro-envShadow" x="-15%" y="-10%" width="130%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="22" floodColor="#B07070" floodOpacity="0.14" />
                  </filter>
                  <filter id="lro-flapShadow" x="-5%" y="-5%" width="115%" height="125%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#B07070" floodOpacity="0.10" />
                  </filter>
                  {/* Warm ivory paper — horizontal gradient for depth */}
                  <linearGradient id="lro-envBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="#FFFDF6" />
                    <stop offset="45%"  stopColor="#FFF6EA" />
                    <stop offset="100%" stopColor="#F8EBD8" />
                  </linearGradient>
                  {/* Dusty-rose flap */}
                  <linearGradient id="lro-envFlap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#E8A0B0" />
                    <stop offset="100%" stopColor="#C87090" />
                  </linearGradient>
                  {/* Gold accent for borders */}
                  <linearGradient id="lro-gold" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#D4A060" />
                    <stop offset="50%"  stopColor="#F0C880" />
                    <stop offset="100%" stopColor="#D4A060" />
                  </linearGradient>
                  {/* Wax seal radial */}
                  <radialGradient id="lro-seal" cx="50%" cy="35%" r="65%">
                    <stop offset="0%"   stopColor="#D4708A" />
                    <stop offset="100%" stopColor="#922048" />
                  </radialGradient>
                </defs>

                {/* ── Envelope body ── */}
                <rect
                  x="12" y="100" width="376" height="168" rx="10"
                  fill="url(#lro-envBody)"
                  filter="url(#lro-envShadow)"
                />
                {/* Gold border rule */}
                <rect
                  x="12" y="100" width="376" height="168" rx="10"
                  fill="none"
                  stroke="url(#lro-gold)"
                  strokeWidth="1.2"
                  opacity="0.7"
                />

                {/* Subtle horizontal paper lines (texture) */}
                {[130, 150, 170, 190, 210, 230, 250].map((y) => (
                  <line key={y} x1="28" y1={y} x2="372" y2={y}
                    stroke="#D4A06040" strokeWidth="0.5" />
                ))}

                {/* Inner decorative border */}
                <rect
                  x="22" y="110" width="356" height="148" rx="6"
                  fill="none"
                  stroke="#D4A06055"
                  strokeWidth="0.8"
                  strokeDasharray="4 3"
                />

                {/* Bottom inner V-fold lines */}
                <line x1="12"  y1="268" x2="200" y2="185" stroke="#C8A08060" strokeWidth="1" />
                <line x1="388" y1="268" x2="200" y2="185" stroke="#C8A08060" strokeWidth="1" />

                {/* Left & right side fold triangles (subtle) */}
                <path d="M12 100 L80 185 L12 268 Z" fill="#F0E4D0" opacity="0.45" />
                <path d="M388 100 L320 185 L388 268 Z" fill="#F0E4D0" opacity="0.45" />

                {/* ── Envelope flap ── */}
                <g
                  style={phase === 'open' ? {
                    animation: 'lro-flapOpen 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
                    transformOrigin: '200px 100px',
                  } : {}}
                  filter="url(#lro-flapShadow)"
                >
                  {/* Flap triangle */}
                  <path
                    d="M12 100 L200 196 L388 100 Z"
                    fill="url(#lro-envFlap)"
                    stroke="none"
                  />
                  {/* Gold edge on flap */}
                  <path
                    d="M12 100 L200 196 L388 100"
                    fill="none"
                    stroke="url(#lro-gold)"
                    strokeWidth="1.2"
                    opacity="0.6"
                    strokeLinejoin="round"
                  />

                  {/* ── Premium wax seal ── */}
                  {/* Outer ring */}
                  <circle cx="200" cy="145" r="28" fill="url(#lro-seal)" />
                  {/* Decorative ring */}
                  <circle cx="200" cy="145" r="24" fill="none" stroke="rgba(255,200,215,0.35)" strokeWidth="1.5" />
                  <circle cx="200" cy="145" r="20" fill="rgba(140,20,50,0.25)" />
                  {/* Rose petals — 5-petal SVG rose motif */}
                  {[0,72,144,216,288].map((deg, pi) => {
                    const rad = (deg * Math.PI) / 180;
                    const px = 200 + Math.cos(rad) * 9;
                    const py = 145 + Math.sin(rad) * 9;
                    return (
                      <ellipse
                        key={pi}
                        cx={px} cy={py}
                        rx="5.5" ry="3.5"
                        fill="rgba(255,210,220,0.75)"
                        transform={`rotate(${deg}, ${px}, ${py})`}
                      />
                    );
                  })}
                  {/* Centre dot */}
                  <circle cx="200" cy="145" r="4" fill="rgba(255,225,232,0.9)" />
                </g>
              </svg>
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
