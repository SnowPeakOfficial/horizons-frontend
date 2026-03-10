/**
 * Garden Page - Completely Redesigned
 * Beautiful 3D garden view with professional UI
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { LetterRevealOverlay } from '../components/gardens/LetterRevealOverlay';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
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
import TouchApp from '@mui/icons-material/TouchApp';

export const GardenPage: React.FC = () => {
  const { gardenId, flowerId } = useParams<{ gardenId: string; flowerId?: string }>();
  const [searchParams] = useSearchParams();
  const fromEmail = searchParams.get('from') === 'email';
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentGarden, fetchGardenById } = useGardenStore();
  const { flowers, fetchFlowersByGarden } = useFlowerStore();
  const [isPlantPanelOpen, setIsPlantPanelOpen] = useState(false);
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [_selectedFlowerForPlacement, setSelectedFlowerForPlacement] = useState<{ key: string } | null>(null);
  const [placedPosition, setPlacedPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [isDraggingFlower, setIsDraggingFlower] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Email deep-link: show reveal overlay before opening the modal
  const [showRevealOverlay, setShowRevealOverlay] = useState(fromEmail && !!flowerId);
  // Ref guard: prevents the deep-link flower from opening more than once
  const deepLinkOpenedRef = useRef(false);
  const orbitRef = useRef<OrbitControlsImpl>(null);
  // Ref to the PlantFlowerPanel's cancel-placement callback (set via onCancelPlacementStep prop)
  const cancelPlacementStepRef = useRef<(() => void) | null>(null);
  const [hoveredFlowerTooltip, setHoveredFlowerTooltip] = useState<{
    flower: PlacedFlower;
    definition: FlowerDefinition;
    screenX: number;
    screenY: number;
  } | null>(null);
  // True when the viewport is mobile-width (≤768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (gardenId) {
      fetchGardenById(gardenId);
      fetchFlowersByGarden(gardenId);
    }
  }, [gardenId, fetchGardenById, fetchFlowersByGarden]);

  // Auto-open the deep-link flower once flowers are loaded
  useEffect(() => {
    if (!flowerId || deepLinkOpenedRef.current || flowers.length === 0) return;
    const target = flowers.find((f) => f.id === flowerId);
    if (target) {
      deepLinkOpenedRef.current = true;
      if (!fromEmail) {
        // Defer to avoid synchronous setState inside effect
        setTimeout(() => setSelectedFlower(target), 0);
      }
      // fromEmail: overlay already showing; modal opens via onDone callback
    }
  }, [flowerId, flowers, fromEmail]);

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
    overflow: 'hidden',
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
          <div style={{ ...headerTitleStyle, ...(isMobile ? { fontSize: '1.1rem' } : {}) }}>
            {currentGarden?.title || 'Loading...'}
          </div>

          {/* Garden Stats */}
          {currentGarden && (
            <div className="garden-stats" style={headerStatsStyle}>
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
        <div className="garden-header-actions" style={headerRightStyle}>
          {isMobile ? (
            <>
              <button
                onClick={() => setIsSettingsOpen(true)}
                title="Garden Details"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#E8A4B0',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(212, 144, 154, 0.35)',
                  transition: 'background 0.2s ease',
                }}
              >
                <SettingsOutlined sx={{ fontSize: 22, color: '#FFFFFF' }} />
              </button>
              <button
                onClick={() => setIsPlantPanelOpen(true)}
                title="Plant Flower"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#E8A4B0',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(212, 144, 154, 0.35)',
                  transition: 'background 0.2s ease',
                }}
              >
                <LocalFlorist sx={{ fontSize: 22, color: '#FFFFFF' }} />
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
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
            onFlowerClick={(flower: Flower) => {
              setSelectedFlower(flower);
              navigate(`/garden/${gardenId}/flower/${flower.id}`, { replace: false });
            }}
            onFlowerHover={(info) => {
              // Hover tooltips are meaningless on touch-only devices — skip entirely to avoid lag
              if (isMobile) return;
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
          <CameraLimiter controlsRef={orbitRef} />
          <OrbitControls
            ref={orbitRef}
            enabled={!isDraggingFlower}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            mouseButtons={{
              LEFT: 0,   // Orbit on left-click drag
              MIDDLE: 1, // Zoom on scroll / middle button
              RIGHT: 2,  // Pan on right-click drag
            }}
            screenSpacePanning={false}
            minDistance={15}
            maxDistance={60}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI * 0.48}
            maxAzimuthAngle={Infinity}
            minAzimuthAngle={-Infinity}
            target={[0, 0, 0]}
          />
          {/* Clamp pan target every frame to keep camera inside the garden */}
        </Canvas>
      </div>

      {/* Mobile Placement Hint — compact card shown when step 2 is active on mobile */}
      {isMobile && isPlacementMode && (
        <div
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '16px',
            right: '16px',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none',
          }}
        >
          {/* Hint card */}
          <div
            style={{
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '12px 16px',
              border: '1px solid rgba(232, 164, 176, 0.4)',
              boxShadow: '0 4px 16px rgba(212, 144, 154, 0.18)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#FFF0F3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TouchApp sx={{ fontSize: 18, color: '#D4909A' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '13px', fontWeight: 600, color: '#3D3340', lineHeight: 1.3 }}>
                Tap anywhere to place
              </span>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', color: '#9D8F99', lineHeight: 1.3 }}>
                You can move it anywhere later
              </span>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => {
              setIsPlacementMode(false);
              setSelectedFlowerForPlacement(null);
              cancelPlacementStepRef.current?.();
            }}
            style={{
              pointerEvents: 'auto',
              padding: '9px',
              borderRadius: '10px',
              background: '#FFFFFF',
              border: '1px solid rgba(232, 164, 176, 0.4)',
              boxShadow: '0 2px 8px rgba(212, 144, 154, 0.12)',
              color: '#D4909A',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: '"Inter", sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            ← Back to flower selection
          </button>
        </div>
      )}

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
        onCancelPlacementStep={(fn: () => void) => { cancelPlacementStepRef.current = fn; }}
      />

      {/* Flower Hover Tooltip - DOM overlay, always visible */}
      {hoveredFlowerTooltip && (() => {
        const { flower, definition, screenX, screenY } = hoveredFlowerTooltip;
        const isBud = flower.state === 'BUD';
        const shouldHideIdentity = flower.type === 'BLOOMING' && isBud;
        const displayName = shouldHideIdentity ? 'Mystery Flower' : definition.name;
        const displayEmoji = shouldHideIdentity ? '\u{1F331}' : definition.emoji;

        const TOOLTIP_W = 450;
        const TOOLTIP_H = 220;
        const PAD = 12;
        let left = screenX - TOOLTIP_W / 2;
        let top = screenY - TOOLTIP_H - 16;
        left = Math.max(PAD, Math.min(window.innerWidth - TOOLTIP_W - PAD, left));
        top = Math.max(PAD, Math.min(window.innerHeight - TOOLTIP_H - PAD, top));

        return (
          <div
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

      {/* Email deep-link: cinematic reveal overlay */}
      {showRevealOverlay && (
        <LetterRevealOverlay
          onDone={() => {
            setShowRevealOverlay(false);
            if (flowerId) {
              const target = flowers.find((f) => f.id === flowerId);
              if (target) setSelectedFlower(target);
            }
          }}
        />
      )}

      {/* Flower Details Modal - Beautiful Letter Style */}
      <FlowerDetailsModal
        isOpen={!!selectedFlower}
        onClose={() => {
          setSelectedFlower(null);
          // Return URL to garden level (no flower ID)
          navigate(`/garden/${gardenId}`, { replace: true });
        }}
        flower={selectedFlower}
        definition={selectedFlower ? FLOWER_DEFINITIONS[selectedFlower.flowerDefinition?.key?.toLowerCase() || 'daisy'] : null}
        fromEmail={fromEmail && !!flowerId}
        onDelete={async (fid) => {
          // TODO: Implement flower deletion
          console.log('Delete flower:', fid);
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
 * CameraClamp - runs inside the Canvas every frame and clamps the OrbitControls
 * target (the pan focal point) so the user can't pan outside the garden bounds.
 * The garden is 60×60 units centred at origin, so we allow -25..+25 on X and Z.
 */
const PAN_BOUNDS = {
  minX: -25, maxX: 25,
  minY:   0, maxY:  5,
  minZ: -25, maxZ: 25,
};

function CameraLimiter({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const target = controls.target as THREE.Vector3;
    let changed = false;

    if (target.x < PAN_BOUNDS.minX) { target.x = PAN_BOUNDS.minX; changed = true; }
    if (target.x > PAN_BOUNDS.maxX) { target.x = PAN_BOUNDS.maxX; changed = true; }
    if (target.y < PAN_BOUNDS.minY) { target.y = PAN_BOUNDS.minY; changed = true; }
    if (target.y > PAN_BOUNDS.maxY) { target.y = PAN_BOUNDS.maxY; changed = true; }
    if (target.z < PAN_BOUNDS.minZ) { target.z = PAN_BOUNDS.minZ; changed = true; }
    if (target.z > PAN_BOUNDS.maxZ) { target.z = PAN_BOUNDS.maxZ; changed = true; }

    if (changed) {
      controls.update();
    }
  });

  return null;
}
