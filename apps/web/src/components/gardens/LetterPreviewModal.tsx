/**
 * LetterPreviewModal
 * Shows a letter preview in a centred modal (same style as FlowerDetailsModal)
 * when the user picks a template in Step 4 of PlantFlowerPanel.
 *
 * Mobile: fullscreen (matches FlowerDetailsModal mobile behaviour)
 * Desktop: centred modal, max-width 650px
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Modal } from '../common/Modal';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import type { FlowerDefinition } from '../../types/api.types';
import type { LetterTemplateKey } from '../../flowers/letterTemplates';
import { resolveLetterTemplate } from '../../flowers/letterTemplates';
import { FLOWER_DEFINITIONS } from '../../flowers/types';
import FlowerPreviewMesh from './LetterPreviewFlower';

interface LetterPreviewModalProps {
  isOpen: boolean;
  templateKey: LetterTemplateKey;
  flowerDefinition: FlowerDefinition;
  recipientName: string;
  message: string;
  onBack: () => void;
  onConfirm: () => void;
}

export const LetterPreviewModal: React.FC<LetterPreviewModalProps> = ({
  isOpen,
  templateKey,
  flowerDefinition,
  recipientName,
  message,
  onBack,
  onConfirm,
}) => {
  const isMobile = window.innerWidth <= 768;

  const tmpl = resolveLetterTemplate(templateKey);
  const frontendDef = FLOWER_DEFINITIONS[flowerDefinition.key.toLowerCase()];
  const modelPath = frontendDef?.modelPath || '';
  const previewScale = frontendDef?.previewScale || 2.5;
  const previewOffset = frontendDef?.previewOffset;

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const displayRecipient = recipientName || 'you';
  const displayMessage = message || tmpl.defaultMessage;
  const openingSentence = tmpl.openingSentence
    .replace('{date}', today)
    .replace('{flower}', flowerDefinition.displayName || flowerDefinition.key);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onBack}
      showCloseButton={false}
      maxWidth={isMobile ? '100%' : '560px'}
    >
      {/* Outer coloured frame */}
      <div style={{
        background: tmpl.frameColor,
        borderRadius: isMobile ? '0' : '16px',
        overflow: 'hidden',
        position: 'relative',
        ...(isMobile ? {
          minHeight: '100dvh',
          boxSizing: 'border-box' as const,
          display: 'flex',
          flexDirection: 'column' as const,
        } : {}),
      }}>

        {/* Garland */}
        <div style={{
          textAlign: 'center',
          paddingTop: '14px',
          fontSize: '13px',
          color: tmpl.accentColor,
          letterSpacing: '4px',
          opacity: 0.7,
        }}>
          {tmpl.garland}
        </div>

        {/* Horizons branding */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          paddingTop: '8px',
          paddingBottom: '4px',
        }}>
          <img src="/images/horizons-logo.svg" alt="Horizons"
            style={{ width: '24px', height: '24px', opacity: 0.9, filter: 'brightness(0) invert(1)' }} />
          <span style={{
            fontFamily: typography.fontFamily.serif,
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 500,
          }}>HORIZONS</span>
        </div>

        {/* White card — flex-grows on mobile so it fills available space */}
        <div style={{
          position: 'relative',
          background: tmpl.cardGradient,
          margin: isMobile ? '0 10px 10px 10px' : '0 12px 12px 12px',
          borderRadius: '12px',
          padding: isMobile ? '48px 20px 32px 20px' : '48px 32px 32px 32px',
          boxShadow: '0 4px 16px rgba(61,51,64,0.08)',
          overflow: 'visible',
          ...(isMobile ? { flex: 1 } : {}),
        }}>

          {/* 3D Flower */}
          {modelPath && (
            <div style={{
              position: 'absolute',
              top: '-24px',
              right: isMobile ? '16px' : '24px',
              width: isMobile ? '90px' : '110px',
              height: isMobile ? '90px' : '110px',
              borderRadius: '50%',
              overflow: 'visible',
              background: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(61,51,64,0.12)',
              border: `3px solid ${tmpl.frameColor}`,
            }}>
              <Canvas camera={{ position: [0, 0, 8], fov: 45 }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <Suspense fallback={null}>
                  <FlowerPreviewMesh modelPath={modelPath} scale={previewScale} offset={previewOffset} />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
              </Canvas>
            </div>
          )}

          {/* Preview badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '20px',
            background: `${tmpl.frameColor}50`,
            border: `1px solid ${tmpl.accentColor}40`,
            marginBottom: '18px',
            fontSize: '10px',
            fontWeight: 700,
            color: tmpl.accentDark,
            letterSpacing: '0.5px',
            textTransform: 'uppercase' as const,
          }}>
            ✦ Preview
          </div>

          {/* Greeting */}
          <div style={{
            fontFamily: "'Caveat', cursive",
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: 600,
            color: theme.text.primary,
            marginBottom: '20px',
            lineHeight: 1.3,
          }}>
            Dear {displayRecipient},
          </div>

          {/* Opening sentence */}
          <div style={{
            fontFamily: typography.fontFamily.serif,
            fontSize: isMobile ? '14px' : '15px',
            color: theme.text.primary,
            lineHeight: 2,
            marginBottom: '20px',
            letterSpacing: '0.3px',
          }}>
            {openingSentence}
          </div>

          {/* Message box */}
          <div style={{
            marginBottom: '28px',
            padding: isMobile ? '16px' : '24px',
            background: 'rgba(255,250,245,0.4)',
            borderRadius: '10px',
            border: `1px solid rgba(212,144,154,0.15)`,
          }}>
            <div style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: isMobile ? '14px' : '15px',
              color: theme.text.primary,
              lineHeight: 2,
              textAlign: 'center',
              letterSpacing: '0.2px',
              whiteSpace: 'pre-wrap',
            }}>
              {displayMessage}
            </div>
          </div>

          {/* Quote */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: '14px',
              fontStyle: 'italic',
              color: theme.text.secondary,
              opacity: 0.7,
            }}>
              "{flowerDefinition.description || 'A beautiful memory'}"
            </div>
          </div>

          {/* Sign-off */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: isMobile ? '22px' : '26px',
              fontWeight: 600,
              color: theme.text.primary,
              lineHeight: 1.3,
            }}>
              {tmpl.signOff}
            </div>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: isMobile ? '22px' : '26px',
              fontWeight: 600,
              color: theme.text.primary,
              lineHeight: 1.3,
            }}>
              You
            </div>
          </div>

          {/* Body decorations */}
          {tmpl.bodyDecorations.map((d, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: d.top,
              left: d.side === 'left' ? `${isMobile ? 4 : d.inset}px` : undefined,
              right: d.side === 'right' ? `${isMobile ? 4 : d.inset}px` : undefined,
              fontSize: d.fontSize,
              color: tmpl.accentColor,
              opacity: d.opacity,
              pointerEvents: 'none',
              userSelect: 'none',
              lineHeight: 1,
            }}>{d.symbol}</div>
          ))}
        </div>

        {/* Action buttons — inside the coloured frame, original style */}
        <div style={{
          display: 'flex',
          gap: '10px',
          padding: isMobile ? '0 12px 28px 12px' : '0 12px 16px 12px',
        }}>
          <button
            onClick={onBack}
            style={{
              flex: 1,
              padding: '13px 16px',
              borderRadius: '12px',
              border: `2px solid ${tmpl.accentColor}60`,
              background: 'rgba(255,255,255,0.6)',
              color: tmpl.accentDark,
              fontFamily: typography.fontFamily.sans,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Change
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 2,
              padding: '13px 16px',
              borderRadius: '12px',
              border: 'none',
              background: tmpl.accentColor,
              color: '#FFFFFF',
              fontFamily: typography.fontFamily.sans,
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${tmpl.accentColor}60`,
            }}
          >
            ✓ Confirm this letter
          </button>
        </div>

      </div>
    </Modal>
  );
};
