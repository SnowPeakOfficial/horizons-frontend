import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR } from '../constants';
import { SlideUp } from '../components/SlideUp';
import { PetalParticles } from '../components/PetalParticles';

export const FlowerRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const imgScale = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 55 } });
  const imgOpacity = interpolate(frame, [10, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const glowPulse = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1], [0.8, 1.1]
  );

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: `linear-gradient(160deg, #FDFCFA 0%, #FFF5F6 55%, #FDF9FF 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: bgOpacity,
    }}>
      {/* Soft glow behind flower */}
      <div style={{
        position: 'absolute',
        width: 700, height: 700,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(232,180,184,${0.22 * glowPulse}) 0%, transparent 70%)`,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />
      <div style={{
        position: 'absolute',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(197,169,208,0.14) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />

      <PetalParticles intensity={0.7} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, position: 'relative', zIndex: 2 }}>
        {/* Flower image */}
        <div style={{
          transform: `scale(${interpolate(imgScale, [0, 1], [0.6, 1])})`,
          opacity: imgOpacity,
        }}>
          <img
            src="../../apps/web/public/images/Default_A_delicate_intricately_detailed_3D_hydrangea_blooms_ag_1_5608c5bf-c46a-46b8-b9a4-6f3a3aeb05dc_0.png"
            alt="Horizons flower"
            style={{
              width: 480,
              height: 'auto',
              filter: 'drop-shadow(0 0 40px rgba(212,112,126,0.35))',
            }}
          />
        </div>

        <SlideUp delay={50}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            fontStyle: 'italic',
            color: COLOR.muted,
            margin: 0,
            textAlign: 'center',
            letterSpacing: '0.03em',
          }}>
            Plant memories as flowers.<br />
            <span style={{ color: COLOR.rose }}>Return to them when you're ready.</span>
          </p>
        </SlideUp>
      </div>
    </div>
  );
};
