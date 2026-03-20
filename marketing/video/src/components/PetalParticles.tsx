import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLOR } from '../constants';

interface Petal {
  x: number; // 0–1920
  startY: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  hue: string;
}

const PETALS: Petal[] = [
  { x: 200,  startY: -40,  size: 18, speed: 1.2, drift: 30,  opacity: 0.55, hue: COLOR.roseSoft },
  { x: 450,  startY: -80,  size: 12, speed: 0.9, drift: -20, opacity: 0.40, hue: COLOR.lavender },
  { x: 700,  startY: -20,  size: 22, speed: 1.5, drift: 40,  opacity: 0.50, hue: COLOR.roseSoft },
  { x: 960,  startY: -60,  size: 14, speed: 1.0, drift: -30, opacity: 0.45, hue: COLOR.rose },
  { x: 1200, startY: -30,  size: 20, speed: 1.3, drift: 25,  opacity: 0.55, hue: COLOR.lavender },
  { x: 1450, startY: -90,  size: 10, speed: 0.8, drift: -15, opacity: 0.35, hue: COLOR.roseSoft },
  { x: 1700, startY: -50,  size: 16, speed: 1.1, drift: 35,  opacity: 0.48, hue: COLOR.rose },
  { x: 320,  startY: -110, size: 24, speed: 1.4, drift: -40, opacity: 0.42, hue: COLOR.lavender },
  { x: 850,  startY: -70,  size: 11, speed: 0.95,drift: 20,  opacity: 0.38, hue: COLOR.roseSoft },
  { x: 1550, startY: -25,  size: 19, speed: 1.25,drift: -25, opacity: 0.52, hue: COLOR.rose },
];

interface PetalParticlesProps {
  intensity?: number; // 0–1 multiplier for opacity
}

export const PetalParticles: React.FC<PetalParticlesProps> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {PETALS.map((p, i) => {
        const t = (frame * p.speed + i * 80) % 1200;
        const y = p.startY + t * 0.75;
        const x = p.x + Math.sin(frame * 0.02 + i) * p.drift;
        const rotate = frame * (i % 2 === 0 ? 1.2 : -0.8) + i * 45;
        const fadeOut = interpolate(y, [900, 1140], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size,
              height: p.size * 0.6,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: p.hue,
              opacity: p.opacity * intensity * fadeOut,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};
