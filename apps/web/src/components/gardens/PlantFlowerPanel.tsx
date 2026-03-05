/**
 * Plant Flower Panel
 * Side panel for planting flowers with 3-step flow
 * Step 1: Choose flower type
 * Step 2: Click garden to place
 * Step 3: Configure bloom options
 */

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '../common';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import { useFlowerStore } from '../../stores/flowerStore';
import { FLOWER_DEFINITIONS } from '../../flowers/types';
import flowerService from '../../services/flowerService';
import gardenService from '../../services/gardenService';
import { uploadMedia, createPreviewUrl } from '../../services/uploadService';
import { validateMediaFile, getUploadHint, MediaValidationError } from '../../services/mediaGuardrails';
import type { FlowerDefinition, FlowerType, UserTier } from '../../types/api.types';
import { LETTER_TEMPLATES, LETTER_TEMPLATE_ORDER } from '../../flowers/letterTemplates';
import type { LetterTemplateKey } from '../../flowers/letterTemplates';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import Spa from '@mui/icons-material/Spa';
import Close from '@mui/icons-material/Close';
import TouchApp from '@mui/icons-material/TouchApp';
import Nature from '@mui/icons-material/Nature';
import Info from '@mui/icons-material/Info';
import Lock from '@mui/icons-material/Lock';
import AddAPhoto from '@mui/icons-material/AddAPhoto';
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined';
import Mic from '@mui/icons-material/Mic';
import Videocam from '@mui/icons-material/Videocam';
import MusicNote from '@mui/icons-material/MusicNote';
import CameraAlt from '@mui/icons-material/CameraAlt';
import { MediaCaptureModal } from '../common/MediaCaptureModal';
import type { CaptureMode } from '../common/MediaCaptureModal';

