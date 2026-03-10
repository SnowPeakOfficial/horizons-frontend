/**
 * UseCasesSection — Claura-inspired premium cards
 * Visual upgrades applied:
 * 1. Tighter, brighter per-card accentGlow (pink/gold/blue)
 * 2. Cinematic edge vignette (radial-gradient darkens edges)
 * 3. Blurred white halo <div> behind flower (light-from-inside effect)
 * 4. Larger flower: 92% / 320px max
 * 5. Richer flower drop-shadow + saturate(1.1)
 * 6. Taller cards: 600px min-height
 * 7. Darker tag pills: rgba(0,0,0,0.35)
 */

import React from 'react';
import { typography } from '../../styles/typography';

interface RevealProps { children: React.ReactNode; delay?: number; }
const Reveal: React.FC<RevealProps> = ({ children, delay = 0 }) => {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.10 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        filter: visible ? 'blur(0)' : 'blur(3px)',
        transition: `all 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`;

const cards = [
  {
    bg: 'linear-gradient(160deg, #2a1520 0%, #3d1a28 35%, #1e0f18 70%, #160c14 100%)',
    // Tight, bright pink glow — directly behind flower center
    accentGlow: 'radial-gradient(ellipse 40% 35% at 50% 45%, rgba(220,90,140,0.45) 0%, transparent 70%)',
    haloColor: 'rgba(240,120,160,0.18)',
    flowerSrc: '/images/Default_A_highly_detailed_futuristic_3D_glassmorphic_rose_with_0_6a5c6c2e-1e5d-4720-9250-3614d67b28b3_0.png',
    tags: ['Anniversaries', 'Long-distance', 'Just because'],
    headline: 'For the ones who matter most',
    quote: '"She opened it on the train home. I wasn\'t there — but somehow, I was."',
    label: 'FOR LOVED ONES',
  },
  {
    bg: 'linear-gradient(160deg, #1e1a12 0%, #2e2416 35%, #1a1508 70%, #120f06 100%)',
    // Tight, bright gold glow
    accentGlow: 'radial-gradient(ellipse 40% 35% at 50% 45%, rgba(255,180,80,0.40) 0%, transparent 70%)',
    haloColor: 'rgba(255,200,100,0.15)',
    flowerSrc: '/images/Default_A_delicate_translucent_3D_peony_depicted_in_a_sleek_gl_1_ea84b303-9941-4a01-a727-b0366c3d4aa6_0.png',
    tags: ['Milestones', 'Recognition', 'Achievements'],
    headline: 'For the people you build with',
    quote: '"He\'d been with us five years. A card felt small. So we planted something lasting."',
    label: 'FOR YOUR TEAM',
  },
  {
    bg: 'linear-gradient(160deg, #0e1c22 0%, #142530 35%, #0b1820 70%, #09121a 100%)',
    // Tight, bright blue glow
    accentGlow: 'radial-gradient(ellipse 40% 35% at 50% 45%, rgba(80,160,220,0.40) 0%, transparent 70%)',
    haloColor: 'rgba(80,180,240,0.15)',
    flowerSrc: '/images/Default_A_mesmerizing_3D_illustration_of_a_delicate_cornflower_0_19deed4c-65ec-411d-8afd-76a72577a397_0.png',
    tags: ['Growth', 'Milestones', 'Reflection'],
    headline: "For the person you're becoming",
    quote: '"I planted it the day everything shifted. I open it when I forget how far I\'ve come."',
    label: 'FOR YOURSELF',
  },
];

export const UseCasesSection: React.FC = () => (
  <section style={{ padding: '120px 40px', background: '#FFFFFF' }}>
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <Reveal>
        <p style={{
          fontFamily: typography.fontFamily.serif,
          fontSize: '13px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
          color: 'rgba(61,51,64,0.45)',
          textAlign: 'center',
          marginBottom: '20px',
        }}>Use cases</p>
        <h2 style={{
          fontSize: 'clamp(40px, 5.5vw, 64px)',
          fontFamily: typography.fontFamily.serif,
          fontWeight: 400,
          textAlign: 'center',
          marginBottom: '72px',
          color: '#3d3340',
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
        }}>
          Every moment deserves a place to grow.
        </h2>
      </Reveal>

      {/* Card grid */}
      <Reveal delay={80}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                minHeight: '600px',
                background: card.bg,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Layer 1: Tight color glow behind flower */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: card.accentGlow,
                pointerEvents: 'none',
                zIndex: 1,
              }} />

              {/* Layer 2: Cinematic edge vignette — darkens all 4 corners/edges */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(120% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)',
                pointerEvents: 'none',
                zIndex: 2,
              }} />

              {/* Layer 3: Grain texture overlay — Claura signature */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: GRAIN_SVG,
                backgroundRepeat: 'repeat',
                backgroundSize: '160px 160px',
                opacity: 0.8,
                mixBlendMode: 'overlay' as const,
                pointerEvents: 'none',
                zIndex: 3,
              }} />

              {/* Tags — top */}
              <div style={{
                position: 'relative',
                zIndex: 5,
                display: 'flex',
                flexWrap: 'wrap' as const,
                gap: '8px',
                padding: '24px 24px 0',
              }}>
                {card.tags.map((tag, j) => (
                  <span key={j} style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.78)',
                    background: 'rgba(0,0,0,0.35)',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontFamily: typography.fontFamily.serif,
                    letterSpacing: '0.02em',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>{tag}</span>
                ))}
              </div>

              {/* Flower zone — flex center, generous vertical space */}
              <div style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 32px 16px',
                position: 'relative',
                zIndex: 5,
              }}>
                {/* Blurred luminous halo behind flower — "light from inside" */}
                <div style={{
                  position: 'absolute',
                  width: '220px',
                  height: '220px',
                  background: `radial-gradient(circle, ${card.haloColor}, transparent 70%)`,
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                }} />

                {/* Sharp flower — the centrepiece */}
                <img
                  src={card.flowerSrc}
                  alt=""
                  style={{
                    width: '92%',
                    maxWidth: '320px',
                    height: 'auto',
                    objectFit: 'contain',
                    position: 'relative',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.6)) saturate(1.1)',
                  }}
                />
              </div>

              {/* Text — bottom */}
              <div style={{
                position: 'relative',
                zIndex: 5,
                padding: '0 28px 36px',
              }}>
                <h3 style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: 'clamp(22px, 2.4vw, 30px)',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  lineHeight: 1.25,
                  marginBottom: '16px',
                  letterSpacing: '-0.01em',
                }}>
                  {card.headline}
                </h3>

                <p style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.60)',
                  lineHeight: 1.75,
                  marginBottom: '20px',
                }}>
                  {card.quote}
                </p>

                <p style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(255,255,255,0.35)',
                }}>
                  {card.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Pull-quote */}
      <Reveal delay={120}>
        <p style={{
          fontFamily: typography.fontFamily.serif,
          fontSize: 'clamp(20px, 2.5vw, 28px)',
          fontStyle: 'italic',
          color: 'rgba(61,51,64,0.38)',
          textAlign: 'center',
          marginTop: '72px',
          letterSpacing: '0.01em',
          lineHeight: 1.6,
        }}>
          "Some moments deserve forever."
        </p>
      </Reveal>

    </div>
  </section>
);
