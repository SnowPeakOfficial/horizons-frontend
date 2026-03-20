/**
 * Scene 2: Sakura Brand Reveal (~4s / 120 frames)
 * sakura-blast.mp4 on black. Logo springs in, tagline fades in below.
 * NO "Introducing Horizons" text — just the wordmark and tagline.
 *
 * Transitions: fades IN over IntroSlide (dark→dark is seamless).
 * HorizonsPromo overlaps FeatureScene on top for the out-dissolve (dark→cream).
 */
import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from 'remotion';
import { ASSETS, COLOR, FONT } from '../constants';

export const SakuraOpenerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade IN — cross-dissolves over IntroSlide
  const sceneIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Logo: spring from 0.15 → 1.0 scale
  const logoSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 16, stiffness: 38, mass: 1.1 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.15, 1.0]);
  const logoOpacity = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });

  // Tagline fades in after logo settles (~45f) — give it time to be read
  const taglineOpacity = interpolate(frame, [45, 68], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const taglineY = interpolate(
    spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 22, stiffness: 65 } }),
    [0, 1], [14, 0]
  );

  // Thin separator line
  const lineOpacity = interpolate(frame, [38, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Sakura video dims as content comes in
  const videoOpacity = interpolate(
    frame,
    [0, 60, 120],
    [0.85, 0.35, 0.12],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: '#000000',
        // Only fade IN — FeatureScene layers on top for out-dissolve
        opacity: sceneIn,
        overflow: 'hidden',
      }}
    >
      {/* Sakura video */}
      <AbsoluteFill style={{ opacity: videoOpacity }}>
        <Video
          src={staticFile(ASSETS.sakuraVideo)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Centered content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {/* Logo wordmark — springs in */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            transformOrigin: 'center center',
            opacity: logoOpacity,
          }}
        >
          <img
            src={staticFile(ASSETS.logoWordmark)}
            alt="Horizons"
            style={{
              height: 150,
              width: 'auto',
              filter: 'brightness(0) invert(1)',
              opacity: 0.95,
            }}
          />
        </div>

        {/* Thin separator */}
        <div
          style={{
            width: 40,
            height: 1,
            background: COLOR.rose500,
            opacity: lineOpacity * 0.6,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: FONT.serif,
            fontSize: 22,
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(240, 232, 240, 0.70)',
            letterSpacing: '0.07em',
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            textAlign: 'center',
          }}
        >
          A private garden for the moments that matter
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
