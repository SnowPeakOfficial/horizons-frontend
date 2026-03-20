/**
 * Scene 6: CTA Closer — warm cream, exact app aesthetic
 * Large hydrangea, logo, tagline, CTA pill, URL, pricing footnote
 */
import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ASSETS, COLOR, FONT } from '../constants';

export const CloserScene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // End fade — last 45 frames fade to white
  const endFade = interpolate(frame, [durationInFrames - 45, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Hydrangea drifts up slowly
  const flowerDrift = frame * 0.25;

  // Logo spring in
  const logoSpring = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 55 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.85, 1]);
  const logoOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const taglineOpacity = interpolate(frame, [35, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const taglineY = interpolate(
    spring({ frame: frame - 35, fps, config: { damping: 20, stiffness: 65 } }),
    [0, 1], [24, 0]
  );

  const ctaOpacity = interpolate(frame, [60, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ctaY = interpolate(
    spring({ frame: frame - 60, fps, config: { damping: 22, stiffness: 65 } }),
    [0, 1], [20, 0]
  );

  const footerOpacity = interpolate(frame, [90, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: COLOR.bgGradient,
        opacity: bgOpacity * endFade,
        overflow: 'hidden',
      }}
    >
      {/* Radial glow mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 30%, ${COLOR.glowRose} 0%, transparent 50%),
                       radial-gradient(circle at 80% 70%, ${COLOR.glowLavender} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      {/* EST. 2026 — top left */}
      <div
        style={{
          position: 'absolute',
          top: 88,
          left: 52,
          fontFamily: FONT.serif,
          fontSize: 18,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: COLOR.textTertiary,
          opacity: logoOpacity,
          zIndex: 10,
        }}
      >
        EST. 2026
      </div>

      {/* ✦ Private by design — top right */}
      <div
        style={{
          position: 'absolute',
          top: 88,
          right: 52,
          fontFamily: FONT.serif,
          fontSize: 18,
          letterSpacing: '0.1em',
          color: COLOR.textTertiary,
          opacity: logoOpacity,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ fontSize: 10, color: COLOR.rose400 }}>✦</span>
        <span>Private by design</span>
      </div>

      {/* Hydrangea — centered, slowly drifting upward */}
      <div
        style={{
          position: 'absolute',
          bottom: -flowerDrift - 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <img
          src={staticFile(ASSETS.hydrangea)}
          alt=""
          style={{
            width: 1200,
            height: 'auto',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)',
            opacity: 0.85,
          }}
        />
      </div>

      {/* Content overlay — centered */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 28,
          paddingBottom: 80,
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <img
            src={staticFile(ASSETS.logoWordmark)}
            alt="Horizons"
            style={{ height: 108, width: 'auto', opacity: 0.7 }}
          />
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: FONT.serif,
            fontSize: 28,
            fontStyle: 'italic',
            fontWeight: 300,
            color: COLOR.textSecondary,
            margin: 0,
            textAlign: 'center',
            letterSpacing: '0.02em',
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          A quiet place to keep
          <br />
          <span style={{ color: COLOR.rose600 }}>the moments you care about</span>
        </p>

        {/* CTA pill button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            marginTop: 8,
          }}
        >
          <div
            style={{
              padding: '20px 60px',
              background: `linear-gradient(135deg, ${COLOR.rose600} 0%, ${COLOR.rose700} 100%)`,
              borderRadius: 9999,
              fontFamily: FONT.sans,
              fontSize: 18,
              fontWeight: 500,
              color: '#fff',
              letterSpacing: '0.01em',
              boxShadow: '0 4px 0 rgba(0,0,0,0.12), 0 8px 24px rgba(212,144,154,0.30)',
            }}
          >
            Enter your garden
          </div>
        </div>

        {/* URL */}
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 16,
            fontWeight: 400,
            color: COLOR.textTertiary,
            margin: 0,
            letterSpacing: '0.06em',
            opacity: ctaOpacity,
          }}
        >
          horizons-garden.com
        </p>

        {/* Pricing footnote */}
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 13,
            color: COLOR.textTertiary,
            margin: 0,
            letterSpacing: '0.06em',
            opacity: footerOpacity * 0.65,
          }}
        >
          Free to start &nbsp;·&nbsp; Pro from $4.99 / mo CAD &nbsp;·&nbsp; Cancel anytime
        </p>
      </div>
    </AbsoluteFill>
  );
};
