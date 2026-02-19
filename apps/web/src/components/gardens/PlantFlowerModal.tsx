/**
 * Plant Flower Modal
 * Multi-step modal for planting flowers in the garden
 */

import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../common';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import { useFlowerStore } from '../../stores/flowerStore';
import type { FlowerDefinition, FlowerType, PlantFlowerRequest } from '../../types/api.types';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import Spa from '@mui/icons-material/Spa';

interface PlantFlowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gardenId: string;
  userTier: string;
  onPlantSuccess?: () => void;
}

export const PlantFlowerModal: React.FC<PlantFlowerModalProps> = ({
  isOpen,
  onClose,
  gardenId,
  userTier,
  onPlantSuccess,
}) => {
  const { flowerDefinitions, plantFlower, fetchFlowerDefinitions } = useFlowerStore();
  const [step, setStep] = useState(1);
  const [selectedDefinition, setSelectedDefinition] = useState<FlowerDefinition | null>(null);
  const [flowerType, setFlowerType] = useState<FlowerType>('STANDARD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && flowerDefinitions.length === 0) {
      fetchFlowerDefinitions();
    }
  }, [isOpen, flowerDefinitions.length, fetchFlowerDefinitions]);

  const handleReset = () => {
    setStep(1);
    setSelectedDefinition(null);
    setFlowerType('STANDARD');
    setError('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handlePlant = async () => {
    if (!selectedDefinition) {
      setError('Please select a flower type');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const plantData: PlantFlowerRequest = {
        gardenId,
        flowerDefinitionId: selectedDefinition.id,
        type: flowerType,
        position: {
          x: Math.random() * 20 - 10,
          y: 0,
          z: Math.random() * 20 - 10,
        },
        rotation: Math.random() * Math.PI * 2,
      };

      await plantFlower(plantData);
      
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

  const getAvailableDefinitions = () => {
    return flowerDefinitions.filter((def) => {
      if (userTier === 'FREE') return def.tierAccess === 'FREE';
      if (userTier === 'PRO') return def.tierAccess === 'FREE' || def.tierAccess === 'PRO';
      return true;
    });
  };

  const availableDefinitions = getAvailableDefinitions();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="700px">
      <h2 style={{ ...typography.styles.h3, marginBottom: theme.spacing.lg }}>
        Plant a Flower
      </h2>

      {/* Step 1: Choose Flower Type */}
      {step === 1 && (
        <div>
          <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.lg }}>
            Choose the type of flower you'd like to plant
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: theme.spacing.md,
              marginBottom: theme.spacing.xl,
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
                    textAlign: 'center',
                  }}
                  onClick={() => setSelectedDefinition(def)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = theme.colors.rose[300];
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = theme.border.light;
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: theme.spacing.sm }}>
                    {def.key === 'ROSE' ? '🌹' : def.key === 'SUNFLOWER' ? '🌻' : '🌼'}
                  </div>
                  <div style={{ ...typography.styles.body, fontWeight: 600, marginBottom: theme.spacing.xs }}>
                    {def.displayName}
                  </div>
                  {def.description && (
                    <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                      {def.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div style={{ ...typography.styles.body, color: theme.colors.rose[600], marginBottom: theme.spacing.md }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (selectedDefinition) {
                  setStep(2);
                  setError('');
                } else {
                  setError('Please select a flower type');
                }
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Flower Options */}
      {step === 2 && (
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

          <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handlePlant}
              isLoading={isLoading}
            >
              Plant Flower
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
