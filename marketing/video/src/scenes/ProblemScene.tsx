/**
 * Scene 1: The Problem (0–3.5s / 105 frames)
 * Dark warm plum background. Three problem lines appear one by one.
 * No logo, no brand — pure emotional hook before Horizons is revealed.
 *
 * Transition out: does NOT self-fade — HorizonsPromo overlaps the next scene
 * on top so we get a true cross-dissolve rather than a dip to dark.
 */
import React from 'react';
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ASSETS, COLOR, FONT } from '../constants';

const LINES = [
  'The photos stay in the camera roll.',
  'The letters never get sent.',
  'The moments just...disappear.',
];

const LINE_STAGGER = 28;
const LINE_FADE_DUR = 18;

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade IN from black at start
  const sceneIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  const lineOpacities = LINES.map((_, i) => {
    const startFrame = i * LINE_STAGGER + 8;
    return interpolate(frame, [startFrame, startFrame + LINE_FADE_DUR], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  });

  const lineY = LINES.map((_, i) => {
    const startFrame = i * LINE_STAGGER + 8;
    const progress = interpolate(frame, [startFrame, startFrame + LINE_FADE_DUR + 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return interpolate(progress, [0, 1], [18, 0]);
  });

  return (
    <AbsoluteFill
      style={{
        background: COLOR.bgDark,
        // Only fade IN — no self fade-out. HorizonsPromo layers IntroSlide on top
        // of this scene for the cross-dissolve so there's no black gap.
        opacity: sceneIn,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Very subtle blurred flower in BG for depth */}
      <div
        style={{
          position: 'absolute',
          right: -100,
          bottom: -120,
          opacity: 0.06,
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      >
        <img
          src={staticFile(ASSETS.hydrangea)}
          alt=""
          style={{ width: 800, height: 'auto' }}
        />
      </div>

      {/* Soft vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,6,14,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Problem lines */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          padding: '0 80px',
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        {LINES.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: FONT.serif,
              fontSize: i === 2 ? 54 : 58,
              fontWeight: 300,
              fontStyle: 'italic',
              color: i === 2 ? COLOR.rose500 : COLOR.textOnDark,
              lineHeight: 1.3,
              margin: 0,
              opacity: lineOpacities[i],
              transform: `translateY(${lineY[i]}px)`,
              letterSpacing: '-0.01em',
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </AbsoluteFill>
  );
};
