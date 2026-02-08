/**
 * Plant Flower Panel
 * Side panel for planting flowers with 3-step flow
 * Step 1: Choose flower type
 * Step 2: Click garden to place
 * Step 3: Configure bloom options
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../common';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import { useFlowerStore } from '../../stores/flowerStore';
import type { FlowerDefinition, FlowerType } from '../../types/api.types';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import Spa from '@mui/icons-material/Spa';
import Close from '@mui/icons-material/Close';
import TouchApp from '@mui/icons-material/TouchApp';

interface PlantFlowerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  gardenId: string;
  userTier: string;
  onPlantSuccess?: () => void;
  onPlacementModeChange?: (active: boolean, definition: FlowerDefinition | null) => void;
  placedPosition: { x: number; y: number; z: number } | null;
}

export const PlantFlowerPanel: React.FC<PlantFlowerPanelProps> = ({
  isOpen,
  onClose,
  gardenId,
  userTier,
  onPlantSuccess,
  onPlacementModeChange,
  placedPosition,
}) => {
  const { flowerDefinitions, plantFlower, fetchFlowerDefinitions } = useFlowerStore();
  const [step, setStep] = useState(1);
  const [selectedDefinition, setSelectedDefinition] = useState<FlowerDefinition | null>(null);
  const [flowerType, setFlowerType] = useState<FlowerType>('STANDARD');
  const [seedMessage, setSeedMessage] = useState('');
  const [bloomAt, setBloomAt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && flowerDefinitions.length === 0) {
      fetchFlowerDefinitions();
    }
  }, [isOpen, flowerDefinitions.length, fetchFlowerDefinitions]);

  // Reset placement mode when panel closes
  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  // Move to step 3 when position is placed
  useEffect(() => {
    if (placedPosition && step === 2) {
      setStep(3);
      if (onPlacementModeChange) {
        onPlacementModeChange(false, null);
      }
    }
  }, [placedPosition, step, onPlacementModeChange]);

  const handleReset = () => {
    setStep(1);
    setSelectedDefinition(null);
    setFlowerType('STANDARD');
    setSeedMessage('');
    setBloomAt('');
    setError('');
    if (onPlacementModeChange) {
      onPlacementModeChange(false, null);
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const getAvailableDefinitions = () => {
    return flowerDefinitions.filter((def) => {
      if (userTier === 'FREE') return def.tierAccess === 'FREE';
      if (userTier === 'PRO') return def.tierAccess === 'FREE' || def.tierAccess === 'PRO';
      return true;
    });
  };

  const availableDefinitions = getAvailableDefinitions();

  const handleNextToPlacement = () => {
    if (!selectedDefinition) {
      setError('Please select a flower type');
      return;
    }
    setStep(2);
    setError('');
    if (onPlacementModeChange) {
      onPlacementModeChange(true, selectedDefinition);
    }
  };

  const handlePlant = async () => {
    if (!selectedDefinition || !placedPosition) {
      setError('Please select a flower and position');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const plantData: any = {
        flowerDefinitionKey: selectedDefinition.key,
        type: flowerType,
        position: placedPosition,
        rotation: Math.random() * Math.PI * 2,
        seedMessage: seedMessage || undefined,
        bloomAt: flowerType === 'BLOOMING' && bloomAt ? bloomAt : undefined,
      };

      await plantFlower(gardenId, plantData);
      
      if (onPlantSuccess) {
        onPlantSuccess();
      }
      
      handleClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to plant flower');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '420px',
        height: '100vh',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: theme.spacing.xl,
          borderBottom: `1px solid ${theme.border.light}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ ...typography.styles.h4, margin: 0 }}>
          Plant a Flower
        </h2>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: theme.spacing.sm,
            borderRadius: theme.radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Close sx={{ fontSize: 24, color: theme.text.secondary }} />
        </button>
      </div>

      {/* Progress Indicator */}
      <div
        style={{
          padding: `${theme.spacing.md} ${theme.spacing.xl}`,
          borderBottom: `1px solid ${theme.border.light}`,
        }}
      >
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                background: s <= step ? theme.colors.rose[500] : theme.colors.neutral.gray[200],
                borderRadius: '2px',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>
        <div
          style={{
            ...typography.styles.caption,
            color: theme.text.secondary,
            marginTop: theme.spacing.xs,
          }}
        >
          Step {step} of 3
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: theme.spacing.xl,
        }}
      >
        {/* Step 1: Choose Flower Type */}
        {step === 1 && (
          <div>
            <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.lg }}>
              Choose the type of flower you'd like to plant
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: theme.spacing.md,
              }}
            >
              {availableDefinitions.map((def) => {
                const isSelected = selectedDefinition?.id === def.id;
                return (
                  <div
                    key={def.id}
                    style={{
                      padding: theme.spacing.lg,
                      border: `2px solid ${isSelected ? theme.colors.rose[500] : theme.border.light}`,
                      borderRadius: theme.radius.lg,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: isSelected ? theme.colors.rose[50] : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.md,
                    }}
                    onClick={() => setSelectedDefinition(def)}
                  >
                    <div style={{ fontSize: '40px' }}>
                      {def.key === 'rose' ? '🌹' : def.key === 'sunflower' ? '🌻' : '🌼'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...typography.styles.body, fontWeight: 600, marginBottom: '4px' }}>
                        {def.displayName}
                      </div>
                      {def.description && (
                        <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                          {def.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Click to Place */}
        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                margin: `0 auto ${theme.spacing.xl}`,
                background: theme.colors.rose[50],
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              <TouchApp sx={{ fontSize: 60, color: theme.colors.rose[500] }} />
            </div>
            
            <h3 style={{ ...typography.styles.h5, marginBottom: theme.spacing.sm }}>
              Click to Place Flower
            </h3>
            
            <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.xl }}>
              Click anywhere in the garden to place your {selectedDefinition?.displayName}
            </p>

            <div
              style={{
                padding: theme.spacing.lg,
                background: theme.colors.rose[50],
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.rose[200]}`,
              }}
            >
              <p style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                💡 Tip: Click on the terrain where you'd like your memory flower to grow
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Configure Bloom Options */}
        {step === 3 && (
          <div>
            <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.lg }}>
              How would you like your flower to bloom?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
              <div
                style={{
                  padding: theme.spacing.lg,
                  border: `2px solid ${flowerType === 'STANDARD' ? theme.colors.rose[500] : theme.border.light}`,
                  borderRadius: theme.radius.lg,
                  cursor: 'pointer',
                  background: flowerType === 'STANDARD' ? theme.colors.rose[50] : '#FFFFFF',
                }}
                onClick={() => setFlowerType('STANDARD')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                  <LocalFlorist sx={{ fontSize: 32, color: theme.colors.rose[500] }} />
                  <div>
                    <div style={{ ...typography.styles.body, fontWeight: 600 }}>
                      Open Now
                    </div>
                    <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                      Your memory is immediately visible
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: theme.spacing.lg,
                  border: `2px solid ${flowerType === 'BLOOMING' ? theme.colors.rose[500] : theme.border.light}`,
                  borderRadius: theme.radius.lg,
                  cursor: 'pointer',
                  background: flowerType === 'BLOOMING' ? theme.colors.rose[50] : '#FFFFFF',
                }}
                onClick={() => setFlowerType('BLOOMING')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                  <Spa sx={{ fontSize: 32, color: theme.colors.rose[500] }} />
                  <div>
                    <div style={{ ...typography.styles.body, fontWeight: 600 }}>
                      Bloom Later
                    </div>
                    <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                      Set a future date for your memory to reveal
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seed Message */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{ ...typography.styles.body, fontWeight: 500, marginBottom: theme.spacing.xs, display: 'block' }}>
                Seed Message (Optional)
              </label>
              <textarea
                value={seedMessage}
                onChange={(e) => setSeedMessage(e.target.value)}
                placeholder="Add a message to your memory..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: theme.spacing.md,
                  border: `1px solid ${theme.border.light}`,
                  borderRadius: theme.radius.md,
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Bloom Date (if BLOOMING selected) */}
            {flowerType === 'BLOOMING' && (
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={{ ...typography.styles.body, fontWeight: 500, marginBottom: theme.spacing.xs, display: 'block' }}>
                  Bloom Date
                </label>
                <input
                  type="datetime-local"
                  value={bloomAt}
                  onChange={(e) => setBloomAt(e.target.value)}
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.border.light}`,
                    borderRadius: theme.radius.md,
                    fontFamily: 'inherit',
                    fontSize: '14px',
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: theme.spacing.md,
              background: theme.colors.rose[50],
              border: `1px solid ${theme.colors.rose[300]}`,
              borderRadius: theme.radius.md,
              color: theme.colors.rose[700],
              ...typography.styles.body,
              marginTop: theme.spacing.md,
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        style={{
          padding: theme.spacing.xl,
          borderTop: `1px solid ${theme.border.light}`,
          display: 'flex',
          gap: theme.spacing.sm,
        }}
      >
        {step === 1 && (
          <>
            <Button variant="ghost" onClick={handleClose} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleNextToPlacement} style={{ flex: 1 }}>
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Button variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>
              Back
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Button variant="ghost" onClick={() => setStep(2)} style={{ flex: 1 }}>
              Back
            </Button>
            <Button variant="primary" onClick={handlePlant} isLoading={isLoading} style={{ flex: 1 }}>
              Plant Flower
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
