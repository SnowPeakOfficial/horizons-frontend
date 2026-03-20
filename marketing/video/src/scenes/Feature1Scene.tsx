import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLOR } from '../constants';
import { SlideUp } from '../components/SlideUp';
import { FadeIn } from '../components/FadeIn';
import { PetalParticles } from '../components/PetalParticles';

export const Feature1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: 'linear-gradient(140deg, #1A1218 0%, #231620 60%, #2A1B24 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', opacity: bgOpacity,
    }}>
      <div style={{
        position: 'absolute', width: 900, height: 500, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(232,180,184,0.10) 0%, transparent 70%)',
        top: '50%', left: '30%', transform: 'translate(-50%, -50%)',
      }} />
      <PetalParticles intensity={0.45} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 100,
        padding: '0 120px', position: 'relative', zIndex: 2,
      }}>
        {/* Flower image left */}
        <FadeIn delay={15} duration={40}>
          <img
            src="../../apps/web/public/images/Default_A_delicate_translucent_3D_peony_depicted_in_a_sleek_gl_1_ea84b303-9941-4a01-a727-b0366c3d4aa6_0.png"
            alt="Flower"
            style={{
              width: 380, height: 'auto', flexShrink: 0,
              filter: 'drop-shadow(0 0 30px rgba(212,112,126,0.40))',
            }}
          />
        </FadeIn>

        {/* Text right */}
        <div>
          <SlideUp delay={8}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.20em', textTransform: 'uppercase',
              color: COLOR.rose, margin: '0 0 20px',
            }}>For loved ones</p>
          </SlideUp>
          <SlideUp delay={20}>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontSize: 64, fontWeight: 300,
              color: COLOR.white, lineHeight: 1.2, letterSpacing: '-0.01em',
              margin: '0 0 28px',
            }}>
              Send a memory<br />sealed inside<br />a flower
            </h2>
          </SlideUp>
          <SlideUp delay={45}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 300,
              color: 'rgba(232,180,184,0.65)', lineHeight: 1.65, margin: 0,
            }}>
              Attach a letter, photo, voice note,<br />or video. Your recipient opens it<br />like unwrapping something rare.
            </p>
          </SlideUp>
        </div>
      </div>
    </div>
  );
};