/**
 * 3D Flower Preview Component
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

// Zod validation schema
const plantFlowerFormSchema = z.object({
  recipientName: z.string().max(50, 'Name must be 50 characters or less').optional().or(z.literal('')),
  recipientEmail: z.string().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: 'Please enter a valid email address'
  }),
  seedMessage: z.string().max(500, 'Message must be 500 characters or less').optional().or(z.literal('')),
  bloomMessage: z.string().max(500, 'Message must be 500 characters or less').optional().or(z.literal('')),
  bloomAt: z.string().optional(),
});

type PlantFlowerFormData = z.infer<typeof plantFlowerFormSchema>;

// Media file state for pending uploads
interface MediaFile {
  file: File;
  previewUrl: string; // object URL for local preview
}

interface PlantFlowerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  gardenId: string;
  userTier: string;
  onPlantSuccess?: () => void;
  onPlacementModeChange?: (active: boolean, definition: FlowerDefinition | null) => void;
  onClearPosition?: () => void;
  placedPosition: { x: number; y: number; z: number } | null;
}

export const PlantFlowerPanel: React.FC<PlantFlowerPanelProps> = ({
  isOpen,
  onClose,
  gardenId,
  userTier,
  onPlantSuccess,
  onPlacementModeChange,
  onClearPosition,
  placedPosition,
}) => {
  const { flowerDefinitions, plantFlower, fetchFlowerDefinitions } = useFlowerStore();
  const [step, setStep] = useState(1);
  const [selectedDefinition, setSelectedDefinition] = useState<FlowerDefinition | null>(null);
  const [flowerType, setFlowerType] = useState<FlowerType>('STANDARD');
  const [letterTemplate, setLetterTemplate] = useState<LetterTemplateKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Media file state — files selected by user, not yet uploaded
  const [imageFile, setImageFile] = useState<MediaFile | null>(null);
  const [voiceFile, setVoiceFile] = useState<MediaFile | null>(null);
  const [videoFile, setVideoFile] = useState<MediaFile | null>(null);

  // Upload progress (0-100 or null)
  const [imageProgress, setImageProgress] = useState<number | null>(null);
  const [voiceProgress, setVoiceProgress] = useState<number | null>(null);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);

  // Per-media validation errors (shown inline next to each upload button)
  const [imageError, setImageError] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [videoError, setVideoError] = useState('');

  // Capture modal state
  const [captureMode, setCaptureMode] = useState<CaptureMode | null>(null);

  // Handle a file captured live from camera/mic
  const handleCapturedFile = (file: File, type: 'image' | 'voice' | 'video') => {
    if (type === 'image') setImageError('');
    if (type === 'voice') setVoiceError('');
    if (type === 'video') setVideoError('');
    const previewUrl = URL.createObjectURL(file);
    const mediaFile = { file, previewUrl };
    if (type === 'image') { setImageFile(mediaFile); setImageProgress(null); }
    if (type === 'voice') { setVoiceFile(mediaFile); setVoiceProgress(null); }
    if (type === 'video') { setVideoFile(mediaFile); setVideoProgress(null); }
  };

  // Hidden file input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // React Hook Form with Zod validation
  const {
    register,
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
    },
  });

  // Watch form values
  const formValues = watch();
  const { recipientName, recipientEmail, seedMessage, bloomMessage, bloomAt } = formValues;

  // Helper: select a file, validate it, then create a local preview
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'voice' | 'video',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous error for this slot
    if (type === 'image') setImageError('');
    if (type === 'voice') setVoiceError('');
    if (type === 'video') setVideoError('');

    // Run guardrail validation BEFORE creating a preview
    try {
      await validateMediaFile(file, type);
    } catch (err) {
      const msg = err instanceof MediaValidationError ? err.message : 'Invalid file.';
      if (type === 'image') setImageError(msg);
      if (type === 'voice') setVoiceError(msg);
      if (type === 'video') setVideoError(msg);
      e.target.value = '';
      return; // reject the file — do not show preview
    }

    const previewUrl = createPreviewUrl(file);
    const mediaFile: MediaFile = { file, previewUrl };
    if (type === 'image') { setImageFile(mediaFile); setImageProgress(null); }
    if (type === 'voice') { setVoiceFile(mediaFile); setVoiceProgress(null); }
    if (type === 'video') { setVideoFile(mediaFile); setVideoProgress(null); }
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  // Helper: remove a selected file and revoke preview URL
  const clearFile = (type: 'image' | 'voice' | 'video') => {
    if (type === 'image' && imageFile) { URL.revokeObjectURL(imageFile.previewUrl); setImageFile(null); setImageProgress(null); }
    if (type === 'voice' && voiceFile) { URL.revokeObjectURL(voiceFile.previewUrl); setVoiceFile(null); setVoiceProgress(null); }
    if (type === 'video' && videoFile) { URL.revokeObjectURL(videoFile.previewUrl); setVideoFile(null); setVideoProgress(null); }
  };

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
    setLetterTemplate(null);
    resetForm();
    setError('');
    // Revoke any pending media preview URLs to avoid memory leaks
    if (imageFile) URL.revokeObjectURL(imageFile.previewUrl);
    if (voiceFile) URL.revokeObjectURL(voiceFile.previewUrl);
    if (videoFile) URL.revokeObjectURL(videoFile.previewUrl);
    setImageFile(null); setVoiceFile(null); setVideoFile(null);
    setImageProgress(null); setVoiceProgress(null); setVideoProgress(null);
    if (onPlacementModeChange) {
      onPlacementModeChange(false, null);
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Helper to check if flower is locked for current user
  const isFlowerLocked = (flowerTier: UserTier): boolean => {
    const tierHierarchy: Record<UserTier, number> = {
      FREE: 0,
      PRO: 1,
      PREMIUM: 2,
    };
    return tierHierarchy[userTier as UserTier] < tierHierarchy[flowerTier];
  };

  // Sort flowers by tier: FREE → PRO → PREMIUM
  const sortedFlowerDefinitions = [...flowerDefinitions].sort((a, b) => {
    const tierOrder: Record<string, number> = {
      FREE: 0,
      PRO: 1,
      PREMIUM: 2,
    };
    return tierOrder[a.tierAccess] - tierOrder[b.tierAccess];
  });

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
        letterTemplate: letterTemplate || undefined,
      };

      const plantedFlower = await plantFlower(gardenId, plantData);

      // Step 2: Upload any media files to Firebase Storage
      let uploadedImageUrl: string | undefined;
      let uploadedVoiceUrl: string | undefined;
      let uploadedVideoUrl: string | undefined;

      if (imageFile) {
        try {
          uploadedImageUrl = await uploadMedia(imageFile.file, 'image', plantedFlower.id, setImageProgress);
        } catch (uploadErr) {
          console.error('Failed to upload image:', uploadErr);
        }
      }
      if (voiceFile) {
        try {
          uploadedVoiceUrl = await uploadMedia(voiceFile.file, 'voice', plantedFlower.id, setVoiceProgress);
        } catch (uploadErr) {
          console.error('Failed to upload voice:', uploadErr);
        }
      }
      if (videoFile) {
        try {
          uploadedVideoUrl = await uploadMedia(videoFile.file, 'video', plantedFlower.id, setVideoProgress);
        } catch (uploadErr) {
          console.error('Failed to upload video:', uploadErr);
        }
      }

      // Step 3: Add content based on flower type
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
        if (bloomMessage || uploadedImageUrl || uploadedVoiceUrl || uploadedVideoUrl) {
          try {
            await flowerService.addContent({
              flowerId: plantedFlower.id,
              phase: 'BLOOM',
              text: bloomMessage || undefined,
              imageUrl: uploadedImageUrl,
              voiceUrl: uploadedVoiceUrl,
              videoUrl: uploadedVideoUrl,
            });
          } catch (mediaError) {
            console.error('Failed to add bloom content:', mediaError);
          }
        }
      } else {
        // For STANDARD flowers: create IMMEDIATE content (all together)
        if (seedMessage || uploadedImageUrl || uploadedVoiceUrl || uploadedVideoUrl) {
          try {
            await flowerService.addContent({
              flowerId: plantedFlower.id,
              phase: 'IMMEDIATE',
              text: seedMessage || undefined,
              imageUrl: uploadedImageUrl,
              voiceUrl: uploadedVoiceUrl,
              videoUrl: uploadedVideoUrl,
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
                height: '5px',
                background: s <= step 
                  ? 'linear-gradient(90deg, #D4909A 0%, #E8A4A4 100%)' 
                  : 'rgba(232, 180, 184, 0.15)',
                borderRadius: '3px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: s <= step ? '0 2px 4px rgba(212, 144, 154, 0.3)' : 'none',
              }}
            />
          ))}
        </div>
        <div
          style={{
            ...typography.styles.caption,
            color: theme.text.secondary,
            marginTop: theme.spacing.sm,
            fontWeight: 600,
            fontSize: '11px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
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
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md,
              }}
            >
              {sortedFlowerDefinitions.map((def) => {
                const isSelected = selectedDefinition?.id === def.id;
                const isLocked = isFlowerLocked(def.tierAccess as UserTier);
                
                // Map backend key to frontend definition
                const frontendDef = FLOWER_DEFINITIONS[def.key.toLowerCase()];
                const modelPath = frontendDef?.modelPath || '';
                const previewScale = frontendDef?.previewScale || 2.5;
                const previewOffset = frontendDef?.previewOffset;
                
                // Tier badge colors
                const tierColors = {
                  FREE: { bg: '#E8F5E9', text: '#2E7D32' },
                  PRO: { bg: '#E3F2FD', text: '#1565C0' },
                  PREMIUM: { bg: '#F3E5F5', text: '#6A1B9A' },
                };
                const tierColor = tierColors[def.tierAccess as keyof typeof tierColors] || tierColors.FREE;
                
                return (
                  <div
                    key={def.id}
                    style={{
                      position: 'relative',
                      padding: theme.spacing.lg,
                      border: `2px solid ${
                        isSelected 
                          ? theme.colors.rose[400]
                          : isLocked 
                          ? theme.colors.neutral.gray[300]
                          : '#FFD1DC'
                      }`,
                      borderRadius: '16px',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: isSelected ? theme.colors.rose[50] : '#FFFFFF',
                      boxShadow: isSelected 
                        ? '0 4px 16px rgba(255, 105, 180, 0.2)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.06)',
                      opacity: isLocked ? 0.7 : 1,
                      textAlign: 'center',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLocked) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLocked) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = isSelected 
                          ? '0 4px 16px rgba(255, 105, 180, 0.2)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.06)';
                      }
                    }}
                    onClick={() => {
                      if (!isLocked) {
                        setSelectedDefinition(def);
                      }
                    }}
                  >
                    {/* Tier Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: tierColor.bg,
                        color: tierColor.text,
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {def.tierAccess}
                    </div>

                    {/* 3D Model Preview */}
                    {modelPath && (
                      <div
                        style={{
                          width: '140px',
                          height: '140px',
                          margin: '0 auto 16px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: '#FFFFFF',
                          border: `3px solid ${tierColor.bg}`,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <Canvas
                          camera={{ position: [0, 0, 8], fov: 45 }}
                          style={{ width: '100%', height: '100%' }}
                        >
                          <ambientLight intensity={0.9} />
                          <directionalLight position={[5, 5, 5]} intensity={1.2} />
                          <Suspense fallback={null}>
                            <FlowerPreview modelPath={modelPath} scale={previewScale} offset={previewOffset} />
                          </Suspense>
                          <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            autoRotate
                            autoRotateSpeed={2}
                          />
                        </Canvas>
                      </div>
                    )}

                    {/* Flower Name */}
                    <div
                      style={{
                        ...typography.styles.body,
                        fontWeight: 600,
                        fontSize: '16px',
                        marginBottom: theme.spacing.xs,
                        color: theme.text.primary,
                      }}
                    >
                      {def.displayName}
                    </div>

                    {/* Description */}
                    <div
                      style={{
                        ...typography.styles.caption,
                        fontSize: '13px',
                        lineHeight: '1.5',
                        color: theme.text.secondary,
                        marginBottom: isLocked ? theme.spacing.sm : 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {def.description || 'A beautiful flower for your memory'}
                    </div>

                    {/* Lock Message */}
                    {isLocked && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          marginTop: theme.spacing.sm,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: theme.colors.neutral.gray[100],
                          color: theme.text.secondary,
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        <Lock sx={{ fontSize: 14 }} />
                        Requires {def.tierAccess}
                      </div>
                    )}
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
              fullWidth
            />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '-10px', marginBottom: theme.spacing.lg }}>
              <LightbulbOutlined sx={{ fontSize: 15, color: '#D4909A', marginTop: '1px', flexShrink: 0 }} />
              <span style={{ ...typography.styles.caption, color: theme.text.secondary }}>
                If provided, we'll invite them as a contributor to view this garden
              </span>
            </div>

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

            {/* Hidden file inputs */}
            <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e, 'image')} />
            <input ref={voiceInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e, 'voice')} />
            <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e, 'video')} />

            {/* Photo upload */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{ ...typography.styles.label, color: theme.text.primary, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: theme.spacing.sm }}>
                <AddAPhoto sx={{ fontSize: 18, color: theme.colors.rose[400] }} /> Photo {flowerType === 'BLOOMING' && <span style={{ ...typography.styles.caption, color: theme.text.secondary }}>(revealed when flower blooms)</span>}
              </label>
              {imageFile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.md, border: `2px solid ${theme.colors.rose[300]}`, borderRadius: theme.radius.lg, background: theme.colors.rose[50] }}>
                  <img src={imageFile.previewUrl} alt="preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: theme.radius.md }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...typography.styles.caption, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{imageFile.file.name}</div>
                    <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>{(imageFile.file.size / 1024 / 1024).toFixed(1)} MB</div>
                    {imageProgress !== null && <div style={{ marginTop: 4, height: 4, background: '#eee', borderRadius: 2 }}><div style={{ width: `${imageProgress}%`, height: '100%', background: theme.colors.rose[400], borderRadius: 2, transition: 'width 0.2s' }} /></div>}
                  </div>
                  <button onClick={() => clearFile('image')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text.secondary, padding: 4, fontSize: 18, lineHeight: 1 }}>✕</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => imageInputRef.current?.click()} style={{ flex: 1, padding: `${theme.spacing.md} ${theme.spacing.lg}`, border: `2px dashed ${imageError ? theme.semantic.error : theme.colors.rose[300]}`, borderRadius: theme.radius.lg, background: 'transparent', cursor: 'pointer', color: theme.text.secondary, ...typography.styles.body, textAlign: 'center' }}>
                    + Choose photo
                  </button>
                  <button onClick={() => setCaptureMode('photo')} title="Take photo" style={{ padding: '0 14px', border: `2px solid ${theme.colors.rose[300]}`, borderRadius: theme.radius.lg, background: theme.colors.rose[50], cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <CameraAlt sx={{ fontSize: 20, color: theme.colors.rose[500] }} />
                  </button>
                </div>
              )}
              {imageError ? (
                <div style={{ ...typography.styles.caption, color: theme.semantic.error, marginTop: theme.spacing.xs, display: 'flex', alignItems: 'center', gap: 4 }}>⚠️ {imageError}</div>
              ) : (
                <div style={{ ...typography.styles.caption, color: theme.text.secondary, marginTop: theme.spacing.xs }}>{getUploadHint('image')}</div>
              )}
            </div>

            {/* Voice upload */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{ ...typography.styles.label, color: theme.text.primary, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: theme.spacing.sm }}>
                <Mic sx={{ fontSize: 18, color: theme.colors.rose[400] }} /> Voice message {flowerType === 'BLOOMING' && <span style={{ ...typography.styles.caption, color: theme.text.secondary }}>(revealed when flower blooms)</span>}
              </label>
              {voiceFile ? (
                <div style={{ padding: theme.spacing.md, border: `2px solid ${theme.colors.rose[300]}`, borderRadius: theme.radius.lg, background: theme.colors.rose[50] }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: voiceProgress !== null ? theme.spacing.sm : 0 }}>
                    <MusicNote sx={{ fontSize: 28, color: theme.colors.rose[400] }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...typography.styles.caption, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{voiceFile.file.name}</div>
                      <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>{(voiceFile.file.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                    <button onClick={() => clearFile('voice')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text.secondary, padding: 4, fontSize: 18, lineHeight: 1 }}>✕</button>
                  </div>
                  <audio controls src={voiceFile.previewUrl} style={{ width: '100%', height: 36 }} />
                  {voiceProgress !== null && <div style={{ marginTop: 4, height: 4, background: '#eee', borderRadius: 2 }}><div style={{ width: `${voiceProgress}%`, height: '100%', background: theme.colors.rose[400], borderRadius: 2, transition: 'width 0.2s' }} /></div>}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => voiceInputRef.current?.click()} style={{ flex: 1, padding: `${theme.spacing.md} ${theme.spacing.lg}`, border: `2px dashed ${voiceError ? theme.semantic.error : theme.colors.rose[300]}`, borderRadius: theme.radius.lg, background: 'transparent', cursor: 'pointer', color: theme.text.secondary, ...typography.styles.body, textAlign: 'center' }}>
                    + Choose audio file
                  </button>
                  <button onClick={() => setCaptureMode('voice')} title="Record voice" style={{ padding: '0 14px', border: `2px solid ${theme.colors.rose[300]}`, borderRadius: theme.radius.lg, background: theme.colors.rose[50], cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Mic sx={{ fontSize: 20, color: theme.colors.rose[500] }} />
                  </button>
                </div>
              )}
              {voiceError ? (
                <div style={{ ...typography.styles.caption, color: theme.semantic.error, marginTop: theme.spacing.xs, display: 'flex', alignItems: 'center', gap: 4 }}>⚠️ {voiceError}</div>
              ) : (
                <div style={{ ...typography.styles.caption, color: theme.text.secondary, marginTop: theme.spacing.xs }}>{getUploadHint('voice')}</div>
              )}
            </div>

            {/* Video upload */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{ ...typography.styles.label, color: theme.text.primary, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: theme.spacing.sm }}>
                <Videocam sx={{ fontSize: 18, color: theme.colors.rose[400] }} /> Video {flowerType === 'BLOOMING' && <span style={{ ...typography.styles.caption, color: theme.text.secondary }}>(revealed when flower blooms)</span>}
              </label>
              {videoFile ? (
                <div style={{ padding: theme.spacing.md, border: `2px solid ${theme.colors.rose[300]}`, borderRadius: theme.radius.lg, background: theme.colors.rose[50] }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.sm }}>
                    <Videocam sx={{ fontSize: 28, color: theme.colors.rose[400] }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...typography.styles.caption, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{videoFile.file.name}</div>
                      <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>{(videoFile.file.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                    <button onClick={() => clearFile('video')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text.secondary, padding: 4, fontSize: 18, lineHeight: 1 }}>✕</button>
                  </div>
                  <video controls src={videoFile.previewUrl} style={{ width: '100%', borderRadius: theme.radius.md, maxHeight: 160 }} />
                  {videoProgress !== null && <div style={{ marginTop: 4, height: 4, background: '#eee', borderRadius: 2 }}><div style={{ width: `${videoProgress}%`, height: '100%', background: theme.colors.rose[400], borderRadius: 2, transition: 'width 0.2s' }} /></div>}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => videoInputRef.current?.click()} style={{ flex: 1, padding: `${theme.spacing.md} ${theme.spacing.lg}`, border: `2px dashed ${videoError ? theme.semantic.error : theme.colors.rose[300]}`, borderRadius: theme.radius.lg, background: 'transparent', cursor: 'pointer', color: theme.text.secondary, ...typography.styles.body, textAlign: 'center' }}>
                    + Choose video
                  </button>
                  <button onClick={() => setCaptureMode('video')} title="Record video" style={{ padding: '0 14px', border: `2px solid ${theme.colors.rose[300]}`, borderRadius: theme.radius.lg, background: theme.colors.rose[50], cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Videocam sx={{ fontSize: 20, color: theme.colors.rose[500] }} />
                  </button>
                </div>
              )}
              {videoError ? (
                <div style={{ ...typography.styles.caption, color: theme.semantic.error, marginTop: theme.spacing.xs, display: 'flex', alignItems: 'center', gap: 4 }}>⚠️ {videoError}</div>
              ) : (
                <div style={{ ...typography.styles.caption, color: theme.text.secondary, marginTop: theme.spacing.xs }}>{getUploadHint('video')}</div>
              )}
            </div>

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
                All media is optional. Files upload when you plant.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Choose Letter Template */}
        {step === 4 && (
          <div>
            <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.lg }}>
              Choose the tone for this letter
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              {LETTER_TEMPLATE_ORDER.map((key) => {
                const tmpl = LETTER_TEMPLATES[key];
                const isSelected = letterTemplate === key;
                return (
                  <div
                    key={key}
                    onClick={() => { setLetterTemplate(key); setError(''); }}
                    style={{
                      padding: theme.spacing.lg,
                      border: `2px solid ${isSelected ? tmpl.accentColor : theme.border.light}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      background: isSelected ? `${tmpl.frameColor}30` : '#FFFFFF',
                      boxShadow: isSelected
                        ? `0 4px 16px ${tmpl.frameColor}60`
                        : '0 2px 8px rgba(0,0,0,0.06)',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = tmpl.accentColor + '80'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = theme.border.light; e.currentTarget.style.transform = 'translateY(0)'; } }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.md }}>
                      {/* Colour swatch */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: tmpl.frameColor,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: `0 2px 8px ${tmpl.frameColor}80`,
                      }}>
                        {tmpl.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...typography.styles.body, fontWeight: 700, color: tmpl.accentDark, marginBottom: '2px' }}>
                          {tmpl.label}
                        </div>
                        <div style={{ ...typography.styles.caption, color: theme.text.secondary, marginBottom: '6px' }}>
                          {tmpl.description}
                        </div>
                        <div style={{
                          fontFamily: "'Caveat', cursive",
                          fontSize: '14px',
                          color: tmpl.accentColor,
                          fontStyle: 'italic',
                        }}>
                          {tmpl.previewSnippet}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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

              {imageFile && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                    <img src={imageFile.previewUrl} alt="preview" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: theme.radius.md }} />
                    <div>
                      <div style={{ ...typography.styles.body, fontWeight: 600 }}>📷 Photo attached</div>
                      <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>{imageFile.file.name}</div>
                      {flowerType === 'BLOOMING' && <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>Revealed after bloom</div>}
                    </div>
                  </div>
                </div>
              )}

              {voiceFile && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ ...typography.styles.body, fontWeight: 600, marginBottom: 4 }}>🎙️ Voice message attached</div>
                  <audio controls src={voiceFile.previewUrl} style={{ width: '100%', height: 36 }} />
                  <div style={{ ...typography.styles.caption, color: theme.text.secondary, marginTop: 4 }}>{voiceFile.file.name}</div>
                </div>
              )}

              {videoFile && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ ...typography.styles.body, fontWeight: 600, marginBottom: 4 }}>🎬 Video attached</div>
                  <video controls src={videoFile.previewUrl} style={{ width: '100%', borderRadius: theme.radius.md, maxHeight: 140 }} />
                  <div style={{ ...typography.styles.caption, color: theme.text.secondary, marginTop: 4 }}>{videoFile.file.name}</div>
                </div>
              )}

              {letterTemplate && (
                <div style={{ padding: theme.spacing.md, background: theme.colors.rose[50], borderRadius: theme.radius.md }}>
                  <div style={{ ...typography.styles.caption, color: theme.text.secondary }}>Letter Theme</div>
                  <div style={{ ...typography.styles.body, fontWeight: 600 }}>
                    {LETTER_TEMPLATES[letterTemplate].emoji} {LETTER_TEMPLATES[letterTemplate].label}
                  </div>
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
            <Button variant="ghost" onClick={() => {
              setStep(2);
              if (onClearPosition) {
                onClearPosition();
              }
              if (onPlacementModeChange && selectedDefinition) {
                onPlacementModeChange(true, selectedDefinition);
              }
            }} style={{ flex: 1 }}>
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
            <Button variant="primary" onClick={() => {
              if (!letterTemplate) {
                setError('Please choose a letter theme to continue');
                return;
              }
              setError('');
              setStep(5);
            }} style={{ flex: 1 }}>
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

      {/* Media Capture Modal */}
      <MediaCaptureModal
        isOpen={captureMode !== null}
        mode={captureMode ?? 'photo'}
        onCapture={(file) => {
          if (captureMode === 'photo') handleCapturedFile(file, 'image');
          else if (captureMode === 'voice') handleCapturedFile(file, 'voice');
          else if (captureMode === 'video') handleCapturedFile(file, 'video');
        }}
        onClose={() => setCaptureMode(null)}
      />
    </div>
  );
};
