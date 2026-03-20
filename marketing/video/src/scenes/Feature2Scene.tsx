import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLOR } from '../constants';
import { SlideUp } from '../components/SlideUp';
import { FadeIn } from '../components/FadeIn';
import { PetalParticles } from '../components/PetalParticles';

export const Feature2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: 'linear-gradient(160deg, #1E1420 0%, #1A1218 50%, #221528 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', opacity: bgOpacity,
    }}>
      <div style={{
        position: 'absolute', width: 900, height: 500, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(197,169,208,0.10) 0%, transparent 70%)',
        top: '50%', left: '70%', transform: 'translate(-50%, -50%)',
      }} />
      <PetalParticles intensity={0.35} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 100,
        padding: '0 120px', position: 'relative', zIndex: 2,
      }}>
        {/* Text left */}
        <div style={{ flex: 1 }}>
          <SlideUp delay={8}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.20em', textTransform: 'uppercase',
              color: COLOR.lavender, margin: '0 0 20px',
            }}>Private by design</p>
          </SlideUp>
          <SlideUp delay={20}>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontSize: 64, fontWeight: 300,
              color: COLOR.white, lineHeight: 1.2, letterSpacing: '-0.01em',
              margin: '0 0 28px',
            }}>
              No feeds.<br />No likes.<br />No one enters uninvited.
            </h2>
          </SlideUp>
          <SlideUp delay={45}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 300,
              color: 'rgba(197,169,208,0.65)', lineHeight: 1.65, margin: 0,
            }}>
              Your garden is yours alone.<br />Invite only the people who matter,<br />or keep it entirely to yourself.
            </p>
          </SlideUp>
        </div>

        {/* Flower image right */}
        <FadeIn delay={15} duration={40}>
          <img
            src="../../apps/web/public/images/Default_A_delicately_rendered_3D_glassmorphism_flower_radiates_1_700f987d-038b-4bb7-bdff-feeaa85be7dc_0 1.png"
            alt="Flower"
            style={{
              width: 380, height: 'auto', flexShrink: 0,
              filter: 'drop-shadow(0 0 30px rgba(197,169,208,0.40))',
            }}
          />
        </FadeIn>
      </div>
    </div>
  );
};
