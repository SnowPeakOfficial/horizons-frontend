/**
 * Garden Page - Completely Redesigned
 * Beautiful 3D garden view with professional UI
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '../components/common';
import { PlantFlowerPanel } from '../components/gardens/PlantFlowerPanel';
import { FlowerDetailsModal } from '../components/gardens/FlowerDetailsModal';
import { GardenSettingsModal } from '../components/gardens/GardenSettingsModal';
import { GardenScene } from '../gardens/GardenScene';
import { GARDEN_CONFIGS } from '../gardens/gardenConfigs';
import { FLOWER_DEFINITIONS } from '../flowers/types';
import type { Flower } from '../types/api.types';
import type { PlacedFlower, FlowerDefinition } from '../flowers/types';
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
  const orbitRef = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hoveredFlowerTooltip, setHoveredFlowerTooltip] = useState<{
    flower: PlacedFlower;
    definition: FlowerDefinition;
    screenX: number;
    screenY: number;
  } | null>(null);
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
    height: '72px',
    padding: `0 ${theme.spacing.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 250, 245, 0.92) 100%)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(232, 180, 184, 0.25)',
    boxShadow: '0 4px 16px rgba(212, 144, 154, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
  };

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const headerTitleStyle: React.CSSProperties = {
    ...typography.styles.h4,
    fontFamily: 'Georgia, serif',
    background: 'linear-gradient(135deg, #D4909A 0%, #C48991 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 700,
    fontSize: '1.5rem',
  };

  const headerStatsStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.xl,
    alignItems: 'center',
    marginLeft: theme.spacing.xl,
    padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: theme.radius.full,
    border: '1px solid rgba(232, 180, 184, 0.2)',
  };

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    ...typography.styles.body,
    color: theme.text.secondary,
    fontSize: '13px',
    fontWeight: 500,
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
            onFlowerDragStateChange={(isDragging) => {
              setIsDraggingFlower(isDragging);
              if (isDragging) setHoveredFlowerTooltip(null);
            }}
            onFlowerClick={(flower: Flower) => setSelectedFlower(flower)}
            onFlowerHover={(info) => {
              if (info) {
                setHoveredFlowerTooltip({
                  flower: info.flower,
                  definition: info.definition,
                  screenX: info.screenX ?? 0,
                  screenY: info.screenY ?? 0,
                });
              } else {
                setHoveredFlowerTooltip(null);
              }
            }}
          />
          <OrbitControls
            ref={orbitRef}
            enabled={!isDraggingFlower}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            mouseButtons={{
              LEFT: 2,   // Pan on left-click drag
              MIDDLE: 1, // Zoom on scroll / middle button
              RIGHT: 0,  // Orbit on right-click drag
            }}
            screenSpacePanning={false}
            minDistance={15}
            maxDistance={60}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 3}
            maxAzimuthAngle={Infinity}
            minAzimuthAngle={-Infinity}
            target={[0, 0, 0]}
          />
          {/* Clamp pan target every frame to keep camera inside the garden */}
          <CameraLimiter orbitRef={orbitRef} panLimit={25} />
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
        onClearPosition={() => setPlacedPosition(null)}
        placedPosition={placedPosition}
      />

      {/* Flower Hover Tooltip - DOM overlay, always visible */}
      {hoveredFlowerTooltip && (() => {
        const { flower, definition, screenX, screenY } = hoveredFlowerTooltip;
        const isBud = flower.state === 'BUD';
        const shouldHideIdentity = flower.type === 'BLOOMING' && isBud;
        const displayName = shouldHideIdentity ? 'Mystery Flower' : definition.name;
        const displayEmoji = shouldHideIdentity ? '\u{1F331}' : definition.emoji;

        const TOOLTIP_W = 450;
        const PAD = 12;
        // Position above cursor; clamp after measuring via ref
        const tooltipH = tooltipRef.current?.offsetHeight ?? 220;
        let left = screenX - TOOLTIP_W / 2;
        let top = screenY - tooltipH - 16;
        left = Math.max(PAD, Math.min(window.innerWidth - TOOLTIP_W - PAD, left));
        top = Math.max(PAD, Math.min(window.innerHeight - tooltipH - PAD, top));

        return (
          <div
            ref={tooltipRef}
            style={{
              position: 'fixed',
              left,
              top,
              width: TOOLTIP_W,
              zIndex: 9999,
              pointerEvents: 'none',
              background: '#FFFFFF',
              padding: '16px 20px',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(61,51,64,0.15), 0 4px 12px rgba(61,51,64,0.08)',
              border: '2px solid #FFC9D9',
            }}
          >
            <div style={{ textAlign: 'center', fontSize: '10px', fontFamily: 'Georgia, serif', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9D8F99', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(232,180,184,0.2)', opacity: 0.6 }}>
              {'\u2661'} HORIZONS {'\u2661'}
            </div>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
              <div style={{ flex: '0 0 140px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{displayEmoji}</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#3D3340', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>{displayName}</div>
                <div style={{ fontSize: '12px', color: '#3D3340', fontFamily: 'Georgia, serif' }}>{flower.state === 'BUD' ? '\u{1F331} Waiting to bloom' : '\u{1F338} In bloom'}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
                <div style={{ fontSize: '12px', color: '#3D3340', fontFamily: 'Georgia, serif' }}><span style={{ color: '#9D8F99' }}>From:</span> <span style={{ fontWeight: 500 }}>{flower.plantedBy?.name || 'A friend'}</span></div>
                <div style={{ fontSize: '12px', color: '#3D3340', fontFamily: 'Georgia, serif' }}><span style={{ color: '#9D8F99' }}>For:</span> <span style={{ fontWeight: 500 }}>{flower.recipientName || 'you'}</span></div>
                <div style={{ fontSize: '12px', color: '#3D3340', fontFamily: 'Georgia, serif', marginTop: '4px' }}><span style={{ color: '#9D8F99' }}>Planted:</span> <span style={{ fontWeight: 500 }}>{new Date(flower.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                {flower.state === 'BUD' && flower.bloomAt && (
                  <div style={{ fontSize: '12px', color: '#3D3340', fontFamily: 'Georgia, serif' }}><span style={{ color: '#9D8F99' }}>Will bloom:</span> <span style={{ fontWeight: 500 }}>{new Date(flower.bloomAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                )}
                {(flower.state === 'BLOOMED' || flower.state === 'OPEN') && flower.bloomedAt && (
                  <div style={{ fontSize: '12px', color: '#3D3340', fontFamily: 'Georgia, serif' }}><span style={{ color: '#9D8F99' }}>Bloomed:</span> <span style={{ fontWeight: 500 }}>{new Date(flower.bloomedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 500, color: '#D4909A', paddingTop: '12px', borderTop: '1px solid rgba(232,180,184,0.2)', fontFamily: 'Georgia, serif' }}>
              Click flower to open
            </div>
          </div>
        );
      })()}

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

/**
 * Clamps the OrbitControls pan target every frame to keep the camera
 * within the garden bounds. Uses useFrame to avoid infinite loops.
 */
function CameraLimiter({ orbitRef, panLimit }: { orbitRef: React.RefObject<any>; panLimit: number }) {
  useFrame(() => {
    const controls = orbitRef.current;
    if (!controls) return;
    const target = controls.target;
    const clamped = {
      x: Math.max(-panLimit, Math.min(panLimit, target.x)),
      z: Math.max(-panLimit, Math.min(panLimit, target.z)),
    };
    if (target.x !== clamped.x || target.z !== clamped.z) {
      target.x = clamped.x;
      target.z = clamped.z;
      controls.update();
    }
  });
  return null;
}
