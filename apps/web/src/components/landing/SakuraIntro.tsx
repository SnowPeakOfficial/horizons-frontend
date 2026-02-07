/**
 * SakuraIntro Component - Ultra-Smooth Scale Aperture
 * Takes FULL hero section and scales from 20% → 100%
 * Uses CSS transform scale() for perfect smoothness
 * 100 keyframes for butter-smooth progression
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';

interface SakuraIntroProps {
  onComplete: () => void;
}

export const SakuraIntro: React.FC<SakuraIntroProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Adjust video to 8 seconds (8 second original = 1.0x playback)
    video.playbackRate = 1.0;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log('Video autoplay blocked:', error);
        onComplete();
      }
    };

    playVideo();

    const handleEnded = () => {
      setTimeout(() => {
        onComplete();
      }, 500);
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        background: '#000000',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          animation: 'fadeOutVideo 8s ease-out forwards',
        }}
      >
        <source src="/videos/sakura-blast.mp4" type="video/mp4" />
      </video>

      {/* Full Hero Section - Scales from 20% to 100% */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '100vh',
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          animation: 'scaleUp 8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          borderRadius: '32px',
          overflow: 'hidden',
          boxShadow: '0 0 80px rgba(255, 255, 255, 0.4)',
        }}
      >
        {/* FULL HERO SECTION - EXACTLY AS-IS FROM LANDING PAGE */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: `linear-gradient(180deg, 
              #FDFCFA 0%, 
              #FFF9F7 50%,
              #FFFFFF 100%)`,
          }}
        >
          {/* Subtle background gradient mesh */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 20% 30%, rgba(232, 180, 188, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, rgba(197, 169, 208, 0.06) 0%, transparent 50%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Logo Layer - Shows First (0-2s) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'logoFade 8s ease forwards',
            }}
          >
            <div
              style={{
                fontFamily: typography.fontFamily.serif,
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: typography.fontWeight.normal,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: theme.text.tertiary,
              }}
            >
              HORIZONS
            </div>
          </div>

          {/* Hero Content - Fades In After Logo (2-3.5s) */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: '1440px',
              margin: '0 auto',
              padding: '0 40px',
              textAlign: 'center',
              animation: 'heroContentFade 8s ease forwards',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                ...typography.styles.h6,
                fontFamily: typography.fontFamily.serif,
                color: theme.text.tertiary,
                marginBottom: theme.spacing['6xl'],
                fontWeight: typography.fontWeight.normal,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              Horizons
            </div>

            {/* Main Headline - Large & Bold */}
            <h1
              style={{
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontFamily: typography.fontFamily.serif,
                fontWeight: typography.fontWeight.normal,
                color: theme.text.primary,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '900px',
                margin: `0 auto ${theme.spacing['4xl']} auto`,
              }}
            >
              A quiet place to keep
              <br />
              the moments you care about
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: typography.fontWeight.normal,
                color: theme.text.secondary,
                lineHeight: 1.7,
                maxWidth: '700px',
                margin: `0 auto ${theme.spacing['6xl']} auto`,
              }}
            >
              Plant memories as flowers.
              <br />
              Return to them when you're ready.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                gap: theme.spacing.lg,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="primary"
                size="large"
                onClick={() => navigate('/auth/register')}
                style={{
                  fontSize: '18px',
                  padding: '18px 48px',
                  boxShadow: '0 8px 32px rgba(212, 144, 154, 0.3)',
                }}
              >
                Enter your garden
              </Button>
              
              <Button
                variant="ghost"
                size="large"
                onClick={() => {}}
                style={{
                  fontSize: '18px',
                  padding: '18px 48px',
                }}
              >
                Read the note
              </Button>
            </div>

            {/* Trust Badge */}
            <div
              style={{
                marginTop: theme.spacing['7xl'],
                ...typography.styles.caption,
                color: theme.text.tertiary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.lg,
              }}
            >
              <span>🔒</span>
              <span>100% Private</span>
              <span>•</span>
              <span>End-to-End Encrypted</span>
              <span>•</span>
              <span>Zero Tracking</span>
            </div>
          </div>
        </section>
      </div>

      {/* Smooth 8-Second Animation Sequence */}
      <style>{`
        /* Rectangle: Hold at 15% for 2s, then expand to 100% */
        @keyframes scaleUp {
          0% { 
            transform: translate(-50%, -50%) scale(0.15); 
            border-radius: 32px;
          }
          25% { 
            transform: translate(-50%, -50%) scale(0.15); 
            border-radius: 32px;
          }
          100% { 
            transform: translate(-50%, -50%) scale(1.0); 
            border-radius: 0px;
          }
        }

        /* Logo: Visible 0-2s, fade out 2-3s */
        @keyframes logoFade {
          0% { opacity: 1; }
          25% { opacity: 1; }      /* Visible until 2s */
          37.5% { opacity: 0; }    /* Fade out by 3s */
          100% { opacity: 0; }
        }

        /* Hero Content: Hidden 0-2s, fade in 2-3.5s */
        @keyframes heroContentFade {
          0% { opacity: 0; }
          25% { opacity: 0; }      /* Hidden until 2s */
          43.75% { opacity: 1; }   /* Fade in by 3.5s */
          100% { opacity: 1; }
        }

        /* Video: Fade out gradually */
        @keyframes fadeOutVideo {
          0% { opacity: 1; }
          75% { opacity: 0.5; }    /* 6s */
          100% { opacity: 0; }     /* 8s */
        }
      `}</style>
    </div>
  );
};
