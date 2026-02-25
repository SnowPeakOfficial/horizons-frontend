/**
 * Landing Page - Horizons
 * Modern, enterprise-grade design with full-width responsive layout
 * NO amateur falling icons - Professional polish throughout
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';
import { Navbar } from '../components/layout/Navbar';
import { CurvedDivider } from '../components/landing/CurvedDivider';
import { SakuraIntro } from '../components/landing/SakuraIntro';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';
import InsertPhoto from '@mui/icons-material/InsertPhoto';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import CardGiftcard from '@mui/icons-material/CardGiftcard';
import Home from '@mui/icons-material/Home';

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
  const [showIntro, setShowIntro] = useState(true); // Always show intro on page load

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Suppress unused warning — kept for future parallax use
  void scrollY;

  const handleIntroComplete = () => {
    setShowIntro(false); // No sessionStorage - intro plays every visit
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
          fontFamily: typography.fontFamily.serif, fontSize: '15px',
          letterSpacing: '0.25em', textTransform: 'uppercase' as const,
          color: theme.text.tertiary, opacity: 1, zIndex: 10,
          pointerEvents: 'none',
        }}>EST. 2026</div>

        <div style={{
          position: 'absolute', top: '88px', right: '52px',
          fontFamily: typography.fontFamily.serif, fontSize: '15px',
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
              fontFamily: typography.fontFamily.serif,
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: typography.fontWeight.normal,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.text.tertiary,
              marginBottom: theme.spacing['2xl'],
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
              margin: `0 auto ${theme.spacing['xl']} auto`,
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
              margin: `0 auto ${theme.spacing['2xl']} auto`,
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
                boxShadow: '0 8px 32px rgba(212, 144, 154, 0.3)',
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
                color: theme.colors.rose[500],
                boxShadow: '0 4px 16px rgba(212, 144, 154, 0.12)',
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

      {/* ========== HOW IT WORKS - Clean Numbered Process ========== */}
      <section
        style={{
          padding: '120px 40px',
          background: '#FFF9F7',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <RevealOnScroll>
            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontFamily: typography.fontFamily.serif,
                fontWeight: typography.fontWeight.normal,
                textAlign: 'center',
                marginBottom: theme.spacing['7xl'],
                color: theme.text.primary,
              }}
            >
              How it works
            </h2>
          </RevealOnScroll>

          {/* Process Steps - Horizontal One Line */}
          <div
            style={{
              display: 'flex',
              gap: theme.spacing['3xl'],
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {[
              {
                icon: <InsertPhoto sx={{ fontSize: 48 }} />,
                title: 'Plant a memory',
                description: 'Write, record, or speak what you want to remember',
              },
              {
                icon: <LocalFlorist sx={{ fontSize: 48 }} />,
                title: 'Let it bloom',
                description: 'Choose when your flower opens — now or in the future',
              },
              {
                icon: <CardGiftcard sx={{ fontSize: 48 }} />,
                title: 'Share as a gift',
                description: 'Send memories to loved ones, quietly and intentionally',
              },
              {
                icon: <Home sx={{ fontSize: 48 }} />,
                title: 'Return anytime',
                description: 'Your garden waits for you, private and peaceful',
              },
            ].map((step, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div
                  style={{
                    flex: '1 1 220px',
                    maxWidth: '260px',
                    textAlign: 'center',
                    padding: theme.spacing.xl,
                    transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      color: theme.colors.rose[400],
                      marginBottom: theme.spacing.lg,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Step Title */}
                  <h3
                    style={{
                      fontSize: 'clamp(18px, 2vw, 22px)',
                      fontWeight: typography.fontWeight.semibold,
                      marginBottom: theme.spacing.md,
                      color: theme.text.primary,
                      fontFamily: typography.fontFamily.serif,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p
                    style={{
                      fontSize: 'clamp(14px, 1.5vw, 16px)',
                      lineHeight: 1.7,
                      color: theme.text.secondary,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={400}>
            <p
              style={{
                marginTop: theme.spacing['7xl'],
                textAlign: 'center',
                fontSize: '18px',
                color: theme.text.tertiary,
                fontStyle: 'italic',
              }}
            >
              Nothing more than that.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <CurvedDivider color="#FFFFFF" />

      {/* ========== HOW IT FEELS ========== */}
      <section
        style={{
          padding: '120px 40px',
          background: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <RevealOnScroll>
            <p
              style={{
                fontSize: 'clamp(20px, 2.5vw, 32px)',
                lineHeight: 1.8,
                color: theme.text.secondary,
                marginBottom: theme.spacing['5xl'],
              }}
            >
              There are no feeds here.
              <br />
              No numbers to keep up with.
              <br />
              No pressure to share.
            </p>

            <p
              style={{
                fontSize: 'clamp(20px, 2.5vw, 32px)',
                lineHeight: 1.8,
                color: theme.text.primary,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              Only the people you invite.
              <br />
              Only the moments you choose to keep.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <CurvedDivider color="#FFF9F7" flip />

      {/* ========== PRIVACY & TRUST ========== */}
      <section
        style={{
          padding: '120px 40px',
          background: '#FFF9F7',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <RevealOnScroll>
            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontFamily: typography.fontFamily.serif,
                fontWeight: typography.fontWeight.normal,
                marginBottom: theme.spacing['5xl'],
                color: theme.text.primary,
              }}
            >
              Horizons is private by design
            </h2>

            <p
              style={{
                fontSize: 'clamp(18px, 2vw, 24px)',
                lineHeight: 1.8,
                color: theme.text.secondary,
                marginBottom: theme.spacing['4xl'],
              }}
            >
              Your gardens aren't public.
              <br />
              Your memories aren't indexed.
              <br />
              Nothing is shared without intention.
            </p>

            <p
              style={{
                fontSize: 'clamp(18px, 2vw, 24px)',
                lineHeight: 1.8,
                color: theme.text.primary,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              This is a space meant to feel safe.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <CurvedDivider color="#FFFFFF" />

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
      <footer
        style={{
          padding: '80px 40px 40px 40px',
          textAlign: 'center',
          borderTop: `1px solid ${theme.border.light}`,
          background: '#FDFCFA',
        }}
      >
        <p
          style={{
            ...typography.styles.body,
            color: theme.text.tertiary,
            marginBottom: theme.spacing['4xl'],
          }}
        >
          Thank you for taking a moment.
        </p>

        <div
          style={{
            ...typography.styles.caption,
            color: theme.text.tertiary,
            display: 'flex',
            gap: theme.spacing.xl,
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="/privacy"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: theme.transition.base,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.text.secondary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.text.tertiary)}
          >
            Privacy
          </a>
          <span>·</span>
          <a
            href="/terms"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: theme.transition.base,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.text.secondary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.text.tertiary)}
          >
            Terms
          </a>
          <span>·</span>
          <a
            href="mailto:hello@horizons.app"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: theme.transition.base,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.text.secondary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.text.tertiary)}
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};
