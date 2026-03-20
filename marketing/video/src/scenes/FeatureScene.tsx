/**
 * Reusable Feature Scene — cream/blush aesthetic matching the app exactly.
 * Used for all 3 feature moments (Send a memory, Private garden, Time capsule).
 */
import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR, FONT } from '../constants';

export interface FeatureSceneProps {
  label: string;
  labelColor: string;
  headline: string[];        // each string = one <br /> line
  description: string[];     // each string = one <br /> line
  flowerSrc: string;         // staticFile() path
  flowerSide: 'left' | 'right';
  glowColor: string;         // rgba string
}

export const FeatureScene: React.FC<FeatureSceneProps> = ({
  label,
  labelColor,
  headline,
  description,
  flowerSrc,
  flowerSide,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

  const flowerSpring = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 55 } });
  const flowerOpacity = interpolate(frame, [8, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flowerY = interpolate(flowerSpring, [0, 1], [40, 0]);

  const labelSpring = spring({ frame: frame - 5, fps, config: { damping: 22, stiffness: 70 } });
  const labelOpacity = interpolate(frame, [5, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const labelY = interpolate(labelSpring, [0, 1], [20, 0]);

  const headlineSpring = spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 60 } });
  const headlineOpacity = interpolate(frame, [18, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headlineY = interpolate(headlineSpring, [0, 1], [30, 0]);

  const descSpring = spring({ frame: frame - 38, fps, config: { damping: 22, stiffness: 65 } });
  const descOpacity = interpolate(frame, [38, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const descY = interpolate(descSpring, [0, 1], [20, 0]);

  // Subtle float on flower
  const floatY = Math.sin(frame * 0.04) * 8;

  const flowerEl = (
    <div
      style={{
        flexShrink: 0,
        opacity: flowerOpacity,
        transform: `translateY(${flowerY + floatY}px)`,
      }}
    >
      <img
        src={staticFile(flowerSrc)}
        alt=""
        style={{
          width: 460,
          height: 'auto',
          filter: `drop-shadow(0 0 32px ${glowColor}) drop-shadow(0 8px 24px rgba(61,51,64,0.08))`,
          userSelect: 'none',
        }}
      />
    </div>
  );

  const textEl = (
    <div style={{ flex: 1 }}>
      {/* Label */}
      <div
        style={{
          fontFamily: FONT.sans,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.20em',
          textTransform: 'uppercase' as const,
          color: labelColor,
          marginBottom: 18,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
        }}
      >
        {label}
      </div>

      {/* Thin rose rule under label */}
      <div
        style={{
          width: 32,
          height: 1,
          background: labelColor,
          marginBottom: 22,
          opacity: labelOpacity * 0.5,
        }}
      />

      {/* Headline */}
      <h2
        style={{
          fontFamily: FONT.serif,
          fontSize: 72,
          fontWeight: 300,
          color: COLOR.textPrimary,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          margin: '0 0 28px',
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        {headline.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < headline.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h2>

      {/* Description */}
      <p
        style={{
          fontFamily: FONT.sans,
          fontSize: 20,
          fontWeight: 300,
          color: COLOR.textSecondary,
          lineHeight: 1.75,
          margin: 0,
          opacity: descOpacity,
          transform: `translateY(${descY}px)`,
        }}
      >
        {description.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < description.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        background: COLOR.bgGradient,
        opacity: bgOpacity,
        overflow: 'hidden',
      }}
    >
      {/* Background glow mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 30%, ${COLOR.glowRose} 0%, transparent 50%),
                       radial-gradient(circle at 80% 70%, ${COLOR.glowLavender} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Accent glow on flower side */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${glowColor.replace('0.40', '0.08')} 0%, transparent 70%)`,
          top: '50%',
          [flowerSide === 'left' ? 'left' : 'right']: '15%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 100,
          padding: '0 120px',
          height: '100%',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {flowerSide === 'left' ? (
          <>
            {flowerEl}
            {textEl}
          </>
        ) : (
          <>
            {textEl}
            {flowerEl}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
