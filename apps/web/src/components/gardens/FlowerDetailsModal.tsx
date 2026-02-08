/**
 * FlowerDetailsModal - The Core Ritual of Horizons
 * A heartfelt letter experience that transforms data into meaning
 */

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Modal } from '../common/Modal';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import type { Flower } from '../../types/api.types';
import type { FlowerDefinition } from '../../flowers/types';
import MoreHoriz from '@mui/icons-material/MoreHoriz';

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
function FlowerPreview({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  return (
    <primitive 
      object={clonedScene} 
      scale={2.5}
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

  if (!flower || !definition) return null;

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

  // Message content - Beautiful, varied fallback messages
  const getDefaultMessage = (flowerName: string): string => {
    const messages: Record<string, string> = {
      'rose': 'A symbol of care, planted to remind you that you matter.',
      'daisy': 'Simple beauty, like the moments we cherish most.',
      'sunflower': 'Warmth and light, planted to brighten your days.',
    };
    
    const key = flowerName.toLowerCase();
    return messages[key] || 'A quiet moment, preserved in petals. This flower holds a memory meant just for you.';
  };

  const customMessage = flower.content?.find(c => c.phase === 'IMMEDIATE')?.text || 
    getDefaultMessage(definition.name);

  // Sender & Recipient
  const senderName = flower.plantedBy?.name || "A friend";
  const recipientName = flower.recipientName || "you";

  // Sign-off tone (metadata-driven)
  const signOffTone = "With love,"; // TODO: Make this selectable enum

  // Model path
  const modelPath = definition.modelPath;

  // Bloom status
  const isBloomable = flower.type === 'BLOOMING';
  const isBloomed = flower.state === 'BLOOMED';
  const isBud = flower.state === 'BUD';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="650px"
    >
      {/* Outer Pink Frame */}
      <div style={outerFrameStyle}>
        
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
                <FlowerPreview modelPath={modelPath} />
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
              This beautiful <span style={flowerNameStyle}>{definition.name}</span> was 
              planted just for you on <span style={dateHighlightStyle}>{plantedDate}</span>.
            </div>
            
            {/* Custom Message */}
            <div style={messageStyle}>
              {customMessage}
            </div>
            
            {/* Bloom Status - If applicable */}
            {isBloomable && isBud && bloomAtDate && (
              <div style={bloomInfoStyle}>
                🌱 This flower will bloom on{' '}
                <span style={dateHighlightStyle}>{bloomAtDate}</span>{' '}
                when its special message will be revealed.
              </div>
            )}
            
            {isBloomable && isBloomed && bloomedAtDate && (
              <div style={bloomInfoStyle}>
                🌸 This flower bloomed on{' '}
                <span style={dateHighlightStyle}>{bloomedAtDate}</span>{' '}
                and revealed its heartfelt message.
              </div>
            )}
            
            {/* Symbolism Quote */}
            <div style={quoteContainerStyle}>
              <div style={quoteStyle}>
                "{definition.symbolism}"
              </div>
            </div>
            
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
  maxHeight: '90vh',
  overflowY: 'auto',
};

const whiteCardStyle: React.CSSProperties = {
  position: 'relative',
  background: '#FFFFFF',
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
};

const letterContentStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
};

const greetingStyle: React.CSSProperties = {
  fontFamily: "'Dancing Script', cursive",
  fontSize: '32px',
  fontWeight: 400,
  color: theme.text.primary,
  marginBottom: '24px',
  lineHeight: 1.3,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.serif,
  fontSize: '16px',
  color: theme.text.primary,
  lineHeight: 1.9,
  marginBottom: '24px',
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

const messageStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.serif,
  fontSize: '16px',
  color: theme.text.primary,
  lineHeight: 2.0,
  marginBottom: '32px',
  padding: '24px',
  background: 'rgba(255, 245, 247, 0.5)',
  borderLeft: `3px solid ${theme.colors.rose[400]}`,
  borderRadius: '8px',
  fontStyle: 'italic',
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
  margin: '40px 0',
  textAlign: 'center',
};

const quoteStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.serif,
  fontSize: '15px',
  fontStyle: 'italic',
  color: theme.text.secondary,
  lineHeight: 1.8,
  maxWidth: '400px',
  margin: '0 auto',
};

const signOffContainerStyle: React.CSSProperties = {
  marginTop: '48px',
  textAlign: 'right',
};

const signOffStyle: React.CSSProperties = {
  fontFamily: "'Dancing Script', cursive",
  fontSize: '24px',
  color: theme.text.primary,
  marginBottom: '8px',
};

const senderNameStyle: React.CSSProperties = {
  fontFamily: "'Dancing Script', cursive",
  fontSize: '28px',
  fontWeight: 600,
  color: theme.colors.rose[700],
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
