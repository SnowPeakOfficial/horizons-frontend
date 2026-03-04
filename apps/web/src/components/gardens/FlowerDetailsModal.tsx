/**
 * FlowerDetailsModal - The Core Ritual of Horizons
 * A heartfelt letter experience that transforms data into meaning
 */

import React, { Suspense, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Modal } from '../common/Modal';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import type { Flower } from '../../types/api.types';
import type { FlowerDefinition } from '../../flowers/types';
import { FLOWER_DEFINITIONS } from '../../flowers/types';
import { FlowerBud } from '../../flowers/FlowerBud';
import { resolveLetterTemplate } from '../../flowers/letterTemplates';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import CardGiftcard from '@mui/icons-material/CardGiftcard';
import Image from '@mui/icons-material/Image';
import Mic from '@mui/icons-material/Mic';
import Videocam from '@mui/icons-material/Videocam';
import Photo from '@mui/icons-material/Photo';
import Spa from '@mui/icons-material/Spa';
import Close from '@mui/icons-material/Close';

interface FlowerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flower: Flower | null;
  definition: FlowerDefinition | null;
  onDelete?: (flowerId: string) => void;
  /** When true, shows a 2-second confetti burst over the letter (triggered by email deep-link) */
  fromEmail?: boolean;
}


/**
 * 3D Flower Preview - Anchored to the letter
 */
function FlowerPreview({ 
  modelPath, 
  scale,
  offset = [0, 0, 0]
}: { 
  modelPath: string; 
  scale: number;
  offset?: [number, number, number];
}) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  return (
    <primitive 
      object={clonedScene} 
      scale={scale}
      position={offset}
      rotation={[0, 0, 0]}
    />
  );
}

/**
 * Heart Garland - Subtle framing at top
 */
function HeartGarland({ garland, color }: { garland: string; color: string }) {
  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '14px',
      color,
      letterSpacing: '4px',
      opacity: 0.6,
      whiteSpace: 'nowrap',
    }}>
      {garland}
    </div>
  );
}

/**
 * Horizons Branding - Top center
 */
function HorizonsBranding() {
  return (
    <div style={{
      position: 'absolute',
      top: '36px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontFamily: typography.fontFamily.serif,
      fontSize: '13px',
      fontWeight: typography.fontWeight.normal,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: theme.text.tertiary,
      opacity: 0.5,
    }}>
      HORIZONS
    </div>
  );
}

/**
 * Body Decorations - Template-specific symbols placed at fixed positions inside the white card.
 * Positions are fully hardcoded in letterTemplates.ts so the layout is identical on every open.
 */
function BodyDecorations({ decorations, color }: {
  decorations: Array<{
    symbol: string;
    fontSize: string;
    opacity: number;
    top: string;
    side: 'left' | 'right';
    inset: number;
  }>;
  color: string;
}) {
  return (
    <>
      {decorations.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: d.top,
            left: d.side === 'left' ? `${d.inset}px` : undefined,
            right: d.side === 'right' ? `${d.inset}px` : undefined,
            fontSize: d.fontSize,
            color,
            opacity: d.opacity,
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {d.symbol}
        </div>
      ))}
    </>
  );
}

