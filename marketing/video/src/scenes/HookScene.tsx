import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLOR } from '../constants';
import { SlideUp } from '../components/SlideUp';
import { PetalParticles } from '../components/PetalParticles';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const glowScale = interpolate(frame, [0, 180], [0.8, 1.15], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: `linear-gradient(160deg, #1A1218 0%, #2A1B24 60%, #1E1420 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: bgOpacity,
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        width: 1000, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(197,169,208,0.12) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${glowScale})`,
      }} />

      <PetalParticles intensity={0.35} />

      <div style={{ textAlign: 'center', padding: '0 160px', position: 'relative', zIndex: 2 }}>
        <SlideUp delay={10}>
          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 88,
            fontWeight: 300,
            color: COLOR.white,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            Some moments<br />deserve to last
          </h1>
        </SlideUp>
        <SlideUp delay={35}>
          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 88,
            fontWeight: 300,
            fontStyle: 'italic',
            color: COLOR.roseSoft,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 40px',
          }}>
            forever.
          </h1>
        </SlideUp>
        <SlideUp delay={70}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 24,
            fontStyle: 'italic',
            color: `rgba(232,180,184,0.65)`,
            margin: 0,
            letterSpacing: '0.05em',
          }}>
            Horizons gives them a place to live.
          </p>
        </SlideUp>
      </div>
    </div>
  );
};
