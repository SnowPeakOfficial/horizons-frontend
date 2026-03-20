/**
 * Scene 8: CTA Finale (~3.5s / 105 frames)
 * Mirrors the web app's landing page final section exactly:
 *   - Horizons wordmark at the TOP (logo sits high, like the landing page hero)
 *   - Headline below it: "When you're ready, your garden is waiting"
 *   - Hydrangea rises from the bottom — large and dominant (same treatment as hero)
 *   - URL sits just above the flower peak — black text, fully readable
 *   - Fades to white at the very end
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

export const CTAFinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene fades in from cream (cross-dissolve from SummaryPills which is also cream)
  const sceneIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Final fade to white — last 40 frames
  const fadeToWhite = interpolate(frame, [durationInFrames - 40, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo springs in — top of frame
  const logoSp = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 18, stiffness: 50 } });
  const logoScale = interpolate(logoSp, [0, 1], [0.85, 1]);
  const logoOpacity = interpolate(frame, [5, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Headline fades and slides in below logo
  const headlineSp = spring({ frame: Math.max(0, frame - 28), fps, config: { damping: 20, stiffness: 55 } });
  const headlineOpacity = interpolate(frame, [28, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headlineY = interpolate(headlineSp, [0, 1], [30, 0]);

  // URL fades in after headline
  const urlOpacity = interpolate(frame, [55, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Hydrangea: starts below frame, drifts up slowly (parallax feel)
  const flowerOpacity = interpolate(frame, [0, 35], [0, 1], { extrapolateRight: 'clamp' });
  const flowerY = interpolate(frame, [0, durationInFrames], [80, -30], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F7 50%, #FDFCFA 100%)',
        opacity: sceneIn,
        overflow: 'hidden',
      }}
    >
      {/* Radial glow mesh — identical to landing page hero */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 30%, rgba(232, 180, 188, 0.08) 0%, transparent 50%),
                       radial-gradient(circle at 80% 70%, rgba(197, 169, 208, 0.06) 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── TOP SECTION: Logo + Headline ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 88,
          gap: 28,
          zIndex: 2,
        }}
      >
        {/* Horizons wordmark — same opacity as landing page hero (0.7) */}
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
              height: 108,
              width: 'auto',
            }}
          />
        </div>

        {/* Headline — authentic copy from landing page final CTA */}
        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: 72,
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
      </div>

      {/* ── BOTTOM SECTION: Hydrangea rising from bottom ── */}
      <div
        style={{
          position: 'absolute',
          bottom: -260,
          left: '50%',
          transform: `translateX(-50%) translateY(${flowerY}px)`,
          opacity: flowerOpacity,
          zIndex: 1,
          pointerEvents: 'none',
          width: 1600,
        }}
      >
        <img
          src={staticFile(ASSETS.hydrangea)}
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
            filter: 'drop-shadow(0 16px 48px rgba(212, 144, 154, 0.25))',
          }}
        />
      </div>

      {/* ── URL — floats just above the flower peak, black text ── */}
      <div
        style={{
          position: 'absolute',
          // sits roughly where the flower tip is in the mid-lower area
          bottom: 210,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 3,
          opacity: urlOpacity,
        }}
      >
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 17,
            fontWeight: 500,
            color: '#000000',
            margin: 0,
            letterSpacing: '0.07em',
          }}
        >
          www.horizons-garden.com
        </p>
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
