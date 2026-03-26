/**
 * FeatureScene — editorial full-bleed layout.
 *
 * The flower IS the scene. It rises from the bottom at full scale (~960px),
 * luminous glow bloom behind it, soft top mask fading into the background.
 * Text is centered in the upper field — label, headline, description — never
 * competing with the flower. No card, no border, no box. Just atmosphere.
 *
 * Inspired by luxury fragrance / Apple product video frames.
 * Consistent layout across all 3 feature scenes — only flower + accent change.
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
import { COLOR, FONT } from '../constants';

export interface FeatureSceneProps {
  label: string;
  labelColor: string;
  headline: string[];    // each string = one line (keep to 2–3 lines)
  description: string[]; // each string = one line (keep to 2–3 lines)
  flowerSrc: string;     // staticFile() path
  glowColor: string;     // rgba — drives the atmospheric bloom + bg tint
}

export const FeatureScene: React.FC<FeatureSceneProps> = ({
  label,
  labelColor,
  headline,
  description,
  flowerSrc,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene fade-in ──────────────────────────────────────────────
  const sceneIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // ── Flower: rises slowly from bottom, blooms in ────────────────
  const flowerRise = interpolate(frame, [0, 90], [60, 0], { extrapolateRight: 'clamp' });
  const flowerOpacity = interpolate(frame, [5, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // No float — flower rises into position and holds still
  const floatY = 0;

  // ── Glow bloom: expands as flower rises ───────────────────────
  const bloomScale = interpolate(frame, [0, 80], [0.6, 1], { extrapolateRight: 'clamp' });
  const bloomOpacity = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

  // ── Label: fades + slides in early ────────────────────────────
  const labelSp = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 24, stiffness: 65 } });
  const labelOpacity = interpolate(frame, [18, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const labelY = interpolate(labelSp, [0, 1], [14, 0]);

  // ── Headline: springs in with weight ──────────────────────────
  const headlineSp = spring({ frame: Math.max(0, frame - 32), fps, config: { damping: 20, stiffness: 55 } });
  const headlineOpacity = interpolate(frame, [32, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineY = interpolate(headlineSp, [0, 1], [32, 0]);

  // ── Description: drifts in last ───────────────────────────────
  const descSp = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 22, stiffness: 60 } });
  const descOpacity = interpolate(frame, [55, 82], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const descY = interpolate(descSp, [0, 1], [18, 0]);

  // ── Thin accent rule under label ──────────────────────────────
  const ruleWidth = interpolate(frame, [26, 50], [0, 48], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Derive atmospheric bg tint from glowColor (very subtle)
  const bgTint = glowColor.replace(/[\d.]+\)$/, '0.12)');
  const midTint = glowColor.replace(/[\d.]+\)$/, '0.07)');

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        opacity: sceneIn,
      }}
    >
      {/* ── Background: cream gradient + warm atmospheric tint ── */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 100%, ${bgTint} 0%, transparent 65%),
            radial-gradient(ellipse 80% 60% at 50% 85%, ${midTint} 0%, transparent 55%),
            linear-gradient(180deg, #FDFCFA 0%, #FFF9F7 55%, #FFFFFF 100%)
          `,
        }}
      />

      {/* ── Ambient grain texture mesh (subtle depth) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(232,180,188,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 15%, rgba(197,169,208,0.04) 0%, transparent 45%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* ── Flower bloom glow — large radial light behind flower ── */}
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: '50%',
          transform: `translateX(-50%) scale(${bloomScale})`,
          width: 900,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${glowColor.replace(/[\d.]+\)$/, '0.45)')} 0%, ${glowColor.replace(/[\d.]+\)$/, '0.15)')} 35%, transparent 70%)`,
          filter: 'blur(40px)',
          opacity: bloomOpacity,
          pointerEvents: 'none',
          transformOrigin: 'center bottom',
        }}
      />

      {/* ── Flower — rises from bottom, bleeds off frame ── */}
      <div
        style={{
          position: 'absolute',
        bottom: -60,
          left: '50%',
          transform: `translateX(-50%) translateY(${flowerRise + floatY}px)`,
          opacity: flowerOpacity,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <img
          src={staticFile(flowerSrc)}
          alt=""
          style={{
            width: 960,
            height: 'auto',
            filter: `drop-shadow(0 0 60px ${glowColor.replace(/[\d.]+\)$/, '0.50)')}) drop-shadow(0 20px 40px ${glowColor.replace(/[\d.]+\)$/, '0.30)')})`,
            userSelect: 'none',
            // Fade top of flower into bg so it feels atmospheric, not cut-out
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 100%)',
          }}
        />
      </div>

      {/* ── Editorial text — centered in upper field ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          // Text lives in the top 58% of the frame — flower owns the rest
          height: '58%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          padding: '0 180px',
          gap: 0,
        }}
      >
        {/* Label + rule */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            marginBottom: 36,
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: labelColor,
            }}
          >
            {label}
          </span>
          {/* Animated accent rule — expands outward */}
          <div
            style={{
              height: 1,
              width: ruleWidth,
              background: `linear-gradient(to right, transparent, ${labelColor}, transparent)`,
              opacity: 0.7,
            }}
          />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: 62,
            fontWeight: 300,
            color: COLOR.textPrimary,
            lineHeight: 1.12,
            letterSpacing: '-0.025em',
            margin: '0 0 32px',
            textAlign: 'center',
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            textShadow: '0 2px 4px rgba(61,51,64,0.06)',
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
            fontSize: 28,
            fontWeight: 300,
            color: COLOR.textSecondary,
            lineHeight: 1.75,
            margin: 0,
            textAlign: 'center',
            opacity: descOpacity,
            transform: `translateY(${descY}px)`,
            maxWidth: 780,
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
    </AbsoluteFill>
  );
};
