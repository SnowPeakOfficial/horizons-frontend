import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLOR } from '../constants';
import { SlideUp } from '../components/SlideUp';
import { FadeIn } from '../components/FadeIn';
import { PetalParticles } from '../components/PetalParticles';

export const Feature3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Pulsing ring around flower
  const ringScale = 1 + 0.06 * Math.sin(frame * 0.08);
  const ringOpacity = 0.25 + 0.15 * Math.sin(frame * 0.08);

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: 'linear-gradient(140deg, #1A1218 0%, #1E1520 50%, #231822 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', opacity: bgOpacity,
    }}>
      <div style={{
        position: 'absolute', width: 900, height: 500, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(212,112,126,0.09) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      }} />
      <PetalParticles intensity={0.55} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 100,
        padding: '0 120px', position: 'relative', zIndex: 2,
      }}>
        {/* Flower with pulsing ring */}
        <FadeIn delay={15} duration={40}>
          <div style={{ position: 'relative', width: 380, flexShrink: 0 }}>
            {/* Pulsing ring */}
            <div style={{
              position: 'absolute', inset: -30,
              borderRadius: '50%',
              border: `2px solid rgba(232,180,184,${ringOpacity})`,
              transform: `scale(${ringScale})`,
            }} />
            <img
              src="../../apps/web/public/images/Default_A_mesmerizing_3D_illustration_of_a_delicate_cornflower_0_19deed4c-65ec-411d-8afd-76a72577a397_0.png"
              alt="Flower"
              style={{
                width: 380, height: 'auto',
                filter: 'drop-shadow(0 0 30px rgba(212,112,126,0.35))',
              }}
            />
          </div>
        </FadeIn>

        {/* Text right */}
        <div>
          <SlideUp delay={8}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.20em', textTransform: 'uppercase',
              color: COLOR.roseSoft, margin: '0 0 20px',
            }}>Time capsule</p>
          </SlideUp>
          <SlideUp delay={20}>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontSize: 64, fontWeight: 300,
              color: COLOR.white, lineHeight: 1.2, letterSpacing: '-0.01em',
              margin: '0 0 28px',
            }}>
              Set it to bloom<br />now, or years<br />from now.
            </h2>
          </SlideUp>
          <SlideUp delay={45}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 300,
              color: 'rgba(232,180,184,0.65)', lineHeight: 1.65, margin: 0,
            }}>
              Schedule a flower to open<br />on a birthday, an anniversary,<br />or the day everything changed.
            </p>
          </SlideUp>
        </div>
      </div>
    </div>
  );
};
