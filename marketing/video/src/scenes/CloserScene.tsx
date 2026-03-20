import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR } from '../constants';
import { SlideUp } from '../components/SlideUp';
import { PetalParticles } from '../components/PetalParticles';

export const CloserScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const logoScale = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 55 } });

  // Fade out at end
  const endFade = interpolate(frame, [durationInFrames - 45, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const glowPulse = 0.15 + 0.07 * Math.sin(frame * 0.04);

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: `linear-gradient(160deg, ${COLOR.bgDark} 0%, #2A1B24 50%, #1A1218 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: bgOpacity * endFade,
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', width: 900, height: 900, borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(232,180,184,${glowPulse}) 0%, transparent 70%)`,
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(197,169,208,0.10) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      }} />

      <PetalParticles intensity={0.8} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 32, position: 'relative', zIndex: 2, textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          transform: `scale(${interpolate(logoScale, [0, 1], [0.75, 1])})`,
          opacity: interpolate(frame, [10, 35], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          <img
            src="../../apps/web/public/images/horizons-logo-wordmark.svg"
            alt="Horizons"
            style={{ width: 300, opacity: 0.92 }}
          />
        </div>

        <SlideUp delay={30}>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: 28, color: 'rgba(232,180,184,0.70)',
            margin: 0, letterSpacing: '0.04em',
          }}>
            Your private garden of memories.
          </p>
        </SlideUp>

        <SlideUp delay={55}>
          <div style={{
            marginTop: 16,
            padding: '18px 52px',
            border: '1px solid rgba(232,180,184,0.30)',
            borderRadius: 60,
            background: 'rgba(232,180,184,0.07)',
            backdropFilter: 'blur(8px)',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 400,
              color: 'rgba(255,255,255,0.85)', margin: 0, letterSpacing: '0.06em',
            }}>
              horizons-garden.com
            </p>
          </div>
        </SlideUp>

        <SlideUp delay={75}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 13,
            color: 'rgba(232,180,184,0.45)', margin: 0, letterSpacing: '0.08em',
          }}>
            Free to start &nbsp;·&nbsp; Pro from $4.99 / mo CAD &nbsp;·&nbsp; Cancel anytime
          </p>
        </SlideUp>
      </div>
    </div>
  );
};
