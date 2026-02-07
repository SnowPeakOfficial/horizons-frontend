/**
 * Landing Page - Horizons
 * Modern, enterprise-grade design with full-width responsive layout
 * NO amateur falling icons - Professional polish throughout
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';
import { CurvedDivider } from '../components/landing/CurvedDivider';
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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect value
  const parallaxOffset = scrollY * 0.5;

  return (
    <div style={{ background: '#FDFCFA', minHeight: '100vh' }}>
      
      {/* ========== HERO SECTION - Full Modern Design ========== */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
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
        {/* Subtle background gradient mesh - NO falling icons */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 20% 30%, rgba(232, 180, 188, 0.08) 0%, transparent 50%),
                         radial-gradient(circle at 80% 70%, rgba(197, 169, 208, 0.06) 0%, transparent 50%)`,
            transform: `translateY(${parallaxOffset}px)`,
            pointerEvents: 'none',
          }}
        />

        {/* Hero Content - Properly Centered */}
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
              ...typography.styles.h6,
              fontFamily: typography.fontFamily.serif,
              color: theme.text.tertiary,
              marginBottom: theme.spacing['6xl'],
              fontWeight: typography.fontWeight.normal,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.7,
              animation: 'fadeIn 1s ease forwards',
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
              animation: 'fadeIn 1s ease 0.2s forwards',
              opacity: 0,
              animationFillMode: 'forwards',
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
              animation: 'fadeIn 1s ease 0.4s forwards',
              opacity: 0,
              animationFillMode: 'forwards',
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
              animation: 'fadeIn 1s ease 0.6s forwards',
              opacity: 0,
              animationFillMode: 'forwards',
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
                const element = document.getElementById('what-is-this');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
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
              animation: 'fadeIn 1s ease 0.8s forwards',
              opacity: 0,
              animationFillMode: 'forwards',
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

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: theme.spacing['4xl'],
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          <div
            style={{
              ...typography.styles.h4,
              color: theme.text.tertiary,
              opacity: 0.4,
            }}
          >
            ↓
          </div>
        </div>
      </section>

      {/* Smooth transition */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)' }} />

      {/* ========== WHAT HORIZONS IS ========== */}
      <section
        id="what-is-this"
        style={{
          padding: '120px 40px',
          background: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <RevealOnScroll>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <p
                style={{
                  fontSize: 'clamp(20px, 2.5vw, 32px)',
                  lineHeight: 1.8,
                  color: theme.text.secondary,
                  marginBottom: theme.spacing['5xl'],
                }}
              >
                Some moments don't belong in a feed.
                <br />
                They don't need likes or replies.
                <br />
                They just need a place to live.
              </p>

              <p
                style={{
                  fontSize: 'clamp(20px, 2.5vw, 32px)',
                  lineHeight: 1.8,
                  color: theme.text.primary,
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                Horizons is a private garden for your memories —<br />
                written, spoken, or recorded —<br />
                planted as flowers you can return to over time.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CurvedDivider color="#FFF9F7" flip />

      {/* ========== FEATURES GRID - Modern Glassmorphism Cards ========== */}
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
              With Horizons, you can:
            </h2>
          </RevealOnScroll>

          {/* Modern Bento Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: theme.spacing['2xl'],
            }}
          >
            {[
              {
                title: 'Plant a memory',
                description: 'Write, record, or speak what you want to remember',
                gradient: 'linear-gradient(135deg, rgba(232, 180, 188, 0.1) 0%, rgba(232, 180, 188, 0.05) 100%)',
              },
              {
                title: 'Let it bloom',
                description: 'Choose when your flower opens — now or in the future',
                gradient: 'linear-gradient(135deg, rgba(197, 169, 208, 0.1) 0%, rgba(197, 169, 208, 0.05) 100%)',
              },
              {
                title: 'Share as a gift',
                description: 'Send memories to loved ones, quietly and intentionally',
                gradient: 'linear-gradient(135deg, rgba(159, 195, 178, 0.1) 0%, rgba(159, 195, 178, 0.05) 100%)',
              },
              {
                title: 'Return anytime',
                description: 'Your garden waits for you, private and peaceful',
                gradient: 'linear-gradient(135deg, rgba(240, 217, 181, 0.1) 0%, rgba(240, 217, 181, 0.05) 100%)',
              },
            ].map((feature, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: theme.radius['3xl'],
                    padding: theme.spacing['4xl'],
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                    transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'default',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.06)';
                  }}
                >
                  {/* Gradient background */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: feature.gradient,
                      opacity: 0.6,
                      zIndex: 0,
                    }}
                  />

                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3
                      style={{
                        fontSize: '24px',
                        fontWeight: typography.fontWeight.semibold,
                        marginBottom: theme.spacing.lg,
                        color: theme.text.primary,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '18px',
                        lineHeight: 1.7,
                        color: theme.text.secondary,
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
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
