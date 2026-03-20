import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR } from '../constants';
import { PetalParticles } from '../components/PetalParticles';

export const OpenerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 16, stiffness: 60 } });
  const logoOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const glowOpacity = interpolate(frame, [20, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: `linear-gradient(160deg, ${COLOR.bgDark} 0%, #2A1B24 50%, #1A1218 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 800, height: 800,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(212,112,126,${0.18 * glowOpacity}) 0%, transparent 70%)`,
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      }} />

      <PetalParticles intensity={0.5} />

      {/* Logo */}
      <div style={{
        transform: `scale(${interpolate(logoScale, [0, 1], [0.7, 1])})`,
        opacity: logoOpacity,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      }}>
        <img
          src="../../apps/web/public/images/horizons-logo-wordmark.svg"
          alt="Horizons"
          style={{ width: 360, opacity: 0.95 }}
        />
        <p style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: 22,
          color: `rgba(232,180,184,0.70)`,
          letterSpacing: '0.12em',
          margin: 0,
        }}>
          Your private garden of memories
        </p>
      </div>
    </div>
  );
};
