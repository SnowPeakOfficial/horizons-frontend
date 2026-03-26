/**
 * FeatureSceneV — portrait (1080×1920) variant of FeatureScene.
 *
 * Same editorial concept as the landscape version:
 * flower dominates the lower portion, text lives in the upper field.
 * Portrait gives MORE vertical room, so the flower fills beautifully
 * and text has generous breathing space above it.
 *
 * Font sizes scaled for 1080px wide (vs 1920px landscape).
 * Padding tightened. Flower width matched to portrait frame width.
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
import { FeatureSceneProps } from './FeatureScene';

export const FeatureSceneV: React.FC<FeatureSceneProps> = ({
  label,
  labelColor,
  headline,
  description,
  flowerSrc,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Scene fade-in / fade-out ───────────────────────────────────
  const sceneIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const sceneOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Flower ─────────────────────────────────────────────────────
  const flowerRise = interpolate(frame, [0, 90], [80, 0], { extrapolateRight: 'clamp' });
  const flowerOpacity = interpolate(frame, [5, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Glow bloom ─────────────────────────────────────────────────
  const bloomScale = interpolate(frame, [0, 80], [0.6, 1], { extrapolateRight: 'clamp' });
  const bloomOpacity = interpolate(frame, [20, 80], [0, 1], { extrapolateRight: 'clamp' });

  // ── Label ──────────────────────────────────────────────────────
  const labelSp = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 24, stiffness: 65 } });
  const labelOpacity = interpolate(frame, [18, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const labelY = interpolate(labelSp, [0, 1], [14, 0]);

  // ── Headline ───────────────────────────────────────────────────
  const headlineSp = spring({ frame: Math.max(0, frame - 32), fps, config: { damping: 20, stiffness: 55 } });
  const headlineOpacity = interpolate(frame, [32, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineY = interpolate(headlineSp, [0, 1], [32, 0]);

  // ── Description ────────────────────────────────────────────────
  const descSp = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 22, stiffness: 60 } });
  const descOpacity = interpolate(frame, [55, 82], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const descY = interpolate(descSp, [0, 1], [18, 0]);

  // ── Accent rule ────────────────────────────────────────────────
  const ruleWidth = interpolate(frame, [26, 50], [0, 48], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bgTint = glowColor.replace(/[\d.]+\)$/, '0.12)');
  const midTint = glowColor.replace(/[\d.]+\)$/, '0.07)');

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        opacity: sceneIn * sceneOut,
      }}
    >
      {/* Background */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 120% 60% at 50% 100%, ${bgTint} 0%, transparent 65%),
            radial-gradient(ellipse 80% 40% at 50% 88%, ${midTint} 0%, transparent 55%),
            linear-gradient(180deg, #FDFCFA 0%, #FFF9F7 55%, #FFFFFF 100%)
          `,
        }}
      />

      {/* Ambient grain */}
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

      {/* Flower glow bloom */}
      <div
        style={{
          position: 'absolute',
          bottom: -160,
          left: '50%',
          transform: `translateX(-50%) scale(${bloomScale})`,
          width: 1200,
          height: 1200,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${glowColor.replace(/[\d.]+\)$/, '0.45)')} 0%, ${glowColor.replace(/[\d.]+\)$/, '0.15)')} 35%, transparent 70%)`,
          filter: 'blur(50px)',
          opacity: bloomOpacity,
          pointerEvents: 'none',
          transformOrigin: 'center bottom',
        }}
      />

      {/* Flower — wider than frame, bleeds off edges like landscape */}
      <div
        style={{
          position: 'absolute',
          bottom: -85,
          left: '50%',
          transform: `translateX(-50%) translateY(${flowerRise}px)`,
          opacity: flowerOpacity,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <img
          src={staticFile(flowerSrc)}
          alt=""
          style={{
            width: 1400,
            height: 'auto',
            filter: `drop-shadow(0 0 60px ${glowColor.replace(/[\d.]+\)$/, '0.50)')}) drop-shadow(0 20px 40px ${glowColor.replace(/[\d.]+\)$/, '0.30)')})`,
            userSelect: 'none',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 100%)',
          }}
        />
      </div>

      {/* Text — upper 58% of the portrait frame, sits close above the flower */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '58%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          padding: '0 80px',
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
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: labelColor,
            }}
          >
            {label}
          </span>
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
            fontSize: 88,
            fontWeight: 300,
            color: COLOR.textPrimary,
            lineHeight: 1.12,
            letterSpacing: '-0.025em',
            margin: '0 0 28px',
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
            fontSize: 34,
            fontWeight: 300,
            color: COLOR.textSecondary,
            lineHeight: 1.75,
            margin: 0,
            textAlign: 'center',
            opacity: descOpacity,
            transform: `translateY(${descY}px)`,
            maxWidth: 900,
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