export const FlowerDetailsModal: React.FC<FlowerDetailsModalProps> = ({
  isOpen,
  onClose,
  flower,
  definition,
  onDelete,
  fromEmail = false,
}) => {
  const [showActions, setShowActions] = React.useState(false);
  const [mediaRevealed, setMediaRevealed] = React.useState(false);
  const [showGlow, setShowGlow] = React.useState(false);

  // canvas-confetti: only when fromEmail AND modal is open. Resets on close.
  React.useEffect(() => {
    if (!fromEmail || !isOpen || !flower || !definition) return;

    const tmplLocal = resolveLetterTemplate(flower.letterTemplate);

    // Template-aware palette — each letter type gets its own tone
    const templateColors: Record<string, string[]> = {
      romantic:     ['#E8A4B0', '#C2475D', '#F5D0D8', '#F0C8D0', '#FAE0E8', '#D4708A'],
      friendship:   ['#A8D5A2', '#4A7C59', '#C8E8C0', '#E0F0DC', '#B8DDB0', '#6AA070'],
      family:       ['#D4A96A', '#8B5E2A', '#F0D090', '#FAE8C0', '#E8C878', '#C09050'],
      gratitude:    ['#B5C8E8', '#3B6CB7', '#D0E0F8', '#E8F0FF', '#90B8E0', '#5A90D0'],
      celebration:  ['#C5A3E0', '#7B4FA6', '#E0C8F8', '#F0E0FF', '#D0A8F0', '#A070C8'],
      encouragement:['#F0C080', '#C47C00', '#F8D898', '#FFF0C0', '#E8B860', '#D09030'],
    };

    const key = flower.letterTemplate ?? 'romantic';
    const colors = templateColors[key] ?? [
      tmplLocal.accentColor,
      tmplLocal.frameColor,
      '#F9C6D0',
      '#E8D0F0',
      '#FFF0C0',
    ];

    setShowGlow(true);
    const glowTimer = setTimeout(() => setShowGlow(false), 900);

    // Two bursts — left and right — like iMessage celebration
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 },
      colors,
      scalar: 0.9,
      gravity: 0.9,
      ticks: 220,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.5 },
      colors,
      scalar: 0.9,
      gravity: 0.9,
      ticks: 220,
    });

    return () => {
      clearTimeout(glowTimer);
      confetti.reset();
    };
  }, [fromEmail, isOpen, flower, definition]);

  // Reset mediaRevealed when flower changes
  const prevFlowerIdRef = React.useRef<string | null>(null);
  if (prevFlowerIdRef.current !== (flower?.id ?? null)) {
    prevFlowerIdRef.current = flower?.id ?? null;
    // Resetting during render is allowed when guarded by a condition that changes identity
  }

  if (!flower || !definition) return null;

  // Mystery Mode: Hide flower identity for BLOOMING flowers that are still buds
  const isBud = flower.state === 'BUD';
  const isBloomed = flower.state === 'BLOOMED';
  const shouldHideIdentity = flower.type === 'BLOOMING' && isBud;

  // Extract data
  const plantedDate = new Date(flower.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const bloomAtDate = flower.bloomAt ? new Date(flower.bloomAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : null;

  const bloomedAtDate = flower.bloomedAt ? new Date(flower.bloomedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : null;

  // Extract content by phase
  // For BLOOMING flowers: SEED has the "before bloom" message, BLOOM has media + bloom message
  // For STANDARD flowers: IMMEDIATE has everything
  const seedContent = flower.content?.find(c =>
    c.phase === 'SEED' || c.phase === 'IMMEDIATE'
  );
  const bloomContent = flower.content?.find(c => c.phase === 'BLOOM');

  const seedMessage = seedContent?.text;

  // Media comes from BLOOM content (for BLOOMING flowers) or IMMEDIATE (for STANDARD)
  // Only show BLOOM media if the flower has actually bloomed
  const mediaContent = flower.type === 'BLOOMING'
    ? (isBloomed ? bloomContent : null)
    : seedContent;

  // Bloom-phase text message (only shown once flower has bloomed)
  const bloomMessage = isBloomed ? bloomContent?.text : null;

  const imageUrl = mediaContent?.imageUrl;
  const voiceUrl = mediaContent?.voiceUrl;
  const videoUrl = mediaContent?.videoUrl;

  // "hasMedia" means there's anything to reveal — media files or a bloom message
  const hasMedia = !!(imageUrl || voiceUrl || videoUrl || bloomMessage);

  // For STANDARD flowers (OPEN state) and already-BLOOMED flowers, show media directly.
  // Only use tap-to-reveal for BUD state — where the surprise is still intact.
  const showMediaDirectly = !isBud;
  
  // Fallback message if no seed message
  const getDefaultMessage = (flowerName: string): string => {
    const messages: Record<string, string> = {
      'rose': 'A symbol of care, planted to remind you that you matter.',
      'daisy': 'Simple beauty, like the moments we cherish most.',
      'sunflower': 'Warmth and light, planted to brighten your days.',
    };
    
    const key = flowerName.toLowerCase();
    return messages[key] || 'A quiet moment, preserved in petals. This flower holds a memory meant just for you.';
  };

  const displayMessage = seedMessage || getDefaultMessage(definition.name);

  // Sender & Recipient
  const senderName = flower.plantedBy?.name || "A friend";
  const recipientName = flower.recipientName || "you";

  // Display name based on mystery mode (must precede openingSentence)
  const displayName = shouldHideIdentity ? "mystery flower" : definition.name;

  // Resolve letter template
  const tmpl = resolveLetterTemplate(flower.letterTemplate);

  // Opening sentence with interpolated date and flower name
  const openingSentence = tmpl.openingSentence
    .replace('{date}', plantedDate)
    .replace('{flower}', displayName);

  // Model path, preview scale, and preview offset from centralized definitions
  const modelPath = definition.modelPath;
  // Get frontend definition using the backend flower key (stored in flower object)
  const backendKey = Object.keys(FLOWER_DEFINITIONS).find(key => 
    FLOWER_DEFINITIONS[key].id === definition.id
  );
  const frontendDef = backendKey ? FLOWER_DEFINITIONS[backendKey] : null;
  const previewScale = frontendDef?.previewScale || 2.5;
  const previewOffset = frontendDef?.previewOffset;

  // Bloom status
  const isBloomable = flower.type === 'BLOOMING';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="650px"
      showCloseButton={false}
      className="flower-letter-modal"
    >
      {/* Outer Frame - color driven by letter template */}
      <div style={{ ...outerFrameStyle, background: tmpl.frameColor }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ ...closeButtonStyle, background: `${tmpl.frameColor}66` }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.4';
          }}
          aria-label="Close letter"
        >
          <Close sx={{ fontSize: 20, color: tmpl.accentDark }} />
        </button>
        
        {/* Heart Garland */}
        <HeartGarland garland={tmpl.garland} color={tmpl.accentColor} />
        
        {/* Horizons Branding */}
        <HorizonsBranding />
        
        {/* White Letter Card - gradient driven by letter template */}
        <div style={{ ...whiteCardStyle, background: tmpl.cardGradient }}>
          
          {/* 3D Flower - Anchored to top-right edge */}
          <div style={{ ...flowerAnchorStyle, border: `3px solid ${tmpl.frameColor}` }}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 45 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <Suspense fallback={null}>
                {shouldHideIdentity ? (
                  <FlowerBud 
                    scale={2.64} 
                    color={definition.color}
                    position={[0, -1.5, 0]}
                  />
                ) : (
                  <FlowerPreview modelPath={modelPath} scale={previewScale} offset={previewOffset} />
                )}
              </Suspense>
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1.5}
              />
            </Canvas>
          </div>
          
          {/* Letter Content */}
          <div style={letterContentStyle}>
            
            {/* Greeting */}
            <div style={greetingStyle}>
              Dear {recipientName},
            </div>
            
            {/* Opening */}
            <div style={bodyStyle}>
              {openingSentence.split(/({date}|{flower})/g).length > 1
                ? openingSentence
                : openingSentence}
            </div>
            
            {/* Seed Message - Simplified for elegance */}
            <div style={enhancedMessageStyle}>
              <div style={messageTextStyle}>
                {displayMessage}
              </div>
            </div>
            
            {/* Media Section */}
            {hasMedia && (
              <>
                {!showMediaDirectly && !mediaRevealed ? (
                  /* BUD state only — tap-to-reveal surprise mechanic */
                  <div 
                    style={{
                      ...mediaRevealButtonStyle,
                      background: `${tmpl.frameColor}33`,
                      border: `2px dashed ${tmpl.accentColor}66`,
                      color: tmpl.accentDark,
                    }}
                    onClick={() => setMediaRevealed(true)}
                  >
                    <CardGiftcard sx={{ fontSize: 32, color: tmpl.accentColor, marginBottom: '8px' }} />
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      Something is waiting for you
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.8 }}>
                      Opens when this flower blooms
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '14px', display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
                      {imageUrl && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Image sx={{ fontSize: 18 }} /> Photo
                        </span>
                      )}
                      {voiceUrl && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mic sx={{ fontSize: 18 }} /> Voice
                        </span>
                      )}
                      {videoUrl && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Videocam sx={{ fontSize: 18 }} /> Video
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* OPEN or BLOOMED — show media directly in the letter */
                  <div style={mediaGridStyle}>
                    {/* Bloom message (text that came with the BLOOM phase) */}
                    {bloomMessage && (
                      <div style={{ ...mediaItemStyle, border: `1px solid ${tmpl.accentColor}33` }}>
                        <div style={{ ...mediaLabelStyle, color: tmpl.accentColor }}>
                          🌸 A message that waited for you
                        </div>
                        <div style={{ ...messageTextStyle, textAlign: 'left' }}>
                          {bloomMessage}
                        </div>
                      </div>
                    )}

                    {imageUrl && (
                      <div style={{ ...mediaItemStyle, border: `1px solid ${tmpl.accentColor}33` }}>
                        <div style={{ ...mediaLabelStyle, color: tmpl.accentColor }}>
                          <Photo sx={{ fontSize: 18, verticalAlign: 'middle', marginRight: '6px', color: tmpl.accentColor }} />
                          Photo
                        </div>
                        <img
                          src={imageUrl}
                          alt="Memory"
                          style={mediaImageStyle}
                        />
                      </div>
                    )}

                    {voiceUrl && (
                      <div style={{ ...mediaItemStyle, border: `1px solid ${tmpl.accentColor}33` }}>
                        <div style={{ ...mediaLabelStyle, color: tmpl.accentColor }}>
                          <Mic sx={{ fontSize: 18, verticalAlign: 'middle', marginRight: '6px', color: tmpl.accentColor }} />
                          Voice Message
                        </div>
                        <audio
                          controls
                          src={voiceUrl}
                          style={mediaAudioStyle}
                        />
                      </div>
                    )}

                    {videoUrl && (
                      <div style={{ ...mediaItemStyle, border: `1px solid ${tmpl.accentColor}33` }}>
                        <div style={{ ...mediaLabelStyle, color: tmpl.accentColor }}>
                          <Videocam sx={{ fontSize: 18, verticalAlign: 'middle', marginRight: '6px', color: tmpl.accentColor }} />
                          Video
                        </div>
                        <video
                          controls
                          src={videoUrl}
                          style={mediaVideoStyle}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            {/* Bloom Status - If applicable */}
            {isBloomable && isBud && bloomAtDate && (
              <div style={bloomInfoStyle}>
                <Spa sx={{ fontSize: 18, verticalAlign: 'middle', marginRight: '6px', color: theme.semantic.success }} />
                This flower will bloom on{' '}
                <span style={dateHighlightStyle}>{bloomAtDate}</span>, revealing its message.
              </div>
            )}
            
            {isBloomable && isBloomed && bloomedAtDate && (
              <div style={bloomInfoStyle}>
                <LocalFlorist sx={{ fontSize: 18, verticalAlign: 'middle', marginRight: '6px', color: theme.colors.rose[500] }} />
                This flower bloomed on{' '}
                <span style={dateHighlightStyle}>{bloomedAtDate}</span>{' '}
                and revealed its heartfelt message.
              </div>
            )}
            
            {/* Symbolism Quote - Hide for buds to preserve mystery */}
            {!shouldHideIdentity && (
              <div style={quoteContainerStyle}>
                <div style={quoteStyle}>
                  "{definition.symbolism}"
                </div>
              </div>
            )}
            
            {/* Sign-Off */}
            <div style={signOffContainerStyle}>
              <div style={signOffStyle}>{tmpl.signOff}</div>
              <div style={senderNameStyle}>{senderName}</div>
            </div>
            
          </div>
          
          {/* Body Decorations - template-specific symbols scattered throughout the card */}
          <BodyDecorations decorations={tmpl.bodyDecorations} color={tmpl.accentColor} />
          
        </div>
        
        {/* Hidden Actions Menu */}
        <div 
          style={actionsMenuStyle}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <MoreHoriz sx={{ fontSize: 20, color: theme.colors.rose[600] }} />
          
          {showActions && onDelete && (
            <div style={actionsDropdownStyle}>
              <button
                onClick={() => {
                  if (window.confirm('Remove this flower from your garden?')) {
                    onDelete(flower.id);
                    onClose();
                  }
                }}
                style={deleteButtonStyle}
              >
                Delete flower
              </button>
            </div>
          )}
        </div>
        
      </div>
      
      {/* ── Glow pulse behind flower anchor (fromEmail only) ── */}
      {showGlow && (
        <>
          <style>{`
            @keyframes petalGlow {
              0%   { box-shadow: 0 0 0 0 ${tmpl.accentColor}55; transform: scale(0.8); opacity: 0.8; }
              50%  { box-shadow: 0 0 40px 20px ${tmpl.accentColor}33; }
              100% { box-shadow: 0 0 60px 40px ${tmpl.accentColor}00; transform: scale(1.2); opacity: 0; }
            }
          `}</style>
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '32px',
            width: '156px',
            height: '156px',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: 'petalGlow 900ms ease-out forwards',
            zIndex: 15,
          }} />
        </>
      )}

      {/* Animations + scoped scrollbar theming */}
      <style>{`
        .flower-letter-modal {
          scrollbar-width: thin;
          scrollbar-color: ${tmpl.frameColor} transparent;
        }
        .flower-letter-modal::-webkit-scrollbar {
          width: 6px;
        }
        .flower-letter-modal::-webkit-scrollbar-track {
          background: transparent;
        }
        .flower-letter-modal::-webkit-scrollbar-thumb {
          background-color: ${tmpl.frameColor};
          border-radius: 3px;
        }

        @keyframes unfoldLetter {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes gentleRotateIn {
          from {
            opacity: 0;
            transform: rotate(-15deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Modal>
  );
};

// ============================================
// STYLES - The Core Ritual Design
// ============================================

// outerFrameStyle is now generated dynamically in the component
// (kept as a function below — see getOuterFrameStyle)
const outerFrameStyle: React.CSSProperties = {
  position: 'relative',
  background: theme.colors.rose[300],
  borderRadius: '16px',
  padding: '40px',
  boxShadow: theme.shadow['2xl'],
  animation: 'unfoldLetter 0.4s ease-out',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(212, 144, 154, 0.4)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.2s ease',
  boxShadow: 'none',
  zIndex: 10,
  opacity: 0.4,
};

const whiteCardStyle: React.CSSProperties = {
  position: 'relative',
  background: 'linear-gradient(135deg, #FFFEF9 0%, #FFF9F0 100%)', // Warm paper tone
  borderRadius: '12px',
  padding: '64px 48px 48px 48px',
  marginTop: '48px', // Space for branding
  boxShadow: '0 4px 16px rgba(61, 51, 64, 0.08)',
};

const flowerAnchorStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-30px', // Overlap the card edge
  right: '32px',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  overflow: 'hidden',
  background: '#FFFFFF',
  boxShadow: '0 8px 24px rgba(61, 51, 64, 0.12)', // Cast shadow on card
  border: `3px solid ${theme.colors.rose[200]}`,
  animation: 'gentleRotateIn 0.6s ease-out 0.2s both',
};

const letterContentStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
};

const greetingStyle: React.CSSProperties = {
  fontFamily: "'Caveat', cursive",
  fontSize: 'clamp(1.75rem, 2vw + 0.5rem, 2rem)', // 28px → 32px (reduced from 34px)
  fontWeight: 600,
  color: theme.text.primary,
  marginBottom: '32px',
  lineHeight: 1.3,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.serif,
  fontSize: '17px',
  color: theme.text.primary,
  lineHeight: 2.2,
  marginBottom: '28px',
  letterSpacing: '0.3px',
};


const dateHighlightStyle: React.CSSProperties = {
  fontWeight: 600,
  color: theme.colors.rose[600],
};

// Enhanced message styles - Simplified for elegance
const enhancedMessageStyle: React.CSSProperties = {
  marginBottom: '40px',
  padding: '40px 32px',
  background: 'rgba(255, 250, 245, 0.3)',
  borderRadius: '12px',
  border: `1px solid rgba(212, 144, 154, 0.15)`,
};

const messageTextStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.serif,
  fontSize: '17px',
  color: theme.text.primary,
  lineHeight: 2.2,
  textAlign: 'center',
  letterSpacing: '0.2px',
};

// Media reveal button
const mediaRevealButtonStyle: React.CSSProperties = {
  marginBottom: '32px',
  padding: '24px',
  background: 'linear-gradient(135deg, rgba(255, 201, 217, 0.3) 0%, rgba(255, 220, 230, 0.3) 100%)',
  borderRadius: '12px',
  border: `2px dashed ${theme.colors.rose[300]}`,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: theme.colors.rose[700],
  fontFamily: typography.fontFamily.serif,
};

// Media grid and items
const mediaGridStyle: React.CSSProperties = {
  marginBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  animation: 'fadeIn 0.5s ease-in',
};

const mediaItemStyle: React.CSSProperties = {
  padding: '20px',
  background: 'rgba(255, 250, 245, 0.5)',
  borderRadius: '12px',
  border: `1px solid ${theme.colors.rose[200]}`,
};

const mediaLabelStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.serif,
  fontSize: '14px',
  fontWeight: 600,
  color: theme.colors.rose[600],
  marginBottom: '12px',
};

const mediaImageStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: '400px',
  objectFit: 'contain',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const mediaAudioStyle: React.CSSProperties = {
  width: '100%',
  outline: 'none',
};

const mediaVideoStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: '400px',
  borderRadius: '8px',
  outline: 'none',
};

const bloomInfoStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.serif,
  fontSize: '15px',
  color: theme.text.secondary,
  lineHeight: 1.8,
  marginBottom: '32px',
  padding: '16px 20px',
  background: 'rgba(255, 252, 245, 0.8)',
  borderRadius: '8px',
  border: `1.5px solid ${theme.colors.gold[300]}`,
  textAlign: 'center',
};

const quoteContainerStyle: React.CSSProperties = {
  margin: '48px 0',
  textAlign: 'center',
};

const quoteStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.serif,
  fontSize: '16px',
  fontStyle: 'italic',
  color: theme.text.secondary,
  lineHeight: 2.0,
  maxWidth: '420px',
  margin: '0 auto',
  letterSpacing: '0.5px',
};

const signOffContainerStyle: React.CSSProperties = {
  marginTop: '56px',
  textAlign: 'right',
};

const signOffStyle: React.CSSProperties = {
  fontFamily: "'Caveat', cursive",
  fontSize: 'clamp(1.75rem, 2vw + 0.25rem, 1.875rem)', // 28px → 30px (reduced from 32px)
  fontWeight: 600,
  color: theme.text.primary,
  marginBottom: '0',
  lineHeight: 1.3,
};

const senderNameStyle: React.CSSProperties = {
  fontFamily: "'Caveat', cursive",
  fontSize: 'clamp(1.75rem, 2vw + 0.25rem, 1.875rem)', // 28px → 30px (reduced from 32px)
  fontWeight: 600,
  color: theme.text.primary,
  lineHeight: 1.3,
};

const actionsMenuStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '16px',
  left: '16px',
  padding: '8px',
  cursor: 'pointer',
  borderRadius: '50%',
  transition: theme.transition.fast,
  opacity: 0.4,
};

const actionsDropdownStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '100%',
  left: '0',
  marginBottom: '8px',
  background: '#FFFFFF',
  borderRadius: '8px',
  boxShadow: theme.shadow.lg,
  padding: '4px',
  minWidth: '140px',
};

const deleteButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 16px',
  background: 'transparent',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  color: theme.colors.rose[700],
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: typography.fontFamily.serif,
  transition: theme.transition.fast,
};
