/**
 * Landing Page - Horizons
 * Modern, enterprise-grade design with full-width responsive layout
 * NO amateur falling icons - Professional polish throughout
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
import { UseCasesSection } from '../components/landing/UseCasesSection';
import { SakuraIntro } from '../components/landing/SakuraIntro';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';
import SEO from '../components/common/SEO';

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
  const [showLetterModal, setShowLetterModal] = useState(false);

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
      <SEO
        canonical="/"
        description="Plant memories that bloom forever. Horizons is a private 3D memory garden where you plant digital flowers to preserve your most meaningful moments, send timed messages to loved ones, and keep memories that actually last."
        ogImageAlt="Horizons — A private 3D memory garden app"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is Horizons?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Horizons is a private 3D garden where you plant digital flowers to keep the moments that matter. Each flower holds a memory — a written message, a photo, a voice note, or a video. Some flowers open right away, sharing something with the people you care about immediately. Others can be set to bloom on a date you choose, so a moment arrives exactly when it's meant to."
              }
            },
            {
              "@type": "Question",
              "name": "What is a blooming flower?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A blooming flower is a memory you save for a specific moment in the future. While it's still waiting to open, you can leave a small note for the recipient — a hint, a few words, something for them to hold onto while they wait. On the day it blooms, the flower opens and reveals everything inside: your full message, a photo, a voice note, or a video."
              }
            },
            {
              "@type": "Question",
              "name": "What can I put inside a flower?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can add a written message, a photo, a voice note, or a short video — or any combination. If the flower opens right away, everything is visible the moment it's opened. If you've set a bloom date, you can leave a small note that appears while the flower is still waiting, and then the full message and media come through when it blooms. You can also choose a letter theme: Romantic, Friendship, Family, Gratitude, Celebration, or Encouragement."
              }
            },
            {
              "@type": "Question",
              "name": "How does sharing work? Does the recipient need an account?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You invite people into your garden by email. They'll get a link and can join for free. Once they're in, they can explore the garden and open any flowers planted for them. No paid plan is required to receive or view a flower."
              }
            },
            {
              "@type": "Question",
              "name": "Can I see a flower before it blooms?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No — and that's the point. Once you set a bloom date, the flower stays sealed until that day arrives. Even you won't be able to see what's inside until it opens. This is what gives the moment its weight — the waiting is part of it."
              }
            },
            {
              "@type": "Question",
              "name": "Who is Horizons for?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Couples who want to share something more meaningful than a text. Parents capturing milestones as their children grow. Grandparents planting letters for grandchildren to open years from now. Friends who want to say something real. People going through grief who need a quiet place to remember. Anyone who has ever wanted to write to their future self — or leave something behind for someone they love."
              }
            },
            {
              "@type": "Question",
              "name": "Can I plant a flower for a milestone that is years away?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes — there's no limit on how far in the future you can set a bloom date. Some people plant flowers set to open on a child's 18th birthday, on an anniversary a decade away, or on a date tied to someone who may not be around to deliver the message in person. The flower will wait as long as it needs to."
              }
            },
            {
              "@type": "Question",
              "name": "Is Horizons free to start?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes — no credit card required. The free plan gives you one private garden and lets you plant one flower per year, with all flower types and media options available. Pro unlocks up to 3 gardens, 50 flowers per year, 7 exclusive flower types, letter themes, and the ability to send a gift card with a flower. Premium (coming soon) expands to 30 gardens, 100 flowers per year, 3 rare flower types, and seasonal garden themes."
              }
            },
            {
              "@type": "Question",
              "name": "What is the difference between Pro and Premium?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Pro is built for people who want to grow multiple gardens and plant more frequently — up to 3 gardens, 50 flowers a year, 7 exclusive flower types, all 6 letter themes, and the ability to send a gift card alongside a flower. Premium (coming soon) is the full experience: up to 30 gardens, 100 flowers a year, 3 additional rare flower varieties, and seasonal garden themes that change throughout the year."
              }
            },
            {
              "@type": "Question",
              "name": "Can I cancel my subscription at any time?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes — cancel anytime from your profile, no questions asked. You keep full access until the end of your billing period."
              }
            },
            {
              "@type": "Question",
              "name": "Who can see my garden and my memories?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Only the people you personally invite. Your garden is completely private by default — nothing is visible to the public, nothing is searchable, and no one can find or enter it without an invitation from you. You decide who gets in."
              }
            },
            {
              "@type": "Question",
              "name": "Is my data encrypted and safe?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Everything you store in Horizons is encrypted while it travels and while it rests. We never sell your data, never use your memories to train AI, and never share anything with third parties. What you plant here stays yours."
              }
            }
          ]
        })}</script>
      </Helmet>
      {/* Navbar */}
      <Navbar />
      
      {/* ========== HERO SECTION ========== */}
      <section
        className="hero-section"
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

        {/* Bloomory-style peripheral labels — desktop only (hidden on mobile via CSS) */}
        <div className="landing-label-left" style={{
          position: 'absolute', top: '88px', left: '52px',
          fontFamily: typography.fontFamily.serif, fontSize: '18px',
          letterSpacing: '0.25em', textTransform: 'uppercase' as const,
          color: theme.text.tertiary, opacity: 1, zIndex: 10,
          pointerEvents: 'none',
        }}>EST. 2026</div>

        <div className="landing-label-right" style={{
          position: 'absolute', top: '88px', right: '52px',
          fontFamily: typography.fontFamily.serif, fontSize: '18px',
          letterSpacing: '0.1em', color: theme.text.tertiary, opacity: 1,
          zIndex: 10, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ fontSize: '10px', color: theme.colors.rose[400] }}>✦</span>
          <span>Private by design</span>
        </div>

        {/* Mobile-only labels — absolutely positioned just below the logo, left/right edges */}
        <div className="landing-label-mobile-left" style={{
          display: 'none',
          position: 'absolute', top: '148px', left: '20px',
          fontFamily: typography.fontFamily.serif, fontSize: '11px',
          letterSpacing: '0.2em', textTransform: 'uppercase' as const,
          color: theme.text.tertiary, zIndex: 10,
          pointerEvents: 'none',
        }}>EST. 2026</div>

        <div className="landing-label-mobile-right" style={{
          display: 'none',
          position: 'absolute', top: '148px', right: '20px',
          fontFamily: typography.fontFamily.serif, fontSize: '11px',
          letterSpacing: '0.08em', color: theme.text.tertiary,
          zIndex: 10, pointerEvents: 'none',
          alignItems: 'center', gap: '5px',
        }}>
          <span style={{ fontSize: '8px', color: theme.colors.rose[400] }}>✦</span>
          <span>Private by design</span>
        </div>

        {/* Hero Content */}
        <div
          className="hero-content"
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
            className="landing-logo-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: theme.spacing['2xl'],
              opacity: 0.7,
            }}
          >
            <img
              src="/images/horizons-logo-wordmark.svg"
              alt="Horizons"
              style={{
                height: 'clamp(60px, 8.5vw, 108px)',
                width: 'auto',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Mobile-only: inline labels row between logo and headline */}
          <div className="landing-labels-mobile-row" style={{
            display: 'none',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '0',
            marginTop: '-8px',
            marginBottom: theme.spacing.lg,
            pointerEvents: 'none',
          }}>
            <span style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: theme.text.tertiary,
            }}>EST. 2026</span>
            <span style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: theme.text.tertiary,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <span style={{ fontSize: '8px', color: theme.colors.rose[400] }}>✦</span>
              Private by design
            </span>
          </div>

          {/* Main Headline - Large & Bold */}
          <h1
            style={{
              fontSize: 'clamp(36px, 8vw, 96px)',
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
            className="hero-subheading"
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
            Return to them whenever you want.
          </p>

          {/* CTA Buttons */}
          <div
            className="hero-cta-group"
            style={{
              display: 'flex',
              gap: theme.spacing.lg,
              justifyContent: 'center',
              flexWrap: 'nowrap',
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
                const element = document.getElementById('how-it-works');
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
              See how it works
            </Button>
          </div>

        </div>

        {/* Hydrangea image — pulled up close to buttons, Bloomory/Once-style */}
        <div
          className="hero-flower-wrapper"
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '-200px',
            marginBottom: '0px',
          }}
        >
          <img
            src="/images/Default_A_delicate_intricately_detailed_3D_hydrangea_blooms_ag_1_5608c5bf-c46a-46b8-b9a4-6f3a3aeb05dc_0.png"
            alt=""
            style={{
              width: 'clamp(300px, 90vw, 1100px)',
              height: 'auto',
              userSelect: 'none',
              pointerEvents: 'none',
              // Fade top edge into hero background, bottom edge into section below
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 80%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 80%, transparent 100%)',
            }}
          />
        </div>
      </section>

      {/* ========== FOUNDER'S NOTE — Claura-style photo card ========== */}
      <section
        style={{
          padding: '80px 40px 120px',
          background: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <RevealOnScroll>
            <div
              className="founder-note-card"
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                // Horizontal panoramic proportions — like the reference card
                aspectRatio: '16 / 7',
                background: '#1a1a1a',
                boxShadow: '0 24px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Layer 1 — Sharp, vibrant base */}
              <img
                src="/images/flower-field1.jpg"
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '70% 40%',
                  filter: 'saturate(1.9) brightness(1.08) contrast(1.06)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />

              {/* Layer 2 — Blurred bokeh edges, masked to show only at periphery */}
              <img
                src="/images/flower-field1.jpg"
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '70% 40%',
                  transform: 'scale(1.06)',
                  filter: 'blur(20px) saturate(2.4) brightness(0.85)',
                  WebkitMaskImage: 'radial-gradient(ellipse 62% 72% at 58% 48%, transparent 0%, transparent 25%, black 65%)',
                  maskImage: 'radial-gradient(ellipse 62% 72% at 58% 48%, transparent 0%, transparent 25%, black 65%)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />

              {/* Brand pink tint — warm rose wash, multiply blend */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(212, 144, 154, 0.55)',
                  mixBlendMode: 'multiply' as const,
                  pointerEvents: 'none',
                }}
              />

              {/* Bottom gradient — anchors text, fades upward quickly */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.52) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Left vignette — makes text column readable without killing photo */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.10) 40%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />

              {/* HEAVY film grain — coarse, visible, Claura signature texture
                  Two passes: one soft-light for brightness variation, one multiply for darkness */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.50' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.38'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '180px 180px',
                  opacity: 1,
                  mixBlendMode: 'soft-light' as const,
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.50' numOctaves='4' stitchTiles='stitch' seed='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g2)' opacity='0.22'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '180px 180px',
                  opacity: 0.7,
                  mixBlendMode: 'multiply' as const,
                  pointerEvents: 'none',
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: 'clamp(48px, 6vw, 72px)',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                {/* Quote — large, prominent */}
                <p
                  style={{
                    fontFamily: typography.fontFamily.serif,
                    fontSize: 'clamp(28px, 3.2vw, 44px)',
                    fontWeight: typography.fontWeight.normal,
                    color: '#FFFFFF',
                    lineHeight: 1.4,
                    letterSpacing: '-0.01em',
                    marginBottom: '32px',
                    textShadow: '0 2px 12px rgba(0,0,0,0.35)',
                  }}
                >
                  We built this because we kept losing things.
                  Not physical things — but moments that mattered.
                </p>

                {/* Attribution */}
                <p
                  style={{
                    fontFamily: typography.fontFamily.serif,
                    fontWeight: typography.fontWeight.semibold,
                    fontSize: '18px',
                    color: '#FFFFFF',
                    letterSpacing: '0.03em',
                    marginBottom: '36px',
                    textShadow: '0 1px 4px rgba(0,0,0,0.20)',
                  }}
                >
                  The Horizons Team
                </p>

                {/* Primary pink button — same as hero CTA */}
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => setShowLetterModal(true)}
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.rose[600]} 0%, ${theme.colors.rose[700]} 100%)`,
                    fontSize: '15px',
                    padding: '13px 30px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.22), 0 8px 32px rgba(0,0,0,0.10)',
                  }}
                >
                  Read our letter →
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ========== HOW IT WORKS - Editorial Vertical Steps ========== */}
      <section
        id="how-it-works"
        style={{
          padding: '80px 40px 120px',
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
                marginBottom: '56px',
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
              description: 'Write a thought, attach a photo, record a voice note, or capture a video — anything worth keeping. The moment becomes a flower in your garden.',
              image: '/images/Moment to remember-rafiki.png',
              imageAlt: 'A person capturing a moment to remember',
              imageRight: false,
            },
            {
              number: '02',
              label: 'STEP 02',
              title: 'Choose when it blooms',
              description: 'Set it to open now, or seal it for later — a week, a month, a year. Build the anticipation. Let the moment unfold when it\'s meant to.',
              image: '/images/Flowers-rafiki.png',
              imageAlt: 'Flowers blooming — a memory coming to life',
              imageRight: true,
            },
            {
              number: '03',
              label: 'STEP 03',
              title: 'Grow your garden',
              description: "Every memory you plant adds to your private garden — a quiet, growing space that's entirely yours, or shared with the people you choose to invite.",
              image: '/images/Flowers-amico.png',
              imageAlt: 'A garden growing — a collection of memories',
              imageRight: false,
            },
            {
              number: '04',
              label: 'STEP 04',
              title: 'Send it as a flower',
              description: "Send it to someone who matters — a memory, delivered as a flower, waiting to be opened.",
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
      <UseCasesSection />

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
              A place where moments are kept with care
            </h2>
          </RevealOnScroll>

          {/* Panel row — 3 columns: Flower | Manifesto (wide) | Trust (slim) */}
          <RevealOnScroll delay={100}>
            <div className="why-horizons-grid" style={{
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
              }}>
                <img
                  src="/images/Default_A_mesmerizing_3D_illustration_of_a_delicate_cornflower_0_19deed4c-65ec-411d-8afd-76a72577a397_0.png"
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
                  { icon: VisibilityOffOutlinedIcon, headline: 'Yours, permanently', body: "No expiry. No algorithm. What you plant here stays here, exactly as you left it." },
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
                /* Phase 1 — What is this? */
                {
                  Icon: LocalFloristOutlinedIcon,
                  question: 'What is Horizons?',
                  answer: 'Horizons is a private 3D garden where you plant digital flowers to keep the moments that matter. Each flower holds a memory — a written message, a photo, a voice note, or a video. Some flowers open right away, sharing something with the people you care about immediately. Others can be set to bloom on a date you choose, so a moment arrives exactly when it\'s meant to. It\'s a quiet, personal space to preserve what\'s worth keeping, share something real with the people you love, and give memories a place to actually live.',
                },
                {
                  Icon: LocalFloristOutlinedIcon,
                  question: 'What is a blooming flower?',
                  answer: 'A blooming flower is a memory you save for a specific moment in the future. While it\'s still waiting to open, you can leave a small note for the recipient — a hint, a few words, something for them to hold onto while they wait. On the day it blooms, the flower opens and reveals everything inside: your full message, a photo, a voice note, or a video. They tap it to open it, and the moment arrives exactly when you intended.',
                },
                /* Phase 2 — How it works */
                {
                  Icon: IosShareOutlinedIcon,
                  question: 'What can I put inside a flower?',
                  answer: 'You can add a written message, a photo, a voice note, or a short video — or any combination of them. If the flower opens right away, everything inside is visible the moment it\'s opened. If you\'ve set a bloom date, you can also leave a small note that appears while the flower is still waiting — something for them to see in the meantime — and then the full message and any media you\'ve attached come through when it blooms. You can also choose a letter theme that wraps everything in a beautiful design: Romantic, Friendship, Family, Gratitude, Celebration, or Encouragement.',
                },
                {
                  Icon: IosShareOutlinedIcon,
                  question: 'How does sharing work? Does the recipient need an account?',
                  answer: "You invite people into your garden by email. They'll get a link and can join for free. Once they're in, they can explore the garden and open any flowers planted for them. No paid plan is required to receive or view a flower.",
                },
                {
                  Icon: IosShareOutlinedIcon,
                  question: 'Can I see a flower before it blooms?',
                  answer: "No — and that's the point. Once you set a bloom date, the flower stays sealed until that day arrives. Even you won't be able to see what's inside until it opens. This is what gives the moment its weight — the waiting is part of it.",
                },
                /* Phase 3 — Use cases */
                {
                  Icon: VisibilityOffOutlinedIcon,
                  question: 'Who is Horizons for?',
                  answer: 'Couples who want to share something more meaningful than a text. Parents capturing milestones as their children grow. Grandparents planting letters for grandchildren to open years from now. Friends who want to say something real. People going through grief who need a quiet place to remember. Anyone who has ever wanted to write to their future self — or leave something behind for someone they love.',
                },
                {
                  Icon: VisibilityOffOutlinedIcon,
                  question: 'Can I plant a flower for a milestone that is years away?',
                  answer: "Yes — there's no limit on how far in the future you can set a bloom date. Some people plant flowers set to open on a child's 18th birthday, on an anniversary a decade away, or on a date tied to someone who may not be around to deliver the message in person. The flower will wait as long as it needs to.",
                },
                /* Phase 4 — Pricing */
                {
                  Icon: CreditCardOutlinedIcon,
                  question: 'Is Horizons free to start?',
                  answer: 'Yes — no credit card required. The free plan gives you one private garden and lets you plant one flower per year, with all flower types and media options available. Pro unlocks up to 3 gardens, 50 flowers per year, 7 exclusive flower types, letter themes, and the ability to send a gift card with a flower. Premium (coming soon) expands to 30 gardens, 100 flowers per year, 3 rare flower types, and seasonal garden themes.',
                },
                {
                  Icon: CreditCardOutlinedIcon,
                  question: 'What is the difference between Pro and Premium?',
                  answer: 'Pro is built for people who want to grow multiple gardens and plant more frequently — up to 3 gardens, 50 flowers a year, 7 exclusive flower types, all 6 letter themes, and the ability to send a gift card alongside a flower. Premium (coming soon) is the full experience: up to 30 gardens, 100 flowers a year, 3 additional rare flower varieties, and seasonal garden themes that change throughout the year.',
                },
                {
                  Icon: CreditCardOutlinedIcon,
                  question: 'Can I cancel my subscription at any time?',
                  answer: 'Yes — cancel anytime from your profile, no questions asked. You keep full access until the end of your billing period.',
                },
                /* Phase 5 — Trust & privacy */
                {
                  Icon: LockOutlinedIcon,
                  question: 'Who can see my garden and my memories?',
                  answer: 'Only the people you personally invite. Your garden is completely private by default — nothing is visible to the public, nothing is searchable, and no one can find or enter it without an invitation from you. You decide who gets in.',
                },
                {
                  Icon: SaveOutlinedIcon,
                  question: 'Is my data encrypted and safe?',
                  answer: 'Yes. Everything you store in Horizons is encrypted while it travels and while it rests. We never sell your data, never use your memories to train AI, and never share anything with third parties. What you plant here stays yours.',
                },
              ].map(({ Icon, question, answer }, i) => {
                const isOpen = openFaqs.has(i);
                return (
                  <div
                    key={i}
                    style={{
                      borderTop: `1px solid ${theme.border.light}`,
                      ...(i === 11 ? { borderBottom: `1px solid ${theme.border.light}` } : {}),
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
                      maxHeight: isOpen ? '600px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      transition: 'max-height 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease',
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
          padding: '120px 40px 0px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F7 50%, #FDFCFA 100%)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* 1. Headline */}
          <RevealOnScroll>
            <h2
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontFamily: typography.fontFamily.serif,
                fontWeight: typography.fontWeight.normal,
                marginBottom: '48px',
                color: theme.text.primary,
                lineHeight: 1.2,
              }}
            >
              When you're ready,
              <br />
              your garden is waiting
            </h2>
          </RevealOnScroll>

          {/* 2. Button */}
          <RevealOnScroll delay={80}>
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

        {/* 3. Flower image — large, Claura-style centerpiece */}
        <RevealOnScroll delay={160}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '40px',
              marginBottom: '0',
            }}
          >
            <img
              src="/images/Default_A_delicately_rendered_3D_glassmorphism_flower_radiates_1_700f987d-038b-4bb7-bdff-feeaa85be7dc_0 1.png"
              alt=""
              style={{
                width: 'clamp(340px, 45vw, 600px)',
                height: 'auto',
                userSelect: 'none',
                pointerEvents: 'none',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                filter: 'drop-shadow(0 16px 48px rgba(212, 144, 154, 0.25))',
              }}
            />
          </div>
        </RevealOnScroll>
      </section>

      {/* ========== LETTER MODAL ========== */}
      {showLetterModal && (
        <div
          onClick={() => setShowLetterModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(28, 20, 14, 0.75)',
            backdropFilter: 'blur(12px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFEF9',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: 'clamp(40px, 6vw, 72px)',
              position: 'relative',
              boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
              border: '1px solid rgba(139, 115, 85, 0.12)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowLetterModal(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(61, 51, 64, 0.08)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: theme.text.tertiary,
                lineHeight: 1,
                transition: 'background 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(61, 51, 64, 0.14)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(61, 51, 64, 0.08)'; }}
            >
              ×
            </button>

            {/* Subtle paper lines */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(139, 115, 85, 0.03) 30px, rgba(139, 115, 85, 0.03) 31px)',
              borderRadius: '24px',
              pointerEvents: 'none',
            }} />

            {/* Letter header */}
            <h2
              style={{
                fontFamily: typography.fontFamily.serif,
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: typography.fontWeight.normal,
                color: theme.text.primary,
                textAlign: 'center',
                marginBottom: '48px',
                letterSpacing: '0.01em',
                position: 'relative',
              }}
            >
              A Letter About Horizons
            </h2>

            {/* Letter body */}
            <div
              style={{
                fontFamily: typography.fontFamily.serif,
                fontSize: 'clamp(16px, 1.8vw, 19px)',
                lineHeight: 2,
                color: theme.text.secondary,
                position: 'relative',
              }}
            >
              <p style={{ marginBottom: '28px' }}>
                We built this because we kept losing things.
              </p>
              <p style={{ marginBottom: '28px' }}>
                Not physical things — but moments. Conversations that mattered.
                Feelings we wanted to remember. Thoughts we had at 2am that felt important.
              </p>
              <p style={{ marginBottom: '28px' }}>
                Social media wasn't the answer. It's too public, too performative,
                too temporary.
              </p>
              <p style={{ marginBottom: '28px' }}>
                We needed something quieter. Something just for us. A place where
                memories could live without being judged, liked, or compared.
              </p>
              <p style={{ marginBottom: '28px', fontWeight: typography.fontWeight.medium, color: theme.text.primary }}>
                So we built Horizons.
              </p>
              <p style={{ marginBottom: '28px' }}>
                A private garden where memories grow as flowers. Plant them.
                Watch them bloom. Keep them forever.
              </p>
              <p
                style={{
                  marginTop: '48px',
                  fontStyle: 'italic',
                  textAlign: 'right',
                  color: theme.text.tertiary,
                  fontSize: 'clamp(15px, 1.6vw, 17px)',
                }}
              >
                — The Horizons Team
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
};
