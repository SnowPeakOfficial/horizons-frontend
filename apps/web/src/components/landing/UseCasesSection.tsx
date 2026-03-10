/**
 * UseCasesSection — Photo-background cards matching Founder's Note style
 * - Real flower-field photo base with blurred bokeh periphery
 * - Per-card brand pink tint via multiply blend
 * - White pill tags with pink text
 * - Film grain texture (Claura signature)
 * - Section heading matches other sections (label + large h2)
 */

import React from 'react';
import { typography } from '../../styles/typography';
import { theme } from '../../styles/theme';

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

const GRAIN_SVG_A = `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.50' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.38'/%3E%3C/svg%3E")`;
const GRAIN_SVG_B = `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.50' numOctaves='4' stitchTiles='stitch' seed='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g2)' opacity='0.22'/%3E%3C/svg%3E")`;

const cards = [
  {
    // Warm amber-cream — matches orange/yellow/gold/cream glass flower
    bg: 'linear-gradient(160deg, #fdf0e0 0%, #f0d4a0 40%, #e0b870 100%)',
    glowColor: 'rgba(240, 190, 100, 0.65)',
    shadowColor: 'rgba(200, 140, 40, 0.40)',
    flowerSrc: '/images/Default_A_delicate_intricately_designed_3D_glass_flower_with_s_3_0df29597-2de3-4b9b-b21e-b189c6a4b42c_0.png',
    tags: ['Anniversaries', 'Long-distance', 'Just because'],
    headline: 'For the ones who matter most',
    quote: '"She opened it on the train home. I wasn\'t there — but somehow, I was."',
    label: 'FOR LOVED ONES',
  },
  {
    // Blush-to-violet — matches peach/cream/pink-violet peony
    bg: 'linear-gradient(160deg, #f8eef4 0%, #ead4e8 40%, #d0b0d8 100%)',
    glowColor: 'rgba(210, 160, 210, 0.65)',
    shadowColor: 'rgba(160, 100, 180, 0.40)',
    flowerSrc: '/images/Default_A_delicate_translucent_3D_peony_depicted_in_a_sleek_gl_1_ea84b303-9941-4a01-a727-b0366c3d4aa6_0.png',
    tags: ['Milestones', 'Recognition', 'Achievements'],
    headline: 'For the people you build with',
    quote: '"He\'d been with us five years. A card felt small. So we planted something lasting."',
    label: 'FOR YOUR TEAM',
  },
  {
    // Cool slate-blue — matches blue/white/dark-blue glass flower
    bg: 'linear-gradient(160deg, #e8eef8 0%, #c8d8f0 40%, #a8c0e4 100%)',
    glowColor: 'rgba(140, 180, 240, 0.65)',
    shadowColor: 'rgba(60, 120, 200, 0.40)',
    flowerSrc: '/images/Default_A_highly_detailed_intricately_designed_3D_glass_flower_4_713d0b00-a8e9-41b7-9d42-166af3c21d76_0 1.png',
    tags: ['Growth', 'Milestones', 'Reflection'],
    headline: "For the person you're becoming",
    quote: '"I planted it the day everything shifted. I open it when I forget how far I\'ve come."',
    label: 'FOR YOURSELF',
  },
];

export const UseCasesSection: React.FC = () => (
  <section style={{ padding: '120px 40px', background: '#FFFFFF' }}>
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header — matches How It Works / Why Horizons style */}
      <Reveal>
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
          marginBottom: '72px',
          color: theme.text.primary,
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
                boxShadow: '0 12px 40px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              {/* Layer 1 — Gradient background */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: card.bg,
                pointerEvents: 'none',
              }} />

              {/* Layer 2 — Radial glow centered where flower sits */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse 70% 55% at 50% 48%, ${card.glowColor} 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              {/* Layer 3 — Blurred flower ghost — bright, light bokeh fill */}
              <img
                src={card.flowerSrc}
                alt=""
                style={{
                  position: 'absolute',
                  top: '38%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) scale(1.8)',
                  width: '100%',
                  maxWidth: '520px',
                  height: 'auto',
                  filter: 'blur(38px) saturate(2.0) brightness(1.35)',
                  opacity: 0.70,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />

              {/* Layer 4 — Light bottom fade (no dark overlay) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.10) 65%, rgba(255,255,255,0.30) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Layer 5 — Film grain pass A (soft-light) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: GRAIN_SVG_A,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '180px 180px',
                  opacity: 1,
                  mixBlendMode: 'soft-light' as const,
                  pointerEvents: 'none',
                }}
              />

              {/* Layer 6 — Film grain pass B (overlay) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: GRAIN_SVG_B,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '180px 180px',
                  opacity: 0.5,
                  mixBlendMode: 'overlay' as const,
                  pointerEvents: 'none',
                }}
              />

              {/* Tags — top, centered white pills with pink text */}
              <div style={{
                position: 'relative',
                zIndex: 5,
                display: 'flex',
                flexWrap: 'wrap' as const,
                justifyContent: 'center',
                gap: '8px',
                padding: '24px 16px 0',
              }}>
                {card.tags.map((tag, j) => (
                  <span key={j} style={{
                    fontSize: '12px',
                    color: theme.colors.rose[600],
                    background: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontFamily: typography.fontFamily.serif,
                    letterSpacing: '0.02em',
                    fontWeight: typography.fontWeight.bold,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                  }}>{tag}</span>
                ))}
              </div>

              {/* Flower zone — bigger, centered hero */}
              <div style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 16px 8px',
                position: 'relative',
                zIndex: 5,
              }}>
                <img
                  src={card.flowerSrc}
                  alt=""
                  style={{
                    width: '100%',
                    maxWidth: '380px',
                    height: 'auto',
                    objectFit: 'contain',
                    position: 'relative',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    filter: `drop-shadow(0 20px 56px ${card.shadowColor}) saturate(1.25)`,
                  }}
                />
              </div>

              {/* Text — bottom, dark text on light gradient */}
              <div style={{
                position: 'relative',
                zIndex: 5,
                padding: '0 28px 36px',
              }}>
                <h3 style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: 'clamp(22px, 2.4vw, 28px)',
                  fontWeight: typography.fontWeight.semibold,
                  color: 'rgba(40, 20, 30, 0.92)',
                  lineHeight: 1.25,
                  marginBottom: '12px',
                  letterSpacing: '-0.01em',
                }}>
                  {card.headline}
                </h3>

                <p style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: 'rgba(40, 20, 30, 0.60)',
                  lineHeight: 1.75,
                  marginBottom: '20px',
                }}>
                  {card.quote}
                </p>

                <p style={{
                  fontFamily: typography.fontFamily.serif,
                  fontSize: '10px',
                  fontWeight: typography.fontWeight.semibold,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(40, 20, 30, 0.38)',
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
          color: theme.text.tertiary,
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
