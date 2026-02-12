/**
 * Plant Flower Panel
 * Side panel for planting flowers with 3-step flow
 * Step 1: Choose flower type
 * Step 2: Click garden to place
 * Step 3: Configure bloom options
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '../common';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import { useFlowerStore } from '../../stores/flowerStore';
import flowerService from '../../services/flowerService';
import gardenService from '../../services/gardenService';
import type { FlowerDefinition, FlowerType } from '../../types/api.types';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import Spa from '@mui/icons-material/Spa';
import Close from '@mui/icons-material/Close';
import TouchApp from '@mui/icons-material/TouchApp';
import Nature from '@mui/icons-material/Nature';
import Info from '@mui/icons-material/Info';

// Zod validation schema
const plantFlowerFormSchema = z.object({
  recipientName: z.string().max(50, 'Name must be 50 characters or less').optional().or(z.literal('')),
  recipientEmail: z.string().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: 'Please enter a valid email address'
  }),
  seedMessage: z.string().max(500, 'Message must be 500 characters or less').optional().or(z.literal('')),
  bloomMessage: z.string().max(500, 'Message must be 500 characters or less').optional().or(z.literal('')),
  bloomAt: z.string().optional(),
  imageUrl: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Please enter a valid URL'
  }),
  voiceUrl: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Please enter a valid URL'
  }),
  videoUrl: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Please enter a valid URL'
  }),
});

type PlantFlowerFormData = z.infer<typeof plantFlowerFormSchema>;

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
    reset: resetForm,
    trigger,
  } = useForm<PlantFlowerFormData>({
    resolver: zodResolver(plantFlowerFormSchema),
    mode: 'onBlur',
    defaultValues: {
      recipientName: '',
      recipientEmail: '',
      seedMessage: '',
      bloomMessage: '',
      bloomAt: '',
      imageUrl: '',
      voiceUrl: '',
      videoUrl: '',
    },
  });

  // Watch form values
  const formValues = watch();
  const { recipientName, recipientEmail, seedMessage, bloomMessage, bloomAt, imageUrl, voiceUrl, videoUrl } = formValues;

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
    resetForm();
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
      setError('Choose a flower to continue');
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
      setError('Choose a flower and position to continue');
      return;
    }

    // Validate bloom date if BLOOMING type
    if (flowerType === 'BLOOMING') {
      if (!bloomAt) {
        setError('Please select a bloom date');
        return;
      }
      if (new Date(bloomAt) <= new Date()) {
        setError('Bloom date must be in the future');
        return;
      }
    }

    // Trigger form validation
    const isValid = await trigger();
    if (!isValid) {
      setError('Something needs a little attention');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Step 1: Plant the flower with seed message in content
      const plantData = {
        flowerDefinitionKey: selectedDefinition.key,
        type: flowerType,
        position: placedPosition,
        rotation: Math.random() * Math.PI * 2,
        bloomAt: flowerType === 'BLOOMING' && bloomAt ? bloomAt : undefined,
        recipientName: recipientName || undefined,
      };

      const plantedFlower = await plantFlower(gardenId, plantData);
      
      // Step 2: Add content based on flower type
      if (flowerType === 'BLOOMING') {
        // For BLOOMING flowers: create separate SEED and BLOOM content
        
        // SEED phase content (before bloom)
        if (seedMessage) {
          try {
            await flowerService.addContent({
              flowerId: plantedFlower.id,
              phase: 'SEED',
              text: seedMessage,
            });
          } catch (mediaError) {
            console.error('Failed to add seed content:', mediaError);
          }
        }
        
        // BLOOM phase content (after bloom - revealed with tap to reveal)
        if (bloomMessage || imageUrl || voiceUrl || videoUrl) {
          try {
            await flowerService.addContent({
              flowerId: plantedFlower.id,
              phase: 'BLOOM',
              text: bloomMessage || undefined,
              imageUrl: imageUrl || undefined,
              voiceUrl: voiceUrl || undefined,
              videoUrl: videoUrl || undefined,
            });
          } catch (mediaError) {
            console.error('Failed to add bloom content:', mediaError);
          }
        }
      } else {
        // For STANDARD flowers: create IMMEDIATE content (all together)
        if (seedMessage || imageUrl || voiceUrl || videoUrl) {
          try {
            await flowerService.addContent({
              flowerId: plantedFlower.id,
              phase: 'IMMEDIATE',
              text: seedMessage || undefined,
              imageUrl: imageUrl || undefined,
              voiceUrl: voiceUrl || undefined,
              videoUrl: videoUrl || undefined,
            });
          } catch (mediaError) {
            console.error('Failed to add content:', mediaError);
          }
        }
      }
      
      // Step 3: Add garden member if email provided
      if (recipientEmail) {
        try {
          await gardenService.addMember(gardenId, {
            email: recipientEmail,
            role: 'CONTRIBUTOR'
          });
        } catch (memberError) {
          console.error('Failed to add member:', memberError);
          // Continue anyway - flower was planted successfully
        }
      }
      
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
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02), -4px 0 24px rgba(0, 0, 0, 0.08)',
        borderTopLeftRadius: '24px',
        borderBottomLeftRadius: '24px',
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
          Plant a Memory
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
          {[1, 2, 3, 4, 5].map((s) => (
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
          Step {step} of 5
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
              Choose a flower for this memory
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
                const symbolism = 
                  def.key === 'rose' ? 'Love & devotion' :
                  def.key === 'sunflower' ? 'Warmth & joy' :
                  'Innocence & new beginnings';
                
                return (
                  <div
                    key={def.id}
                    style={{
                      padding: theme.spacing.lg,
                      border: isSelected 
                        ? `1px solid rgba(255, 105, 180, 0.3)` 
                        : `1px solid ${theme.border.light}`,
                      borderRadius: theme.radius.lg,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: isSelected ? theme.colors.rose[50] : '#FFFFFF',
                      boxShadow: isSelected ? '0 0 20px rgba(255, 105, 180, 0.15)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.md,
                      transform: 'translateY(0)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = isSelected ? '0 0 20px rgba(255, 105, 180, 0.15)' : 'none';
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
                      <div style={{ ...typography.styles.caption, color: theme.text.secondary, fontStyle: 'italic' }}>
                        {symbolism}
                      </div>
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
              Place your flower in the garden
            </h3>
            
            <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.xl }}>
              Click anywhere in the garden where you'd like this memory to grow
            </p>

            <div
              style={{
                padding: theme.spacing.lg,
                background: theme.colors.rose[50],
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.rose[200]}`,
              }}
            >
              <p style={{ ...typography.styles.caption, color: theme.text.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Nature sx={{ fontSize: 16, color: theme.semantic.success }} />
                Choose a spot that feels right
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Configure Bloom Options + Recipient */}
        {step === 3 && (
          <div>
            <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.lg }}>
              When should this memory be revealed?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md, marginBottom: '32px' }}>
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
                      Reveal Now
                    </div>
                    <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                      Open immediately
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
                      Reveal Later
                    </div>
                    <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                      Let it bloom at a chosen moment
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Name */}
            <Input
              {...register('recipientName')}
              label="Who is this for? (optional)"
              placeholder="Recipient's name (e.g., Sarah)"
              error={errors.recipientName?.message}
              helperText="This name will appear in the letter"
              fullWidth
            />

            {/* Recipient Email */}
            <Input
              {...register('recipientEmail')}
              type="email"
              label="Recipient's Email (Optional)"
              placeholder="recipient@example.com"
              error={errors.recipientEmail?.message}
              helperText="💡 If provided, we'll invite them as a contributor to view this garden"
              fullWidth
            />

            {/* Seed Message */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
              marginBottom: theme.spacing.lg 
            }}>
              <label style={{ ...typography.styles.label, color: theme.text.primary }}>
                {flowerType === 'BLOOMING' ? 'Before it blooms (optional)' : 'Message (optional)'}
              </label>
              <textarea
                {...register('seedMessage')}
                placeholder="Add a message to your memory..."
                style={{
                  ...typography.styles.body,
                  width: '100%',
                  minHeight: '100px',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: `2px solid ${errors.seedMessage ? theme.semantic.error : theme.border.medium}`,
                  borderRadius: theme.radius.lg,
                  background: theme.bg.elevated,
                  color: theme.text.primary,
                  transition: theme.transition.base,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
              {errors.seedMessage && (
                <span style={{ ...typography.styles.caption, color: theme.semantic.error }}>
                  {errors.seedMessage.message}
                </span>
              )}
            </div>

            {/* Bloom Date (if BLOOMING selected) */}
            {flowerType === 'BLOOMING' && (
              <Input
                {...register('bloomAt')}
                type="datetime-local"
                label="Bloom Date"
                error={errors.bloomAt?.message}
                fullWidth
              />
            )}
          </div>
        )}

        {/* Step 4: Add Media (Optional) */}
        {step === 4 && (
          <div>
            <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.lg }}>
              Add something extra (optional)
            </p>

            {/* Bloom Message - only for BLOOMING flowers */}
            {flowerType === 'BLOOMING' && (
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.lg 
              }}>
                <label style={{ ...typography.styles.label, color: theme.text.primary }}>
                  When it blooms
                </label>
                <textarea
                  {...register('bloomMessage')}
                  placeholder="Message to reveal when flower blooms..."
                  style={{
                    ...typography.styles.body,
                    width: '100%',
                    minHeight: '100px',
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    border: `2px solid ${errors.bloomMessage ? theme.semantic.error : theme.border.medium}`,
                    borderRadius: theme.radius.lg,
                    background: theme.bg.elevated,
                    color: theme.text.primary,
                    transition: theme.transition.base,
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                {errors.bloomMessage ? (
                  <span style={{ ...typography.styles.caption, color: theme.semantic.error }}>
                    {errors.bloomMessage.message}
                  </span>
                ) : (
                  <span style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                    This will be revealed when the flower opens
                  </span>
                )}
              </div>
            )}

            <Input
              {...register('imageUrl')}
              label="Photo"
              placeholder="https://example.com/photo.jpg"
              error={errors.imageUrl?.message}
              helperText={flowerType === 'BLOOMING' ? 'Will be revealed when flower blooms' : undefined}
              fullWidth
            />

            <Input
              {...register('voiceUrl')}
              label="Voice message"
              placeholder="https://example.com/voice.mp3"
              error={errors.voiceUrl?.message}
              helperText={flowerType === 'BLOOMING' ? 'Will be revealed when flower blooms' : undefined}
              fullWidth
            />

            <Input
              {...register('videoUrl')}
              label="Video"
              placeholder="https://example.com/video.mp4"
              error={errors.videoUrl?.message}
              helperText={flowerType === 'BLOOMING' ? 'Will be revealed when flower blooms' : undefined}
              fullWidth
            />

            <div
              style={{
                padding: theme.spacing.md,
                background: theme.colors.rose[50],
                borderRadius: theme.radius.md,
                border: `1px solid ${theme.colors.rose[200]}`,
              }}
            >
              <p style={{ ...typography.styles.caption, color: theme.text.secondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info sx={{ fontSize: 16, color: theme.colors.rose[500] }} />
                All media is optional. You can skip this step or add media later.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div>
            <h3 style={{ ...typography.styles.h5, marginBottom: theme.spacing.lg }}>
              Before you plant
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>Flower Type</div>
                <div style={{ ...typography.styles.body, fontWeight: 600 }}>
                  {selectedDefinition?.displayName}
                </div>
              </div>

              <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>Bloom Type</div>
                <div style={{ ...typography.styles.body, fontWeight: 600 }}>
                  {flowerType === 'STANDARD' ? 'Open Now' : 'Bloom Later'}
                </div>
              </div>

              <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>For</div>
                <div style={{ ...typography.styles.body, fontWeight: 600 }}>
                  {recipientName || 'Anonymous'}
                </div>
              </div>

              {recipientEmail && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>Recipient Email</div>
                  <div style={{ ...typography.styles.body, fontWeight: 600 }}>
                    {recipientEmail}
                  </div>
                  <div style={{ ...typography.styles.caption, color: theme.text.secondary, marginTop: '4px' }}>
                    ✅ Will be invited as contributor
                  </div>
                </div>
              )}

              {seedMessage && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                    {flowerType === 'BLOOMING' ? 'Seed Message (Before Bloom)' : 'Message'}
                  </div>
                  <div style={{ ...typography.styles.body }}>{seedMessage}</div>
                </div>
              )}

              {bloomMessage && flowerType === 'BLOOMING' && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>Bloom Message (After Bloom)</div>
                  <div style={{ ...typography.styles.body }}>{bloomMessage}</div>
                  <div style={{ ...typography.styles.caption, color: theme.text.secondary, marginTop: '4px' }}>
                    🌸 Will be revealed with tap-to-reveal
                  </div>
                </div>
              )}

              {imageUrl && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ ...typography.styles.body }}>
                    ✅ Picture attached
                    {flowerType === 'BLOOMING' && <span style={{ ...typography.styles.caption, color: theme.text.secondary }}> (revealed after bloom)</span>}
                  </div>
                </div>
              )}

              {voiceUrl && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ ...typography.styles.body }}>✅ Voice message attached</div>
                </div>
              )}

              {videoUrl && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ ...typography.styles.body }}>✅ Video attached</div>
                </div>
              )}
            </div>
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
            <Button variant="primary" onClick={() => setStep(4)} style={{ flex: 1 }}>
              Next
            </Button>
          </>
        )}

        {step === 4 && (
          <>
            <Button variant="ghost" onClick={() => setStep(3)} style={{ flex: 1 }}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(5)} style={{ flex: 1 }}>
              Next
            </Button>
          </>
        )}

        {step === 5 && (
          <>
            <Button variant="ghost" onClick={() => setStep(4)} style={{ flex: 1 }}>
              Back
            </Button>
            <Button variant="primary" onClick={handlePlant} isLoading={isLoading} style={{ flex: 1 }}>
              Plant
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
