/**
 * Landing Page - Horizons
 * Modern, enterprise-grade design with full-width responsive layout
 * NO amateur falling icons - Professional polish throughout
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button } from '../components/common';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CurvedDivider } from '../components/landing/CurvedDivider';
import { SakuraIntro } from '../components/landing/SakuraIntro';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';

// Scroll reveal wrapper
const RevealOnScroll: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        filter: isVisible ? 'blur(0)' : 'blur(4px)',
        transition: `all 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('introPlayed')); // Once per session
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Suppress unused warning — kept for future parallax use
  void scrollY;

  const handleIntroComplete = () => {
    sessionStorage.setItem('introPlayed', 'true');
    setShowIntro(false);
  };

  // Show intro video first
  if (showIntro) {
    return <SakuraIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div style={{ background: '#FDFCFA', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />
      
      {/* ========== HERO SECTION ========== */}
      <section
        style={{
          position: 'relative',
          minHeight: 'auto',
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
          color: theme.text.tertiary, opacity: 1, zIndex: 10,
          pointerEvents: 'none',
        }}>EST. 2026</div>

        <div style={{
          position: 'absolute', top: '88px', right: '52px',
          fontFamily: typography.fontFamily.serif, fontSize: '18px',
          letterSpacing: '0.1em', color: theme.text.tertiary, opacity: 1,
          zIndex: 10, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ fontSize: '10px', color: theme.colors.rose[400] }}>✦</span>
          <span>Private by design</span>
        </div>

        {/* Hero Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 40px',
            textAlign: 'center',
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
              onClick={() => {
                const element = document.getElementById('our-letter');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
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

        {/* Hydrangea image — pulled up close to buttons, Bloomory/Once-style */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '-200px',
            // Overflow the section bottom so image peeks below fold
            marginBottom: '0px',
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
              // Fade bottom edge into the background
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
          />
        </div>
      </section>

      {/* Smooth transition */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)' }} />

      {/* ========== OUR LETTER - Handwritten Note Style ========== */}
      <section
        id="our-letter"
        style={{
          padding: '120px 40px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFEF9 100%)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <RevealOnScroll>
            {/* Letter Container - Handwritten Note Card */}
            <div
              style={{
                background: '#FFFEF9',
                borderRadius: theme.radius['2xl'],
                padding: 'clamp(40px, 6vw, 80px)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(139, 115, 85, 0.1)',
                border: '1px solid rgba(139, 115, 85, 0.15)',
                position: 'relative',
                transform: 'rotate(-0.5deg)',
                transition: 'transform 400ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(-0.5deg) translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(139, 115, 85, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(-0.5deg)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(139, 115, 85, 0.1)';
              }}
            >
              {/* Subtle paper texture overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 115, 85, 0.02) 2px, rgba(139, 115, 85, 0.02) 4px)',
                  borderRadius: theme.radius['2xl'],
                  pointerEvents: 'none',
                }}
              />

              {/* Letter Header */}
              <h2
                style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: typography.fontWeight.normal,
                  color: theme.text.primary,
                  textAlign: 'center',
                  marginBottom: theme.spacing['5xl'],
                  letterSpacing: '0.02em',
                  position: 'relative',
                }}
              >
                A Letter About Horizons
              </h2>

              {/* Letter Body */}
              <div
                style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: 'clamp(17px, 2vw, 20px)',
                  lineHeight: 1.9,
                  color: theme.text.secondary,
                  position: 'relative',
                }}
              >
                <p style={{ marginBottom: theme.spacing['3xl'] }}>
                  We built this because we kept losing things.
                </p>

                <p style={{ marginBottom: theme.spacing['3xl'] }}>
                  Not physical things — but moments. Conversations that mattered. 
                  Feelings we wanted to remember. Thoughts we had at 2am that felt important.
                </p>

                <p style={{ marginBottom: theme.spacing['3xl'] }}>
                  Social media wasn't the answer. It's too public, too performative, 
                  too temporary.
                </p>

                <p style={{ marginBottom: theme.spacing['3xl'] }}>
                  We needed something quieter. Something just for us. A place where 
                  memories could live without being judged, liked, or compared.
                </p>

                <p style={{ marginBottom: theme.spacing['3xl'], fontWeight: typography.fontWeight.medium, color: theme.text.primary }}>
                  So we built Horizons.
                </p>

                <p style={{ marginBottom: theme.spacing['3xl'] }}>
                  A private garden where memories grow as flowers. Plant them. 
                  Watch them bloom. Return when you need to.
                </p>

                {/* Signature */}
                <p
                  style={{
                    marginTop: theme.spacing['5xl'],
                    fontStyle: 'italic',
                    textAlign: 'right',
                    color: theme.text.tertiary,
                    fontSize: 'clamp(16px, 1.8vw, 18px)',
                  }}
                >
                  — The Horizons Team
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CurvedDivider color="#FFF9F7" flip />

      {/* ========== HOW IT WORKS - Editorial Vertical Steps ========== */}
      <section
        style={{
          padding: '120px 40px',
          background: '#FFF9F7',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Section label + headline */}
          <RevealOnScroll>
            <p style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: '18px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: theme.text.tertiary,
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
            }}>How it works</p>
            <h2
              style={{
                fontSize: 'clamp(40px, 5.5vw, 64px)',
                fontFamily: typography.fontFamily.serif,
                fontWeight: typography.fontWeight.normal,
                textAlign: 'center',
                marginBottom: '96px',
                color: theme.text.primary,
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
              }}
            >
              How a memory becomes a flower
            </h2>
          </RevealOnScroll>

          {/* Steps — vertical alternating layout */}
          {[
            {
              number: '01',
              label: 'STEP 01',
              title: 'Plant a memory',
              description: 'Write a thought, attach a photo, record a voice note — anything worth keeping. The moment becomes a flower in your garden.',
              image: '/images/Moment to remember-rafiki.png',
              imageAlt: 'A person capturing a moment to remember',
              imageRight: false,
            },
            {
              number: '02',
              label: 'STEP 02',
              title: 'Choose when it blooms',
              description: 'Set it to open now, or seal it for later — a week, a year, or a lifetime. Some things are sweeter with time.',
              image: '/images/Flowers-rafiki.png',
              imageAlt: 'Flowers blooming — a memory coming to life',
              imageRight: true,
            },
            {
              number: '03',
              label: 'STEP 03',
              title: 'Grow your garden',
              description: "Every memory you plant adds to your private garden — a quiet, growing space that's entirely yours.",
              image: '/images/Flowers-amico.png',
              imageAlt: 'A garden growing — a collection of memories',
              imageRight: false,
            },
            {
              number: '04',
              label: 'STEP 04',
              title: 'Send it as a flower',
              description: "When the moment is right, send a memory to someone you love. No wrapping needed — just a flower, and a letter.",
              image: "/images/Valentine's bouquet with a card-bro.png",
              imageAlt: "A bouquet with a card — a memory sent with love",
              imageRight: true,
            },
          ].map((step, index) => (
            <RevealOnScroll key={index} delay={index * 80}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: step.imageRight ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 'clamp(32px, 4vw, 72px)',
                  marginBottom: index < 3 ? '64px' : '0',
                  flexWrap: 'wrap',
                }}
              >
                {/* Image side */}
                <div style={{
                  flex: '1 1 340px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '320px',
                  position: 'relative',
                }}>
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    style={{
                      width: 'clamp(240px, 35vw, 420px)',
                      height: 'auto',
                      position: 'relative',
                      zIndex: 1,
                      userSelect: 'none',
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 8px 32px rgba(212, 144, 154, 0.15))',
                    }}
                  />
                </div>

                {/* Text side */}
                <div style={{
                  flex: '1 1 380px',
                  maxWidth: '520px',
                  padding: '0 8px',
                }}>
                  {/* Step label */}
                  <p style={{
                    fontFamily: typography.fontFamily.serif,
                    fontSize: '16px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const,
                    color: theme.text.tertiary,
                    marginBottom: theme.spacing.md,
                  }}>
                    {step.label}
                  </p>

                  {/* Step title */}
                  <h3 style={{
                    fontSize: 'clamp(28px, 3.5vw, 40px)',
                    fontFamily: typography.fontFamily.serif,
                    fontWeight: typography.fontWeight.normal,
                    color: theme.text.primary,
                    marginBottom: theme.spacing.xl,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                  }}>
                    {step.title}
                  </h3>

                  {/* Step description */}
                  <p style={{
                    fontSize: 'clamp(17px, 2vw, 20px)',
                    lineHeight: 1.8,
                    color: theme.text.secondary,
                    maxWidth: '480px',
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}


        </div>
      </section>

      {/* ========== USE CASES ========== */}
      <section
        style={{
          padding: '120px 40px',
          background: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Section header */}
          <RevealOnScroll>
            <p style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: '18px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: theme.text.tertiary,
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
            }}>Use cases</p>
            <h2 style={{
              fontSize: 'clamp(40px, 5.5vw, 64px)',
              fontFamily: typography.fontFamily.serif,
              fontWeight: typography.fontWeight.normal,
              textAlign: 'center',
              marginBottom: '80px',
              color: theme.text.primary,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}>
              Every moment deserves a place to grow.
            </h2>
          </RevealOnScroll>

          {/* Three-card panel row */}
          <RevealOnScroll delay={80}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: `1px solid ${theme.border.light}`,
              boxShadow: '0 4px 32px rgba(61, 51, 64, 0.06)',
            }}>

              {[
                {
                  bg: '#FFF0F3',
                  accent: theme.colors.rose[400],
                  accentText: theme.colors.rose[700],
                  accentBg: '#FFE0E6',
                  headline: 'For the ones who\nmatter most',
                  quote: '"She opened it on the train home.\nI wasn\'t there —\nbut somehow, I was."',
                  label: 'For loved ones',
                  examples: ['Anniversaries', 'Long-distance', 'Just because'],
                  borderColor: theme.colors.rose[200],
                },
                {
                  bg: '#FFFBF0',
                  accent: '#D4A96A',
                  accentText: '#8B5E2A',
                  accentBg: '#FFF3DC',
                  headline: 'For the people\nyou build with',
                  quote: '"He\'d been with us for five years.\nA card felt small.\nSo we planted something lasting."',
                  label: 'For your team',
                  examples: ['Milestones', 'Recognition', 'Achievements'],
                  borderColor: '#E8D0A0',
                },
                {
                  bg: '#F3FAF3',
                  accent: '#4A7C59',
                  accentText: '#2E5C3A',
                  accentBg: '#DFF0DC',
                  headline: 'For the person\nyou\'re becoming',
                  quote: '"I planted it the day everything shifted.\nI open it when I forget\nhow far I\'ve come."',
                  label: 'For yourself',
                  examples: ['Growth', 'Milestones', 'Reflection'],
                  borderColor: '#B8DDB0',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: card.bg,
                    padding: '52px 44px 48px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: i > 0 ? `1px solid ${card.borderColor}` : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top accent border */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: card.accent,
                  }} />

                  {/* Headline */}
                  <h3 style={{
                    fontFamily: typography.fontFamily.serif,
                    fontSize: 'clamp(24px, 2.5vw, 32px)',
                    fontWeight: typography.fontWeight.normal,
                    color: theme.text.primary,
                    lineHeight: 1.25,
                    marginBottom: '32px',
                    letterSpacing: '-0.01em',
                    whiteSpace: 'pre-line',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    {card.headline}
                  </h3>

                  {/* Quote — the emotional core */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '16px',
                    marginBottom: '40px',
                    height: '96px',
                  }}>
                    {/* Accent bar — stretches to full height of text regardless of line count */}
                    <div style={{
                      width: '2px',
                      flexShrink: 0,
                      alignSelf: 'stretch',
                      background: card.accent,
                      borderRadius: '2px',
                      opacity: 0.7,
                    }} />
                    <p style={{
                      fontFamily: typography.fontFamily.serif,
                      fontSize: '16px',
                      fontStyle: 'italic',
                      color: theme.text.secondary,
                      lineHeight: 2.0,
                      whiteSpace: 'pre-line',
                      opacity: 0.85,
                      margin: 0,
                    }}>
                      {card.quote}
                    </p>
                  </div>

                  {/* Example tags */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap' as const,
                    gap: '8px',
                    marginBottom: '28px',
                  }}>
                    {card.examples.map((ex, j) => (
                      <span key={j} style={{
                        fontSize: '12px',
                        color: card.accentText,
                        background: card.accentBg,
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontFamily: typography.fontFamily.serif,
                        letterSpacing: '0.03em',
                      }}>
                        {ex}
                      </span>
                    ))}
                  </div>

                  {/* Label chip */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                    color: card.accentText,
                    fontFamily: typography.fontFamily.serif,
                  }}>
                    <div style={{
                      width: '20px',
                      height: '1.5px',
                      background: card.accent,
                    }} />
                    {card.label}
                  </div>
                </div>
              ))}

            </div>
          </RevealOnScroll>

          {/* Pull-quote closer */}
          <RevealOnScroll delay={120}>
            <p style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontStyle: 'italic',
              color: theme.text.tertiary,
              textAlign: 'center',
              marginTop: '72px',
              letterSpacing: '0.01em',
              lineHeight: 1.6,
            }}>
              "Some moments deserve forever."
            </p>
          </RevealOnScroll>

        </div>
      </section>

      {/* ========== WHY HORIZONS — Orix-style panel row ========== */}
      <section
        style={{
          padding: '120px 40px',
          background: '#FFF9F7',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Section header — matches "How it works" style exactly */}
          <RevealOnScroll>
            <p style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: '18px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: theme.text.tertiary,
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
            }}>Why Horizons</p>
            <h2 style={{
              fontSize: 'clamp(40px, 5.5vw, 64px)',
              fontFamily: typography.fontFamily.serif,
              fontWeight: typography.fontWeight.normal,
              textAlign: 'center',
              marginBottom: '64px',
              color: theme.text.primary,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}>
              Where moments are kept with care
            </h2>
          </RevealOnScroll>

          {/* Panel row — 3 columns: Flower | Manifesto (wide) | Trust (slim) */}
          <RevealOnScroll delay={100}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.6fr 0.9fr',
              minHeight: '420px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: `1px solid ${theme.border.light}`,
            }}>

              {/* Panel 1 — Flower image, anchored to bottom */}
              <div style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#F5ECE8',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '0 16px',
              }}>
                <img
                  src="/images/Default_A_highly_detailed_futuristic_3D_glassmorphic_rose_with_1_1e7015ea-9d7e-4641-a544-8aadfba8a958_0.png"
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    display: 'block',
                  }}
                />
              </div>

              {/* Panel 2 — Merged manifesto: the emotional hero */}
              <div style={{
                background: '#FFFFFF',
                padding: '56px 52px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderLeft: `1px solid ${theme.border.light}`,
              }}>
                {/* Inner wrapper — both texts share this same bounding box */}
                <div style={{ width: 'fit-content' }}>
                  {/* Muted setup lines — top, left-aligned */}
                  <p style={{
                    fontFamily: typography.fontFamily.serif,
                    fontSize: 'clamp(16px, 1.5vw, 20px)',
                    lineHeight: 2,
                    color: theme.text.tertiary,
                    fontWeight: typography.fontWeight.normal,
                    marginBottom: '40px',
                    letterSpacing: '0.01em',
                    textAlign: 'left',
                  }}>
                    No feeds.<br />
                    No numbers.<br />
                    No pressure.
                  </p>
                  {/* Dominant payoff — bottom, centered */}
                  <p style={{
                    fontFamily: typography.fontFamily.serif,
                    fontSize: 'clamp(28px, 3vw, 42px)',
                    lineHeight: 1.35,
                    color: theme.text.primary,
                    fontWeight: typography.fontWeight.normal,
                    letterSpacing: '-0.02em',
                    textAlign: 'left',
                  }}>
                    Only the people<br />
                    you invite.<br />
                    Only the moments<br />
                    you choose to keep.
                  </p>
                </div>
              </div>

              {/* Panel 3 — Trust signals, slim with dividers */}
              <div style={{
                background: '#F8F4F2',
                padding: '48px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderLeft: `1px solid ${theme.border.light}`,
              }}>
                {[
                  { icon: LockOutlinedIcon, headline: 'Your garden is private', body: 'No one enters unless you invite them.' },
                  { icon: VisibilityOffOutlinedIcon, headline: 'Nothing is indexed', body: "Your memories aren't searchable or public." },
                  { icon: SendOutlinedIcon, headline: 'Sharing is intentional', body: 'Nothing leaves without your choice.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    paddingTop: i === 0 ? '0' : '24px',
                    paddingBottom: i < 2 ? '24px' : '0',
                    borderTop: i === 0 ? 'none' : `1px solid ${theme.border.light}`,
                  }}>
                    <item.icon sx={{ fontSize: 20, color: theme.colors.rose[400], mb: '10px', display: 'block' }} />
                    <p style={{
                      fontFamily: typography.fontFamily.serif,
                      fontSize: 'clamp(13px, 1.2vw, 15px)',
                      fontWeight: typography.fontWeight.medium,
                      color: theme.text.primary,
                      marginBottom: '6px',
                      lineHeight: 1.4,
                    }}>
                      {item.headline}
                    </p>
                    <p style={{
                      fontSize: 'clamp(12px, 1vw, 14px)',
                      lineHeight: 1.7,
                      color: theme.text.tertiary,
                    }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section
        style={{
          padding: '120px 40px',
          background: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: '18px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: theme.text.tertiary,
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
            }}>FAQ</p>
            <h2 style={{
              fontSize: 'clamp(40px, 5.5vw, 64px)',
              fontFamily: typography.fontFamily.serif,
              fontWeight: typography.fontWeight.normal,
              textAlign: 'center',
              marginBottom: '64px',
              color: theme.text.primary,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}>
              Questions we get asked
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={80}>
            <div>
              {[
                {
                  Icon: CreditCardOutlinedIcon,
                  question: 'Is Horizons free?',
                  answer: 'Yes — Horizons has a free tier that lets you plant memories and grow your garden. Pro and Premium plans unlock additional gardens, larger storage, and more customization options.',
                },
                {
                  Icon: VisibilityOffOutlinedIcon,
                  question: 'Who can see my memories?',
                  answer: 'Only you — unless you deliberately invite someone. Your garden is private by default. Nothing is public, nothing is indexed, and no one can stumble in uninvited.',
                },
                {
                  Icon: SaveOutlinedIcon,
                  question: 'What happens to my memories if I cancel?',
                  answer: "They're yours. You can export everything before you leave, and we keep your data for 30 days after cancellation so nothing is lost accidentally.",
                },
                {
                  Icon: IosShareOutlinedIcon,
                  question: 'Can I share with someone who doesn\'t have Horizons?',
                  answer: 'Yes. You can send a memory as a flower via a private link — the recipient can open and read it without an account. Sharing is always a deliberate choice.',
                },
                {
                  Icon: LockOutlinedIcon,
                  question: 'Is my data encrypted?',
                  answer: 'End-to-end. Your memories are encrypted in transit and at rest. We never index your content, never sell your data, and never use your memories to train anything.',
                },
                {
                  Icon: LocalFloristOutlinedIcon,
                  question: "What's the difference between a garden and a memory?",
                  answer: "A garden is a space — like a journal or an album. A memory is a single flower within that garden. You can have multiple gardens for different parts of your life, each with their own collection of flowers.",
                },
              ].map(({ Icon, question, answer }, i) => {
                const isOpen = openFaqs.has(i);
                return (
                  <div
                    key={i}
                    style={{
                      borderTop: `1px solid ${theme.border.light}`,
                      ...(i === 5 ? { borderBottom: `1px solid ${theme.border.light}` } : {}),
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(i)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '24px 0',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <Icon style={{ fontSize: 20, color: theme.colors.rose[400], flexShrink: 0 }} />
                      <span style={{
                        flex: 1,
                        fontFamily: typography.fontFamily.serif,
                        fontSize: 'clamp(16px, 1.6vw, 19px)',
                        fontWeight: typography.fontWeight.medium,
                        color: theme.text.primary,
                        lineHeight: 1.4,
                      }}>
                        {question}
                      </span>
                      <KeyboardArrowDownIcon style={{
                        fontSize: 22,
                        color: theme.text.tertiary,
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }} />
                    </button>

                    <div style={{
                      overflow: 'hidden',
                      maxHeight: isOpen ? '300px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      transition: 'max-height 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease',
                    }}>
                      <p style={{
                        fontFamily: typography.fontFamily.serif,
                        fontSize: 'clamp(15px, 1.4vw, 17px)',
                        lineHeight: 1.8,
                        color: theme.text.secondary,
                        paddingBottom: '24px',
                        paddingLeft: '36px',
                      }}>
                        {answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section
        style={{
          padding: '120px 40px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F7 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <RevealOnScroll>
            <h2
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontFamily: typography.fontFamily.serif,
                fontWeight: typography.fontWeight.normal,
                marginBottom: theme.spacing['6xl'],
                color: theme.text.primary,
                lineHeight: 1.2,
              }}
            >
              When you're ready,
              <br />
              your garden is waiting
            </h2>

            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/auth/register')}
              style={{
                fontSize: '18px',
                padding: '20px 56px',
                boxShadow: '0 12px 40px rgba(212, 144, 154, 0.35)',
              }}
            >
              Enter your garden
            </Button>
          </RevealOnScroll>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
};
