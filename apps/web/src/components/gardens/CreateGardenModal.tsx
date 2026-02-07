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

interface CreateGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGarden: (title: string, gardenDefinitionId?: string) => Promise<void>;
  userTier: string;
}

export const CreateGardenModal: React.FC<CreateGardenModalProps> = ({
  isOpen,
  onClose,
  onCreateGarden,
  userTier,
}) => {
  const [title, setTitle] = useState('');
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string | undefined>();
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
      await onCreateGarden(title.trim(), selectedDefinitionId);
      // Reset form
      setTitle('');
      setSelectedDefinitionId(undefined);
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
    border: `2px solid ${isSelected ? theme.colors.rose[500] : 'rgba(232, 180, 184, 0.2)'}`,
    borderRadius: theme.radius.xl,
    cursor: isLocked ? 'not-allowed' : 'pointer',
    opacity: isLocked ? 0.5 : 1,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: isSelected ? theme.colors.rose[50] : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
  });

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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
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
                const isSelected = selectedDefinitionId === def.id;
                return (
                  <div
                    key={def.id}
                    style={gardenCardStyle(isSelected, false)}
                    onClick={() => setSelectedDefinitionId(def.id)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.02)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ ...typography.styles.body, fontWeight: 600, marginBottom: theme.spacing.xs }}>
                      {def.displayName}
                    </div>
                    {def.description && (
                      <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                        {def.description}
                      </div>
                    )}
                    {def.isLimitedEdition && (
                      <div style={{ ...typography.styles.caption, color: theme.colors.rose[600], marginTop: theme.spacing.xs, fontWeight: 600 }}>
                        Limited Edition
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
    </Modal>
  );
};
