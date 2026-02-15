/**
 * Create Garden Modal
 * Modal for creating a new garden with garden type selection
 */

import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from '../common';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import api from '../../services/api';
import type { GardenDefinition } from '../../types/api.types';
import Close from '@mui/icons-material/Close';

interface CreateGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGarden: (title: string, gardenDefinitionKey?: string) => Promise<void>;
  userTier: string;
}

export const CreateGardenModal: React.FC<CreateGardenModalProps> = ({
  isOpen,
  onClose,
  onCreateGarden,
  userTier,
}) => {
  const [title, setTitle] = useState('');
  const [selectedDefinitionKey, setSelectedDefinitionKey] = useState<string | undefined>();
  const [gardenDefinitions, setGardenDefinitions] = useState<GardenDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDefinitions, setIsLoadingDefinitions] = useState(false);
  const [error, setError] = useState('');

  // Fetch garden definitions when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchGardenDefinitions();
    }
  }, [isOpen]);

  const fetchGardenDefinitions = async () => {
    setIsLoadingDefinitions(true);
    try {
      const response = await api.get<GardenDefinition[]>('/garden-definitions');
      setGardenDefinitions(response.data);
    } catch (err) {
      console.error('Failed to fetch garden definitions:', err);
      // Set default if fetch fails
      setGardenDefinitions([]);
    } finally {
      setIsLoadingDefinitions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a garden name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onCreateGarden(title.trim(), selectedDefinitionKey);
      // Reset form
      setTitle('');
      setSelectedDefinitionKey(undefined);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to create garden');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableDefinitions = () => {
    return gardenDefinitions.filter((def) => {
      if (userTier === 'FREE') return def.tierAccess === 'FREE';
      if (userTier === 'PRO') return def.tierAccess === 'FREE' || def.tierAccess === 'PRO';
      return true; // PREMIUM sees all
    });
  };

  const titleStyle: React.CSSProperties = {
    ...typography.styles.h3,
    marginBottom: theme.spacing.md,
  };

  const sectionTitleStyle: React.CSSProperties = {
    ...typography.styles.body,
    fontWeight: 600,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  };

  const gardenGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const gardenCardStyle = (isSelected: boolean, isLocked: boolean): React.CSSProperties => ({
    padding: theme.spacing.lg,
    border: `2px solid ${isSelected ? theme.colors.rose[500] : 'rgba(232, 180, 184, 0.3)'}`,
    borderRadius: theme.radius.xl,
    cursor: isLocked ? 'not-allowed' : 'pointer',
    opacity: isLocked ? 0.6 : 1,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: isSelected ? theme.colors.rose[50] : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: isSelected ? '0 8px 24px rgba(212, 144, 154, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
  });

  // Garden theme color mappings for visual previews
  const gardenThemeColors: Record<string, { gradient: string; emoji: string }> = {
    'test_garden': { 
      gradient: 'linear-gradient(135deg, #5A8F67 0%, #7FB88D 100%)',
      emoji: '🌳'
    },
    'quiet_garden': { 
      gradient: 'linear-gradient(135deg, #A8B89F 0%, #D4C5B9 100%)',
      emoji: '🍃'
    },
    'spring_meadow': { 
      gradient: 'linear-gradient(135deg, #4A7C59 0%, #FFE66D 100%)',
      emoji: '🌸'
    },
    'autumn_grove': { 
      gradient: 'linear-gradient(135deg, #A67C52 0%, #C1666B 100%)',
      emoji: '🍂'
    },
    'winter_wonderland': { 
      gradient: 'linear-gradient(135deg, #E8F4F8 0%, #B8C5D6 100%)',
      emoji: '❄️'
    },
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    justifyContent: 'flex-end',
    marginTop: theme.spacing.lg,
  };

  const availableDefinitions = getAvailableDefinitions();

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px" showCloseButton={false}>
      <div style={containerStyle}>
        {/* Custom Close Button - Top Right */}
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.6';
          }}
          aria-label="Close"
        >
          <Close sx={{ fontSize: 20 }} />
        </button>
        
        <h2 style={titleStyle}>Create New Garden</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
        <Input
          label="Garden Name"
          type="text"
          placeholder="My Memory Garden"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
          fullWidth
          autoFocus
        />

        <div>
          <div style={sectionTitleStyle}>Choose Garden Theme</div>
          
          {isLoadingDefinitions ? (
            <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
              Loading themes...
            </div>
          ) : availableDefinitions.length > 0 ? (
            <div style={gardenGridStyle}>
              {availableDefinitions.map((def) => {
                const isSelected = selectedDefinitionKey === def.key;
                const themeColors = gardenThemeColors[def.key] || { gradient: 'linear-gradient(135deg, #5A8F67 0%, #7FB88D 100%)', emoji: '🌸' };
                
                return (
                  <div
                    key={def.id}
                    style={gardenCardStyle(isSelected, false)}
                    onClick={() => setSelectedDefinitionKey(def.key)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px) scale(1.02)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                      (e.currentTarget as HTMLElement).style.boxShadow = isSelected ? '0 8px 24px rgba(212, 144, 154, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    {/* Visual Garden Preview Circle */}
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        margin: `0 auto ${theme.spacing.md}`,
                        borderRadius: '50%',
                        background: themeColors.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        border: '3px solid rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      {themeColors.emoji}
                    </div>

                    {/* Garden Name */}
                    <div style={{ ...typography.styles.body, fontWeight: 600, marginBottom: theme.spacing.xs, textAlign: 'center' }}>
                      {def.displayName}
                    </div>

                    {/* Description */}
                    {def.description && (
                      <div style={{ ...typography.styles.caption, color: theme.text.secondary, textAlign: 'center', lineHeight: '1.4' }}>
                        {def.description}
                      </div>
                    )}

                    {/* Tier Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        padding: '4px 8px',
                        borderRadius: theme.radius.full,
                        background: def.tierAccess === 'PREMIUM' ? 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)' : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: def.tierAccess === 'PREMIUM' ? '#6A1B9A' : '#2E7D32',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {def.tierAccess}
                    </div>

                    {def.isLimitedEdition && (
                      <div style={{ ...typography.styles.caption, color: theme.colors.rose[600], marginTop: theme.spacing.sm, fontWeight: 600, textAlign: 'center' }}>
                        ✨ Limited Edition
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: theme.spacing.lg, textAlign: 'center' }}>
              <div style={typography.styles.body}>
                No garden themes available yet. You can create a garden without selecting a theme.
              </div>
            </div>
          )}

          {userTier === 'FREE' && gardenDefinitions.some(d => d.tierAccess !== 'FREE') && (
            <div style={{ 
              padding: theme.spacing.md, 
              background: theme.colors.rose[50], 
              borderRadius: theme.radius.md,
              marginTop: theme.spacing.sm,
            }}>
              <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                Upgrade to PRO to unlock more garden themes
              </div>
            </div>
          )}
        </div>

        <div style={buttonGroupStyle}>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Garden'}
          </Button>
        </div>
      </form>
      </div>
    </Modal>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  position: 'relative',
  background: '#FFFFFF',
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.xl,
  padding: theme.spacing.xl,
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(255, 201, 217, 0.3)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.2s ease',
  boxShadow: 'none',
  zIndex: 10,
  opacity: 0.6,
};
