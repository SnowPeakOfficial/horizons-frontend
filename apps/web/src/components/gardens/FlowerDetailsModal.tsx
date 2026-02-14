/**
 * FlowerDetailsModal - The Core Ritual of Horizons
 * A heartfelt letter experience that transforms data into meaning
 */

import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Modal } from '../common/Modal';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import type { Flower } from '../../types/api.types';
import type { FlowerDefinition } from '../../flowers/types';
import { FLOWER_DEFINITIONS } from '../../flowers/types';
import { FlowerBud } from '../../flowers/FlowerBud';
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
}

/**
 * 3D Flower Preview - Anchored to the letter
 */
function FlowerPreview({ modelPath, scale }: { modelPath: string; scale: number }) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  return (
    <primitive 
      object={clonedScene} 
      scale={scale}
      rotation={[0, 0, 0]}
    />
  );
}

/**
 * Heart Garland - Subtle framing at top
 */
function HeartGarland() {
  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '14px',
      color: theme.colors.rose[600],
      letterSpacing: '4px',
      opacity: 0.6,
    }}>
      ♡―♥︎―♡
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
 * Doodle Hearts - Subtle decoration
 */
function DoodleHearts() {
  return (
    <>
      <div style={{
        position: 'absolute',
        top: '45%',
        right: '32px',
        fontSize: '16px',
        color: theme.colors.rose[400],
        opacity: 0.4,
      }}>
        ♡
      </div>
      <div style={{
        position: 'absolute',
        bottom: '140px',
        left: '32px',
        fontSize: '14px',
        color: theme.colors.rose[600],
        opacity: 0.3,
      }}>
        ♥︎
      </div>
    </>
  );
}

export const FlowerDetailsModal: React.FC<FlowerDetailsModalProps> = ({
  isOpen,
  onClose,
  flower,
  definition,
  onDelete
}) => {
  const [showActions, setShowActions] = React.useState(false);
  const [mediaRevealed, setMediaRevealed] = React.useState(false);

  // Reset media reveal state when modal opens/closes
  useEffect(() => {
    setMediaRevealed(false);
  }, [isOpen]);

  if (!flower || !definition) return null;

  // Mystery Mode: Hide flower identity for BLOOMING flowers that are still buds
  const isBud = flower.state === 'BUD';
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

  // Extract content - seed message and media
  const seedContent = flower.content?.find(c => 
    c.phase === 'SEED' || c.phase === 'IMMEDIATE'
  );
  
  const seedMessage = seedContent?.text;
  const imageUrl = seedContent?.imageUrl;
  const voiceUrl = seedContent?.voiceUrl;
  const videoUrl = seedContent?.videoUrl;
  
  const hasMedia = !!(imageUrl || voiceUrl || videoUrl);
  const mediaCount = [imageUrl, voiceUrl, videoUrl].filter(Boolean).length;
  
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

  // Sign-off tone (metadata-driven)
  const signOffTone = "With love,"; // TODO: Make this selectable enum

  // Model path and preview scale from centralized definitions
  const modelPath = definition.modelPath;
  // Get frontend definition using the backend flower key (stored in flower object)
  const backendKey = Object.keys(FLOWER_DEFINITIONS).find(key => 
    FLOWER_DEFINITIONS[key].id === definition.id
  );
  const frontendDef = backendKey ? FLOWER_DEFINITIONS[backendKey] : null;
  const previewScale = frontendDef?.previewScale || 2.5;

  // Bloom status
  const isBloomable = flower.type === 'BLOOMING';
  const isBloomed = flower.state === 'BLOOMED';

  // Display name based on mystery mode
  const displayName = shouldHideIdentity ? "mystery flower" : definition.name;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="650px"
      showCloseButton={false}
    >
      {/* Outer Pink Frame - Full extent to modal edges */}
      <div style={outerFrameStyle}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.4';
          }}
          aria-label="Close letter"
        >
          <Close sx={{ fontSize: 20, color: theme.colors.rose[700] }} />
        </button>
        
        {/* Heart Garland */}
        <HeartGarland />
        
        {/* Horizons Branding */}
        <HorizonsBranding />
        
        {/* White Letter Card */}
        <div style={whiteCardStyle}>
          
          {/* 3D Flower - Anchored to top-right edge */}
          <div style={flowerAnchorStyle}>
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
                  <FlowerPreview modelPath={modelPath} scale={previewScale} />
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
              On <span style={dateHighlightStyle}>{plantedDate}</span>, this beautiful{' '}
              <span style={flowerNameStyle}>{displayName}</span> was planted just for you.
            </div>
            
            {/* Seed Message - Simplified for elegance */}
            <div style={enhancedMessageStyle}>
              <div style={messageTextStyle}>
                {displayMessage}
              </div>
            </div>
            
            {/* Media Reveal Section */}
            {hasMedia && (
              <>
                {!mediaRevealed ? (
                  /* Unrevealed - Show tap to reveal button */
                  <div 
                    style={mediaRevealButtonStyle}
                    onClick={() => setMediaRevealed(true)}
                  >
                    <CardGiftcard sx={{ fontSize: 32, color: theme.colors.rose[500], marginBottom: '8px' }} />
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      Something was left for you
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.8 }}>
                      Open {mediaCount} {mediaCount === 1 ? 'keepsake' : 'keepsakes'}
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
                  /* Revealed - Show media */
                  <div style={mediaGridStyle}>
                    {imageUrl && (
                      <div style={mediaItemStyle}>
                        <div style={mediaLabelStyle}>
                          <Photo sx={{ fontSize: 18, verticalAlign: 'middle', marginRight: '6px' }} />
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
                      <div style={mediaItemStyle}>
                        <div style={mediaLabelStyle}>
                          <Mic sx={{ fontSize: 18, verticalAlign: 'middle', marginRight: '6px' }} />
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
                      <div style={mediaItemStyle}>
                        <div style={mediaLabelStyle}>
                          <Videocam sx={{ fontSize: 18, verticalAlign: 'middle', marginRight: '6px' }} />
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
                <span style={dateHighlightStyle}>{bloomAtDate}</span>,
                revealing its message.
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
              <div style={signOffStyle}>{signOffTone}</div>
              <div style={senderNameStyle}>{senderName}</div>
            </div>
            
          </div>
          
          {/* Subtle Doodle Hearts */}
          <DoodleHearts />
          
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
      
      {/* Animations */}
      <style>{`
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

const outerFrameStyle: React.CSSProperties = {
  position: 'relative',
  background: theme.colors.rose[300], // Soft pink frame
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
  fontSize: '34px',
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

const flowerNameStyle: React.CSSProperties = {
  fontWeight: 600,
  color: theme.colors.rose[700],
  fontStyle: 'italic',
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
  fontSize: '32px',
  fontWeight: 600,
  color: theme.text.primary,
  marginBottom: '0',
  lineHeight: 1.3,
};

const senderNameStyle: React.CSSProperties = {
  fontFamily: "'Caveat', cursive",
  fontSize: '32px',
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
