/**
 * IntroSlide — bridge between Problem and Sakura (~2.5s / 75 frames)
 * Same dark plum background — cross-dissolves seamlessly FROM the Problem scene.
 * Centers on: "There's a better way." + logo icon teaser.
 *
 * Transitions: fades IN over the Problem scene (no dip to black).
 * HorizonsPromo overlaps SakuraOpenerScene on top for the out-transition.
 */
import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ASSETS, COLOR, FONT } from '../constants';

export const IntroSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade IN — dissolves over Problem scene (both are dark plum, seamless)
  const sceneIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });


  // Main text springs in
  const textSp = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 20, stiffness: 65 } });
  const textOpacity = interpolate(frame, [8, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textY = interpolate(textSp, [0, 1], [22, 0]);

  // Logo icon fades in after text (~35f)
  const iconOpacity = interpolate(frame, [35, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const iconSp = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 18, stiffness: 55 } });
  const iconScale = interpolate(iconSp, [0, 1], [0.7, 1]);

  // Thin decorative line under text
  const lineWidth = interpolate(frame, [22, 48], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: COLOR.bgDark,
        // Only fade IN — SakuraOpenerScene layers on top for out-dissolve
        opacity: sceneIn,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        gap: 24,
      }}
    >
      {/* Same blurred hydrangea as ProblemScene — identical bg */}
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

      {/* Same vignette as ProblemScene */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,6,14,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main line */}
      <p
        style={{
          fontFamily: FONT.serif,
          fontSize: 72,
          fontWeight: 300,
          fontStyle: 'italic',
          color: COLOR.textOnDark,
          letterSpacing: '-0.01em',
          margin: 0,
          textAlign: 'center',
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        There's a better way.
      </p>

      {/* Thin rose rule */}
      <div
        style={{
          width: lineWidth,
          height: 1,
          background: COLOR.rose600,
          opacity: textOpacity * 0.7,
        }}
      />

      {/* Logo icon teaser */}
      <div
        style={{
          opacity: iconOpacity,
          transform: `scale(${iconScale})`,
          marginTop: 8,
        }}
      >
        <img
          src={staticFile(ASSETS.logoIcon)}
          alt="Horizons"
          style={{
            height: 52,
            width: 'auto',
            filter: 'brightness(0) invert(1)',
            opacity: 0.5,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
