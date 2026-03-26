/**
 * CTAFinaleSceneV — portrait (1080×1920) variant of CTAFinaleScene.
 *
 * Same structure: logo top, headline below, URL, hydrangea rising from bottom.
 * Portrait gives abundant vertical space — the flower and text are well-separated
 * and the composition breathes nicely.
 *
 * Key adjustments vs landscape:
 * - Logo: 90px tall (vs 108px)
 * - Headline: 58px (vs 72px)
 * - URL: 26px (vs 28px)
 * - Hydrangea: 1200px wide (vs 1600px) — still dominant but fits the narrower frame
 * - paddingTop: 220px (more vertical room to push content down from top)
 */
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { ASSETS, COLOR, FONT } from '../constants';

export const CTAFinaleSceneV: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const fadeToWhite = interpolate(frame, [durationInFrames - 40, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoSp = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 18, stiffness: 50 } });
  const logoScale = interpolate(logoSp, [0, 1], [0.85, 1]);
  const logoOpacity = interpolate(frame, [5, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const headlineSp = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 20, stiffness: 55 } });
  const headlineOpacity = interpolate(frame, [28, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headlineY = interpolate(headlineSp, [0, 1], [30, 0]);

  const urlOpacity = interpolate(frame, [60, 78], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const urlY = interpolate(frame, [60, 78], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const flowerOpacity = interpolate(frame, [0, 35], [0, 1], { extrapolateRight: 'clamp' });
  // Subtle parallax — flower sits just below the URL and drifts gently upward
  const flowerY = interpolate(frame, [0, durationInFrames], [60, -20], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F7 50%, #FDFCFA 100%)',
        opacity: sceneIn,
        overflow: 'hidden',
      }}
    >
      {/* Radial glow mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 25%, rgba(232, 180, 188, 0.08) 0%, transparent 50%),
                       radial-gradient(circle at 80% 65%, rgba(197, 169, 208, 0.06) 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      {/* TOP SECTION: Logo + Headline + URL */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 36,
          zIndex: 2,
          padding: '220px 80px 0',
        }}
      >
        {/* Horizons wordmark */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            transformOrigin: 'center top',
            opacity: logoOpacity * 0.7,
          }}
        >
          <img
            src={staticFile(ASSETS.logoWordmark)}
            alt="Horizons"
            style={{
              height: 90,
              width: 'auto',
            }}
          />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: 58,
            fontWeight: 300,
            color: COLOR.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            margin: 0,
            textAlign: 'center',
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            textShadow: '0 1px 2px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          When you're ready,
          <br />
          your garden is waiting
        </h2>

        {/* URL */}
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 26,
            fontWeight: 500,
            color: COLOR.textSecondary,
            margin: 0,
            letterSpacing: '0.06em',
            opacity: urlOpacity,
            transform: `translateY(${urlY}px)`,
            textAlign: 'center',
          }}
        >
          www.horizons-garden.com
        </p>
      </div>

      {/* BOTTOM SECTION: Hydrangea — top of flower sits just below the URL */}
      <div
        style={{
          position: 'absolute',
          bottom: 700,
          left: '50%',
          transform: `translateX(-50%) translateY(${flowerY}px)`,
          opacity: flowerOpacity,
          zIndex: 1,
          pointerEvents: 'none',
          width: 1200,
        }}
      >
        <img
          src={staticFile(ASSETS.hydrangea)}
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 16%, black 82%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 16%, black 82%, transparent 100%)',
            filter: 'drop-shadow(0 16px 48px rgba(212, 144, 154, 0.25))',
          }}
        />
      </div>

      {/* White fade overlay */}
      <AbsoluteFill
        style={{
          background: '#FFFFFF',
          opacity: fadeToWhite,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </AbsoluteFill>
  );
};
