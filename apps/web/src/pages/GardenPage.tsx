/**
 * Garden Page - Completely Redesigned
 * Beautiful 3D garden view with professional UI
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '../components/common';
import { PlantFlowerPanel } from '../components/gardens/PlantFlowerPanel';
import { FlowerDetailsModal } from '../components/gardens/FlowerDetailsModal';
import { GardenSettingsModal } from '../components/gardens/GardenSettingsModal';
import { GardenScene } from '../gardens/GardenScene';
import { GARDEN_CONFIGS } from '../gardens/gardenConfigs';
import { FLOWER_DEFINITIONS } from '../flowers/types';
import type { Flower } from '../types/api.types';
import { useGardenStore } from '../stores/gardenStore';
import { useFlowerStore } from '../stores/flowerStore';
import { useAuthStore } from '../stores/authStore';
import flowerService from '../services/flowerService';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import People from '@mui/icons-material/People';
import CalendarToday from '@mui/icons-material/CalendarToday';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

export const GardenPage: React.FC = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentGarden, fetchGardenById } = useGardenStore();
  const { flowers, fetchFlowersByGarden } = useFlowerStore();
  const [isPlantPanelOpen, setIsPlantPanelOpen] = useState(false);
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [selectedFlowerForPlacement, setSelectedFlowerForPlacement] = useState<any>(null);
  const [placedPosition, setPlacedPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [isDraggingFlower, setIsDraggingFlower] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (gardenId) {
      fetchGardenById(gardenId);
      fetchFlowersByGarden(gardenId);
    }
  }, [gardenId, fetchGardenById, fetchFlowersByGarden]);

  const handlePlantSuccess = () => {
    if (gardenId) {
      fetchFlowersByGarden(gardenId);
    }
  };

  const handleFlowerDragEnd = async (flowerId: string, position: { x: number; y: number; z: number }, rotation: number) => {
    try {
      console.log(`🌸 Saving flower position: ${flowerId}`, position);
      
      // Save to backend
      await flowerService.updateFlowerPosition({
        flowerId,
        position,
        rotation
      });
      
      console.log('✅ Flower position saved successfully');
      
      // Refresh flowers to get updated data
      if (gardenId) {
        fetchFlowersByGarden(gardenId);
      }
    } catch (error) {
      console.error('❌ Failed to save flower position:', error);
      // TODO: Show error toast notification
      // For now, just refresh to revert to original position
      if (gardenId) {
        fetchFlowersByGarden(gardenId);
      }
    }
  };

  const formatDate = (dateString: string) => {

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    position: 'relative',
    background: '#E8F5E9',
  };

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    padding: `0 ${theme.spacing.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(232, 180, 184, 0.2)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  };

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const headerTitleStyle: React.CSSProperties = {
    ...typography.styles.h4,
    color: theme.text.primary,
    fontWeight: 600,
  };

  const headerStatsStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
    alignItems: 'center',
    marginLeft: theme.spacing.xl,
  };

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    ...typography.styles.body,
    color: theme.text.secondary,
    fontSize: '14px',
  };

  const headerRightStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
  };

  const canvasContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      {/* Professional Header Bar */}
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          {/* Back Button */}
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigate('/my-gardens')}
            style={{
              minWidth: 'auto',
              padding: '8px',
            }}
          >
            <ArrowBack sx={{ fontSize: 20 }} />
          </Button>

          {/* Garden Title */}
          <div style={headerTitleStyle}>
            {currentGarden?.title || 'Loading...'}
          </div>

          {/* Garden Stats */}
          {currentGarden && (
            <div style={headerStatsStyle}>
              <div style={statItemStyle}>
                <LocalFlorist sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                <span>{flowers.length} flowers</span>
              </div>
              <div style={statItemStyle}>
                <People sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                <span>{currentGarden.members?.length || 0} members</span>
              </div>
              <div style={statItemStyle}>
                <CalendarToday sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                <span>{formatDate(currentGarden.createdAt)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={headerRightStyle}>
          <Button
            variant="primary"
            size="medium"
            onClick={() => setIsSettingsOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
            }}
          >
            <SettingsOutlined sx={{ fontSize: 18 }} />
            Garden Details
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={() => setIsPlantPanelOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
            }}
          >
            <LocalFlorist sx={{ fontSize: 18 }} />
            Plant Flower
          </Button>
        </div>
      </div>

      {/* 3D Garden Scene */}
      <div style={canvasContainerStyle}>
        <Canvas
          shadows
          camera={{ position: [0, 25, 35], fov: 50 }}
        >
          <GardenScene 
            config={GARDEN_CONFIGS.test_garden}
            flowers={flowers}
            isPlacementMode={isPlacementMode}
            onTerrainClick={(position) => {
              if (isPlacementMode) {
                setPlacedPosition(position);
              }
            }}
            onFlowerDragEnd={handleFlowerDragEnd}
            onFlowerDragStateChange={setIsDraggingFlower}
            onFlowerClick={(flower: Flower) => setSelectedFlower(flower)}
          />
          <OrbitControls
            enabled={!isDraggingFlower}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={80}
            maxPolarAngle={Math.PI / 2.1}
          />
        </Canvas>
      </div>

      {/* Plant Flower Panel */}
      <PlantFlowerPanel
        isOpen={isPlantPanelOpen}
        onClose={() => {
          setIsPlantPanelOpen(false);
          setIsPlacementMode(false);
          setSelectedFlowerForPlacement(null);
          // Don't reset placedPosition here - let the panel manage its own cleanup
          // This prevents clearing the position before the plant action completes
          setTimeout(() => setPlacedPosition(null), 100);
        }}
        gardenId={gardenId || ''}
        userTier={user?.tier || 'FREE'}
        onPlantSuccess={handlePlantSuccess}
        onPlacementModeChange={(active, definition) => {
          setIsPlacementMode(active);
          setSelectedFlowerForPlacement(definition);
          // Don't clear placedPosition here - it needs to persist for step 3
          // Position is only cleared when the panel fully closes
        }}
        placedPosition={placedPosition}
      />

      {/* Flower Details Modal - Beautiful Letter Style */}
      <FlowerDetailsModal
        isOpen={!!selectedFlower}
        onClose={() => setSelectedFlower(null)}
        flower={selectedFlower}
        definition={selectedFlower ? FLOWER_DEFINITIONS[selectedFlower.flowerDefinition?.key?.toLowerCase() || 'daisy'] : null}
        onDelete={async (flowerId) => {
          // TODO: Implement flower deletion
          console.log('Delete flower:', flowerId);
        }}
      />

      {/* Garden Settings Modal */}
      {currentGarden && user && (
        <GardenSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          garden={currentGarden}
          currentUserId={user.id}
          currentUserTier={user.tier}
          onGardenUpdated={() => {
            if (gardenId) {
              fetchGardenById(gardenId);
              fetchFlowersByGarden(gardenId);
            }
          }}
          onGardenDeleted={() => {
            navigate('/my-gardens');
          }}
        />
      )}
    </div>
  );
};
