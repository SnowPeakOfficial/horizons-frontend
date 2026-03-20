/**
 * Scene 7: Feature Summary Cards (frames 735–840 / 3.5s)
 * Three glassmorphic feature cards spring in on cream bg.
 * Each card: icon glyph + bold label + one-line description.
 */
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR, FONT } from '../constants';

const CARDS = [
  {
    icon: '✦',
    iconColor: COLOR.rose600,
    label: 'Send a memory',
    description: 'Attach a letter, photo, voice note, or video inside any flower.',
  },
  {
    icon: '◈',
    iconColor: COLOR.lavender400,
    label: 'Private by design',
    description: 'No feeds. No likes. Your garden, your people, your rules.',
  },
  {
    icon: '◷',
    iconColor: COLOR.rose400,
    label: 'Bloom on any date',
    description: 'Schedule memories to open now, or years from now.',
  },
];

export const SummaryPillsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const sceneOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Header
  const headerOpacity = interpolate(frame, [5, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headerY = interpolate(
    spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 22, stiffness: 68 } }),
    [0, 1], [14, 0]
  );

  // Cards stagger by 20 frames each
  const cardAnims = CARDS.map((_, i) => {
    const startFrame = 20 + i * 20;
    const sp = spring({ frame: Math.max(0, frame - startFrame), fps, config: { damping: 18, stiffness: 62 } });
    return {
      opacity: interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
      y: interpolate(sp, [0, 1], [36, 0]),
      scale: interpolate(sp, [0, 1], [0.88, 1]),
    };
  });

  return (
    <AbsoluteFill
      style={{
        background: COLOR.bgGradient,
        opacity: sceneIn * sceneOut,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 52,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 25% 35%, ${COLOR.glowRose} 0%, transparent 55%),
                       radial-gradient(circle at 75% 65%, ${COLOR.glowLavender} 0%, transparent 55%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Section label */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: COLOR.rose600,
            margin: 0,
          }}
        >
          What Horizons gives you
        </p>
      </div>

      {/* Cards row */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'stretch',
          gap: 28,
        }}
      >
        {CARDS.map((card, i) => (
          <div
            key={i}
            style={{
              opacity: cardAnims[i].opacity,
              transform: `translateY(${cardAnims[i].y}px) scale(${cardAnims[i].scale})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 14,
              padding: '36px 40px',
              width: 340,
              background: 'rgba(255, 255, 255, 0.78)',
              borderRadius: 20,
              boxShadow: '0 2px 0 rgba(0,0,0,0.05), 0 12px 40px rgba(61,51,64,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
              backdropFilter: 'blur(16px)',
              border: `1px solid rgba(232, 180, 188, 0.22)`,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${card.iconColor}22 0%, ${card.iconColor}11 100%)`,
                border: `1px solid ${card.iconColor}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                color: card.iconColor,
                fontFamily: 'system-ui',
                lineHeight: 1,
              }}
            >
              {card.icon}
            </div>

            {/* Label */}
            <p
              style={{
                fontFamily: FONT.sans,
                fontSize: 20,
                fontWeight: 600,
                color: COLOR.textPrimary,
                margin: 0,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {card.label}
            </p>

            {/* Description */}
            <p
              style={{
                fontFamily: FONT.sans,
                fontSize: 15,
                fontWeight: 400,
                color: COLOR.textSecondary,
                margin: 0,
                lineHeight: 1.55,
                letterSpacing: '0.01em',
              }}
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
