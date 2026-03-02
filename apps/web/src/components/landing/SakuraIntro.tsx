/**
 * SakuraIntro Component - Ultra-Smooth Scale Aperture
 * Hero section is a 1:1 literal copy of LandingPage hero.
 * Only differences: height:'100%' on section, no-op onClick for "Read our letter".
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
      onComplete();
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

      {/* Full Hero Section - Scales from 15% to 100% */}
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
        {/* ── HERO SECTION — exact copy of LandingPage hero ── */}
        <section
          style={{
            position: 'relative',
            minHeight: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            paddingTop: '80px',
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

          {/* Bloomory-style peripheral labels */}
          <div style={{
            position: 'absolute', top: '88px', left: '52px',
            fontFamily: typography.fontFamily.serif, fontSize: '18px',
            letterSpacing: '0.25em', textTransform: 'uppercase' as const,
            color: theme.text.tertiary, zIndex: 10,
            pointerEvents: 'none',
            animation: 'heroContentFade 8s ease forwards',
          }}>EST. 2026</div>

          <div style={{
            position: 'absolute', top: '88px', right: '52px',
            fontFamily: typography.fontFamily.serif, fontSize: '18px',
            letterSpacing: '0.1em', color: theme.text.tertiary,
            zIndex: 10, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: '6px',
            animation: 'heroContentFade 8s ease forwards',
          }}>
            <span style={{ fontSize: '10px', color: theme.colors.rose[400] }}>✦</span>
            <span>Private by design</span>
          </div>

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
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(16px, 2vw, 32px)',
                opacity: 0.7,
              }}
            >
              <img
                src="/images/horizons-logo.svg"
                alt="Horizons logo"
                style={{
                  height: 'clamp(64px, 10vw, 128px)',
                  width: 'auto',
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
              <span
                style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: 'clamp(64px, 10vw, 128px)',
                  fontWeight: typography.fontWeight.medium,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: theme.text.tertiary,
                  textShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                HORIZONS
              </span>
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: theme.spacing['2xl'],
                opacity: 0.7,
              }}
            >
              <img
                src="/images/horizons-logo.svg"
                alt="Horizons logo"
                style={{
                  height: 'clamp(36px, 5vw, 60px)',
                  width: 'auto',
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
              <span
                style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: 'clamp(36px, 5vw, 60px)',
                  fontWeight: typography.fontWeight.medium,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: theme.text.tertiary,
                  textShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                Horizons
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontFamily: typography.fontFamily.serif,
                fontWeight: typography.fontWeight.normal,
                color: theme.text.primary,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '900px',
                margin: `0 auto ${theme.spacing['xl']} auto`,
                textShadow: '0 1px 2px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
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
                fontWeight: typography.fontWeight.medium,
                lineHeight: 1.7,
                maxWidth: '700px',
                margin: `0 auto ${theme.spacing['2xl']} auto`,
                color: theme.text.primary,
                textShadow: '0 1px 3px rgba(0,0,0,0.08)',
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
                position: 'relative',
                zIndex: 3,
              }}
            >
              <Button
                variant="primary"
                size="large"
                onClick={() => navigate('/auth/register')}
                style={{
                  fontSize: '18px',
                  padding: '18px 48px',
                  background: `linear-gradient(135deg, ${theme.colors.rose[600]} 0%, ${theme.colors.rose[700]} 100%)`,
                  boxShadow: '0 4px 0 rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.04)',
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
                  background: 'rgba(255, 255, 255, 0.92)',
                  color: theme.colors.rose[700],
                  boxShadow: '0 4px 0 rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.03)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Read our letter
              </Button>
            </div>
          </div>

          {/* Hydrangea image — exact copy from LandingPage */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '-200px',
              marginBottom: '0px',
              animation: 'heroContentFade 8s ease forwards',
            }}
          >
            <img
              src="/images/Default_A_delicate_intricately_detailed_3D_hydrangea_blooms_ag_1_5608c5bf-c46a-46b8-b9a4-6f3a3aeb05dc_0.png"
              alt=""
              style={{
                width: 'clamp(700px, 80vw, 1100px)',
                height: 'auto',
                userSelect: 'none',
                pointerEvents: 'none',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              }}
            />
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
