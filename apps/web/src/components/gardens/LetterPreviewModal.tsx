/**
 * LetterPreviewModal
 * Shows a letter preview in a centred modal (same style as FlowerDetailsModal)
 * when the user picks a template in Step 4 of PlantFlowerPanel.
 *
 * Mobile: fullscreen (matches FlowerDetailsModal mobile behaviour)
 * Desktop: centred modal, max-width 650px
 */

import React, { Suspense, useEffect } from 'react';
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
  senderName?: string;
  imagePreviewUrl?: string;
  voicePreviewUrl?: string;
  videoPreviewUrl?: string;
  onBack: () => void;
  onConfirm: () => void;
}

export const LetterPreviewModal: React.FC<LetterPreviewModalProps> = ({
  isOpen,
  templateKey,
  flowerDefinition,
  recipientName,
  message,
  senderName,
  imagePreviewUrl,
  voicePreviewUrl,
  videoPreviewUrl,
  onBack,
  onConfirm,
}) => {
  const isMobile = window.innerWidth <= 768;

  const tmpl = resolveLetterTemplate(templateKey);

  // Inject a dynamic <style> tag so the modal scrollbar matches the template accent colour
  const scrollbarClass = `letter-scroll-${templateKey}`;
  useEffect(() => {
    if (!isOpen) return;
    const styleId = `scrollbar-style-${templateKey}`;
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = styleId;
      document.head.appendChild(el);
    }
    el.textContent = `
      .${scrollbarClass}::-webkit-scrollbar { width: 6px; }
      .${scrollbarClass}::-webkit-scrollbar-track { background: transparent; }
      .${scrollbarClass}::-webkit-scrollbar-thumb {
        background: ${tmpl.frameColor};
        border-radius: 999px;
      }
      .${scrollbarClass} { scrollbar-color: ${tmpl.frameColor} transparent; scrollbar-width: thin; }
    `;
    return () => {
      el?.remove();
    };
  }, [isOpen, templateKey, tmpl.accentColor, scrollbarClass]);

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
      maxWidth={isMobile ? '100%' : '650px'}
      className={scrollbarClass}
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
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '6px',
          paddingBottom: '20px',
        }}>
          <img
            src="/images/horizons-logo-wordmark.svg"
            alt="Horizons"
            style={{ height: '32px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)', opacity: 0.5 }}
          />
        </div>

        {/* White card — flex-grows on mobile so it fills available space */}
        <div style={{
          position: 'relative',
          background: tmpl.cardGradient,
          margin: isMobile ? '0 10px 10px 10px' : '0 12px 12px 12px',
          borderRadius: '12px',
          padding: isMobile ? '48px 20px 32px 20px' : '64px 48px 48px 48px',
          boxShadow: '0 4px 16px rgba(61,51,64,0.08)',
          overflow: 'visible',
          ...(isMobile ? { flex: 1 } : {}),
        }}>

          {/* 3D Flower */}
          {modelPath && (
            <div style={{
              position: 'absolute',
              top: isMobile ? '-24px' : '-30px',
              right: isMobile ? '16px' : '32px',
              width: isMobile ? '90px' : '150px',
              height: isMobile ? '90px' : '150px',
              borderRadius: '50%',
              overflow: 'hidden',
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
            fontSize: isMobile ? '24px' : 'clamp(1.75rem, 2vw + 0.5rem, 2rem)',
            fontWeight: 600,
            color: theme.text.primary,
            marginBottom: isMobile ? '20px' : '32px',
            lineHeight: 1.3,
          }}>
            Dear {displayRecipient},
          </div>

          {/* Opening sentence */}
          <div style={{
            fontFamily: typography.fontFamily.serif,
            fontSize: isMobile ? '14px' : '17px',
            color: theme.text.primary,
            lineHeight: isMobile ? 2 : 2.2,
            marginBottom: isMobile ? '20px' : '28px',
            letterSpacing: '0.3px',
          }}>
            {openingSentence}
          </div>

          {/* Message box */}
          <div style={{
            marginBottom: isMobile ? '28px' : '40px',
            padding: isMobile ? '16px' : '40px 32px',
            background: 'rgba(255,250,245,0.4)',
            borderRadius: '10px',
            border: `1px solid rgba(212,144,154,0.15)`,
          }}>
            <div style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: isMobile ? '14px' : '17px',
              color: theme.text.primary,
              lineHeight: isMobile ? 2 : 2.2,
              textAlign: 'center',
              letterSpacing: '0.2px',
              whiteSpace: 'pre-wrap',
            }}>
              {displayMessage}
            </div>
          </div>

          {/* Attached Media */}
          {(imagePreviewUrl || voicePreviewUrl || videoPreviewUrl) && (
            <div style={{
              marginBottom: isMobile ? '24px' : '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}>
              {/* Section label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.6px',
                textTransform: 'uppercase' as const,
                color: tmpl.accentDark,
                opacity: 0.6,
              }}>
                <span>✦</span> Attached memories
              </div>

              {/* Photo */}
              {imagePreviewUrl && (
                <div style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: `1.5px solid ${tmpl.frameColor}50`,
                  boxShadow: '0 2px 10px rgba(61,51,64,0.08)',
                }}>
                  <img
                    src={imagePreviewUrl}
                    alt="Attached photo"
                    style={{
                      width: '100%',
                      maxHeight: isMobile ? '180px' : '240px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              )}

              {/* Voice message */}
              {voicePreviewUrl && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: `${tmpl.frameColor}18`,
                  border: `1.5px solid ${tmpl.frameColor}40`,
                  display: 'flex',
                  flexDirection: 'column' as const,
                  gap: '6px',
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: tmpl.accentDark,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    🎙️ Voice message
                  </div>
                  <audio
                    controls
                    src={voicePreviewUrl}
                    style={{ width: '100%', height: '36px' }}
                  />
                </div>
              )}

              {/* Video */}
              {videoPreviewUrl && (
                <div style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: `1.5px solid ${tmpl.frameColor}50`,
                  boxShadow: '0 2px 10px rgba(61,51,64,0.08)',
                }}>
                  <div style={{
                    padding: '8px 12px',
                    background: `${tmpl.frameColor}18`,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: tmpl.accentDark,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    🎬 Video
                  </div>
                  <video
                    controls
                    src={videoPreviewUrl}
                    style={{
                      width: '100%',
                      maxHeight: isMobile ? '180px' : '240px',
                      display: 'block',
                      background: '#000',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Quote */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '28px' : '48px' }}>
            <div style={{
              fontFamily: typography.fontFamily.serif,
              fontSize: isMobile ? '14px' : '16px',
              fontStyle: 'italic',
              color: theme.text.secondary,
              opacity: 0.7,
            }}>
              "{flowerDefinition.description || 'A beautiful memory'}"
            </div>
          </div>

          {/* Sign-off */}
          <div style={{ textAlign: 'right', marginTop: isMobile ? '0' : '56px', paddingRight: isMobile ? '6px' : '0' }}>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: isMobile ? '22px' : 'clamp(1.75rem, 2vw + 0.25rem, 1.875rem)',
              fontWeight: 600,
              color: theme.text.primary,
              lineHeight: 1.3,
            }}>
              {tmpl.signOff}
            </div>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: isMobile ? '22px' : 'clamp(1.75rem, 2vw + 0.25rem, 1.875rem)',
              fontWeight: 600,
              color: theme.text.primary,
              lineHeight: 1.3,
            }}>
              {senderName || 'You'}
            </div>
          </div>

          {/* Body decorations — desktop: scattered absolute positions; mobile: linear column per side */}
          {isMobile ? (() => {
            const leftDecs = tmpl.bodyDecorations.filter(d => d.side === 'left');
            const rightDecs = tmpl.bodyDecorations.filter(d => d.side === 'right');
            const step = 100 / (Math.max(leftDecs.length, rightDecs.length) + 1);
            return (
              <>
                {leftDecs.map((d, i) => (
                  <div key={`ml-${i}`} style={{
                    position: 'absolute',
                    top: `${step * (i + 1)}%`,
                    left: '6px',
                    fontSize: '11px',
                    color: tmpl.accentColor,
                    opacity: d.opacity,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    lineHeight: 1,
                  }}>{d.symbol}</div>
                ))}
                {rightDecs.map((d, i) => (
                  <div key={`mr-${i}`} style={{
                    position: 'absolute',
                    top: `${step * (i + 1)}%`,
                    right: '6px',
                    fontSize: '11px',
                    color: tmpl.accentColor,
                    opacity: d.opacity,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    lineHeight: 1,
                  }}>{d.symbol}</div>
                ))}
              </>
            );
          })() : tmpl.bodyDecorations.map((d, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: d.top,
              left: d.side === 'left' ? `${d.inset}px` : undefined,
              right: d.side === 'right' ? `${d.inset}px` : undefined,
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
