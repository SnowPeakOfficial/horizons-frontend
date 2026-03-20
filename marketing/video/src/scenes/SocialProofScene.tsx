/**
 * Scene 6: Social Proof Quote (3s)
 * Authentic founder copy from the web app landing page.
 * Quote stands completely alone — no attribution.
 */
import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ASSETS, COLOR, FONT } from '../constants';

export const SocialProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const sceneOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const quoteOpacity = interpolate(frame, [12, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const quoteY = interpolate(
    spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 20, stiffness: 60 } }),
    [0, 1], [28, 0]
  );

  const markOpacity = interpolate(frame, [6, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: COLOR.bgGradient,
        opacity: sceneIn * sceneOut,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Radial glow mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 30%, ${COLOR.glowRose} 0%, transparent 55%),
                       radial-gradient(circle at 80% 70%, ${COLOR.glowLavender} 0%, transparent 55%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Blurred flower — soft atmosphere */}
      <div
        style={{
          position: 'absolute',
          left: -200,
          bottom: -100,
          opacity: 0.12,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      >
        <img
          src={staticFile(ASSETS.peony)}
          alt=""
          style={{ width: 700, height: 'auto' }}
        />
      </div>

      {/* Quote content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: 860,
          padding: '0 80px',
        }}
      >
        {/* Opening quotation mark */}
        <div
          style={{
            fontFamily: FONT.serif,
            fontSize: 120,
            lineHeight: 0.4,
            color: COLOR.rose500,
            opacity: markOpacity * 0.45,
            marginBottom: 20,
          }}
        >
          "
        </div>

        {/* Authentic founder quote from the web app */}
        <p
          style={{
            fontFamily: FONT.serif,
            fontSize: 52,
            fontWeight: 300,
            fontStyle: 'italic',
            color: COLOR.textPrimary,
            lineHeight: 1.5,
            margin: 0,
            letterSpacing: '-0.01em',
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
          }}
        >
          We built this because we kept
          <br />
          losing things. Not physical things —
          <br />
          but moments that mattered.
        </p>
      </div>
    </AbsoluteFill>
  );
};
