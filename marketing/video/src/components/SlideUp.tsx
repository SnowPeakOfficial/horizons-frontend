import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface SlideUpProps {
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const SlideUp: React.FC<SlideUpProps> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1 },
  });

  const translateY = interpolate(progress, [0, 1], [60, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ transform: `translateY(${translateY}px)`, opacity, ...style }}>
      {children}
    </div>
  );
};
