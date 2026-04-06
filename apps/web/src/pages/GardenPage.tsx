/**
 * Garden Page - Completely Redesigned
 * Beautiful 3D garden view with professional UI
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LetterRevealOverlay } from '../components/gardens/LetterRevealOverlay';
import { LetterPreviewModal } from '../components/gardens/LetterPreviewModal';
import type { LetterTemplateKey } from '../flowers/letterTemplates';
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
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import flowerService from '../services/flowerService';
import gardenService from '../services/gardenService';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import People from '@mui/icons-material/People';
import CalendarToday from '@mui/icons-material/CalendarToday';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import TouchApp from '@mui/icons-material/TouchApp';

// ─── Garden Loading Screen ──────────────────────────────────────────────────
function GardenLoadingScreen({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = React.useState(true);

  // Keep mounted briefly after visible=false so the fade-out plays
  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(t);
    }
    // visible=true: re-mount immediately (no setState needed — initial value is true)
  }, [visible]);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes gls-fadeIn {
          from { opacity: 0; transform: translateY(14px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gls-pulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.75; }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'linear-gradient(180deg, #FDFCFA 0%, #FFF9F7 50%, #FFFFFF 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.45s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        {/* Mesh gradient overlay — same as LetterRevealOverlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 30%, rgba(232,180,188,0.08) 0%, transparent 50%),
                       radial-gradient(circle at 80% 70%, rgba(197,169,208,0.06) 0%, transparent 50%)`,
          pointerEvents: 'none',
        }} />

        {/* Horizons wordmark */}
        <img
          src="/images/horizons-logo-wordmark.svg"
          alt="Horizons"
          style={{
            height: 'clamp(96px, 14vw, 160px)',
            width: 'auto',
            userSelect: 'none',
            pointerEvents: 'none',
            animation: 'gls-fadeIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        />

        {/* Caption */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(13px, 2vw, 15px)',
            color: '#9D8F99',
            letterSpacing: '0.08em',
            animation: 'gls-pulse 2s ease-in-out infinite',
          }}
        >
          Growing your garden…
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────

export const GardenPage: React.FC = () => {
  const { gardenId, flowerId: routeFlowerId } = useParams<{ gardenId: string; flowerId?: string }>();
  const [searchParams] = useSearchParams();
  const fromEmail = searchParams.get('from') === 'email';
  // Guest mode: token from email link — only active when NOT already authenticated.
  // If the user signed up after receiving the link, treat them as a normal auth user.
  const guestToken = searchParams.get('token');
  const guestFlowerId = searchParams.get('flower');
  const { user, isAuthenticated } = useAuthStore();
  const isGuestMode = !!guestToken && !isAuthenticated;
  // For deep-link logic, prefer route param, fall back to ?flower= query param
  const flowerId = routeFlowerId || guestFlowerId || undefined;

  const navigate = useNavigate();
  const { currentGarden, fetchGardenById, successMessage: gardenSuccess, clearSuccess: clearGardenSuccess } = useGardenStore();
  const { flowers, fetchFlowersByGarden, deleteFlower, successMessage: flowerSuccess, clearSuccess: clearFlowerSuccess } = useFlowerStore();

  // Guest-mode state
  const [guestGarden, setGuestGarden] = useState<(typeof currentGarden) | null>(null);
  const [guestFlowers, setGuestFlowers] = useState<Flower[]>([]);
  const [guestDisplayName, setGuestDisplayName] = useState<string | undefined>();

  // Resolved values — guest overrides authenticated store
  const activeGarden = isGuestMode ? guestGarden : currentGarden;
  const activeFlowers = isGuestMode ? guestFlowers : flowers;

  const [isPlantPanelOpen, setIsPlantPanelOpen] = useState(false);

  // Tier flower limits — must match backend enforcement
  const TIER_FLOWER_LIMITS: Record<string, number> = { FREE: 1, PRO: 50, PREMIUM: 100 };

  const handlePlantClick = () => {
    const tier = user?.tier || 'FREE';
    const limit = TIER_FLOWER_LIMITS[tier] ?? 1;
    if (activeFlowers.length >= limit) {
      const nextTier = tier === 'FREE' ? 'PRO' : 'PREMIUM';
      const nextLabel = tier === 'FREE' ? 'PRO' : 'PREMIUM';
      toast.custom(
        (t) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              maxWidth: '320px',
              opacity: t.visible ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ fontSize: '20px', lineHeight: 1 }}>🌸</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#2F2F2F', marginBottom: '4px' }}>
                  {tier} plan flower limit reached
                </div>
                <div style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.5 }}>
                  You've used all {limit} flower{limit === 1 ? '' : 's'} on the {tier} plan.
                </div>
              </div>
            </div>
            <button
              onClick={() => { toast.dismiss(t.id); navigate('/pricing'); }}
              style={{
                alignSelf: 'flex-end',
                padding: '7px 16px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #D4909A 0%, #E8A4A4 100%)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
                letterSpacing: '0.2px',
              }}
            >
              Upgrade to {nextTier === 'PREMIUM' ? '' : ''}{nextLabel} →
            </button>
          </div>
        ),
        { duration: 6000 },
      );
      return;
    }
    setIsPlantPanelOpen(true);
  };
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  // Write-only — value is not read directly; placement is driven by isPlacementMode
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setSelectedFlowerForPlacement] = useState<{ key: string } | null>(null);
  const [placedPosition, setPlacedPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [isDraggingFlower, setIsDraggingFlower] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Email deep-link: show reveal overlay before opening the modal
  const [showRevealOverlay, setShowRevealOverlay] = useState(fromEmail && !!flowerId);
  // Confetti fires only AFTER the overlay animation completes (onDone), not at mount time.
  const [showConfetti, setShowConfetti] = useState(false);

  // Loading screen: starts true on first render, dismissed once the first fetch resolves
  const [showFlowerLoading, setShowFlowerLoading] = useState(true);

  // Planting overlay: shown while uploads + addContent are processing in the background
  const [isPlanting, setIsPlanting] = useState(false);

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
  // Letter preview state — lifted from PlantFlowerPanel so it renders above the side panel
  const [letterPreviewParams, setLetterPreviewParams] = useState<{
    templateKey: LetterTemplateKey;
    flowerDefinition: import('../types/api.types').FlowerDefinition;
    recipientName: string;
    message: string;
    senderName?: string;
    imagePreviewUrl?: string;
    voicePreviewUrl?: string;
    videoPreviewUrl?: string;
    onBack: () => void;
    onConfirm: () => void;
  } | null>(null);

  // True when the viewport is mobile-width (≤768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // True at medium widths (≤1100px) — triggers compact buttons and hidden date stat
  const [isCompact, setIsCompact] = useState(window.innerWidth <= 1100);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsCompact(window.innerWidth <= 1100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock the document body so the mobile browser cannot scroll or bounce the page.
  // The garden is a full-screen 3D canvas — any page-level scroll (e.g. dragging the
  // header on iOS Safari) looks broken. position:fixed + overflow:hidden is the most
  // reliable cross-browser approach, including iOS Safari's rubber-band overscroll.
  useEffect(() => {
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
      height: document.body.style.height,
    };
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.width = prev.width;
      document.body.style.height = prev.height;
    };
  }, []);

  // --- Authenticated fetch ---
  // Runs once per gardenId. Store actions (fetchGardenById, fetchFlowersByGarden) and
  // navigate are stable references — omitting them from deps avoids spurious re-fetches
  // that would otherwise fire on every navigation event (e.g. flower click URL change).
  useEffect(() => {
    if (isGuestMode || !gardenId) return;

    // Fetch garden metadata first — if 403, redirect immediately before rendering anything
    fetchGardenById(gardenId).catch((err: Error & { status?: number }) => {
      const status = err.status;
      if (status === 403 || status === 401) {
        navigate('/my-gardens', { state: { accessDenied: true }, replace: true });
      } else {
        // Generic error — still hide loading screen, garden will show empty
        setShowFlowerLoading(false);
      }
    });

    fetchFlowersByGarden(gardenId).then(() => {
      setShowFlowerLoading(false);
    }).catch(() => {
      // Flower fetch errors are swallowed here — garden-level redirect already handles 403
      setShowFlowerLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId, isGuestMode]);

  // --- Guest fetch (no auth header) ---
  useEffect(() => {
    if (!isGuestMode || !gardenId || !guestToken) return;
    gardenService.fetchGuestGarden(gardenId, guestToken).then((res) => {
      setGuestGarden(res.garden as typeof currentGarden);
      setGuestFlowers(res.garden.flowers ?? []);
      setGuestDisplayName(res.guestDisplayName);
      setShowFlowerLoading(false);
    }).catch((err) => {
      console.error('Failed to load guest garden:', err);
      setShowFlowerLoading(false);
    });
  }, [gardenId, guestToken, isGuestMode]);

  // Auto-open the deep-link flower once flowers are loaded.
  // For email deep-links: pre-set selectedFlower immediately so the FlowerDetailsModal
  // is fully mounted and rendered DURING the overlay animation. When onDone() fires
  // the overlay just lifts — the modal appears instantly with no visible delay.
  useEffect(() => {
    if (!flowerId || deepLinkOpenedRef.current || activeFlowers.length === 0) return;
    const target = activeFlowers.find((f) => f.id === flowerId);
    if (target) {
      deepLinkOpenedRef.current = true;
      if (fromEmail) {
        // Pre-load: defer to next tick (satisfies ESLint) but still fires immediately —
        // well before the 4.35s animation ends, so the modal is fully rendered when onDone() fires.
        setTimeout(() => setSelectedFlower(target), 0);
      } else {
        // Defer to avoid synchronous setState inside effect
        setTimeout(() => setSelectedFlower(target), 0);
      }
    }
  }, [flowerId, activeFlowers, fromEmail]);

  // Auto-dismiss success banners after 3 seconds
  useEffect(() => {
    if (!flowerSuccess) return;
    const t = setTimeout(() => clearFlowerSuccess(), 3000);
    return () => clearTimeout(t);
  }, [flowerSuccess, clearFlowerSuccess]);

  useEffect(() => {
    if (!gardenSuccess) return;
    const t = setTimeout(() => clearGardenSuccess(), 3000);
    return () => clearTimeout(t);
  }, [gardenSuccess, clearGardenSuccess]);

  const handlePlantSuccess = () => {
    if (gardenId) {
      // Refresh garden metadata (member count may have changed if a recipient was invited).
      // Flowers are already up-to-date via pushFlower() — no need to re-fetch them here.
      fetchGardenById(gardenId);
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
    // Prevent touch-drag on the header from triggering a page-level scroll/bounce.
    // Even with body locked, some browsers still dispatch the gesture if the element
    // doesn't explicitly opt out of all touch panning.
    touchAction: 'none',
  };

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: isCompact ? '160px' : '320px',
    flexShrink: 1,
  };

  const headerStatsStyle: React.CSSProperties = {
    display: 'flex',
    gap: isCompact ? theme.spacing.sm : theme.spacing.xl,
    alignItems: 'center',
    marginLeft: isCompact ? theme.spacing.sm : theme.spacing.xl,
    padding: `${theme.spacing.xs} ${isCompact ? theme.spacing.sm : theme.spacing.lg}`,
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: theme.radius.full,
    border: '1px solid rgba(232, 180, 184, 0.2)',
    flexShrink: 0,
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
    // Block all pointer/touch input to the WebGL canvas whenever the plant panel is open
    // but NOT in placement mode (steps 1, 3, 4, 5). During placement mode (step 2) the
    // user must be able to tap the garden to choose a position, so we leave it interactive.
    // Without this, touch/scroll gestures on the panel can leak through to the canvas,
    // causing the browser to think the canvas is being scrolled (shrinking scrollbar) or
    // even firing terrain-click events underneath the panel.
    pointerEvents: (isPlantPanelOpen && !isPlacementMode) ? 'none' : 'auto',
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
            {activeGarden?.title || 'Loading...'}
          </div>

          {/* Garden Stats */}
          {activeGarden && (
            <div className="garden-stats" style={headerStatsStyle}>
              <div style={statItemStyle}>
                <LocalFlorist sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                <span>{activeFlowers.length} flowers</span>
              </div>
              {!isGuestMode && (
                <div style={statItemStyle}>
                  <People sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                  <span>{activeGarden.members?.length || 0} members</span>
                </div>
              )}
              {!isCompact && (
                <div style={statItemStyle}>
                  <CalendarToday sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                  <span>{formatDate(activeGarden.createdAt)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons — hidden in guest mode, non-members, and VIEWERs */}
        {!isGuestMode && currentGarden && (() => {
          const userRole = currentGarden.members?.find(m => m.userId === user?.id)?.role
            ?? (currentGarden.ownerId === user?.id ? 'OWNER' : null);
          if (!userRole || userRole === 'VIEWER') return null;
          return (
            <div className="garden-header-actions" style={headerRightStyle}>
              {isCompact ? (
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
                    onClick={handlePlantClick}
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
                    onClick={handlePlantClick}
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
          );
        })()}
      </div>

      {/* Guest Banner */}
      {isGuestMode && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            zIndex: 99,
            background: 'linear-gradient(135deg, #FFF0F3 0%, #FFF5F7 100%)',
            borderBottom: '1px solid rgba(232, 164, 176, 0.4)',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '13px',
            color: '#9D6B77',
            fontWeight: 500,
          }}>
            🌸 {guestDisplayName ? `Welcome, ${guestDisplayName}!` : 'You\'re viewing as a guest'} — Read-only view
          </span>
          <a
            href="/auth/register"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#D4909A',
              textDecoration: 'none',
              padding: '5px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(212,144,154,0.5)',
              background: '#FFFFFF',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s',
            }}
          >
            Sign up for full access →
          </a>
        </div>
      )}

      {/* 3D Garden Scene */}
      <div style={canvasContainerStyle}>
        <Canvas
          shadows
          camera={{ position: [0, 25, 35], fov: 50 }}
          gl={{
            // Force consistent output across all browsers / mobile WebGL
            outputColorSpace: 'srgb',
            toneMapping: 4,           // THREE.ACESFilmicToneMapping = 4
            toneMappingExposure: 1.2, // Slightly boosted — matches what desktop Chrome was showing
            antialias: true,
          }}
        >
          <GardenScene 
            config={GARDEN_CONFIGS.test_garden}
            flowers={activeFlowers}
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
              // Preserve ?token= for guests so the URL stays valid
              const params = guestToken ? `?token=${guestToken}` : '';
              navigate(`/garden/${gardenId}/flower/${flower.id}${params}`, { replace: false });
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
        userRole={currentGarden?.members?.find(m => m.userId === user?.id)?.role ?? (currentGarden?.ownerId === user?.id ? 'OWNER' : 'VIEWER')}
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
        onPlantingStateChange={setIsPlanting}
        onLetterPreview={(params) => setLetterPreviewParams(params)}
      />

      {/* Letter Preview Modal — rendered at the top level so it sits above the side panel */}
      {letterPreviewParams && (
        <LetterPreviewModal
          isOpen={true}
          templateKey={letterPreviewParams.templateKey}
          flowerDefinition={letterPreviewParams.flowerDefinition}
          recipientName={letterPreviewParams.recipientName}
          message={letterPreviewParams.message}
          senderName={letterPreviewParams.senderName}
          imagePreviewUrl={letterPreviewParams.imagePreviewUrl}
          voicePreviewUrl={letterPreviewParams.voicePreviewUrl}
          videoPreviewUrl={letterPreviewParams.videoPreviewUrl}
          onBack={() => { letterPreviewParams.onBack(); setLetterPreviewParams(null); }}
          onConfirm={() => { letterPreviewParams.onConfirm(); setLetterPreviewParams(null); }}
        />
      )}

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

      {/* Inline success banner — flower planted / deleted / garden updated */}
      {(flowerSuccess || gardenSuccess) && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9990,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1px solid rgba(132, 196, 148, 0.5)',
            boxShadow: '0 4px 20px rgba(100, 180, 120, 0.18), 0 2px 8px rgba(0,0,0,0.06)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <CheckCircleOutlined sx={{ fontSize: 18, color: '#4CAF50' }} />
          <span style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            color: '#2E7D32',
          }}>
            {flowerSuccess || gardenSuccess}
          </span>
        </div>
      )}

      {/* Planting overlay — shown while uploads + addContent finish in the background */}
      {isPlanting && (
        <>
          <style>{`
            @keyframes plant-spin {
              to { transform: rotate(360deg); }
            }
            @keyframes plant-fadein {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
          `}</style>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9997,
              background: 'rgba(253, 252, 250, 0.82)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              animation: 'plant-fadein 0.25s ease',
              pointerEvents: 'all',
            }}
          >
            {/* Spinner ring */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '4px solid rgba(212,144,154,0.2)',
                borderTopColor: '#D4909A',
                animation: 'plant-spin 0.9s linear infinite',
              }}
            />
            {/* Label */}
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '15px',
                color: '#9D8F99',
                letterSpacing: '0.06em',
              }}
            >
              Planting your memory…
            </div>
          </div>
        </>
      )}

      {/* Garden flower loading screen — shown on first load until flowers arrive */}
      <GardenLoadingScreen visible={showFlowerLoading} />

      {/* Email deep-link: cinematic reveal overlay.
          The FlowerDetailsModal is already mounted in the background (selectedFlower is set
          during the animation). When onDone fires we simply hide the overlay — the modal
          appears immediately with no fetch delay. */}
      {showRevealOverlay && (
        <LetterRevealOverlay
          onDone={() => {
            setShowRevealOverlay(false);
            // Fire confetti AFTER the overlay lifts so it plays over the visible letter
            setShowConfetti(true);
          }}
        />
      )}

      {/* Flower Details Modal - Beautiful Letter Style */}
      <FlowerDetailsModal
        isOpen={!!selectedFlower}
        onClose={() => {
          setSelectedFlower(null);
          setShowConfetti(false);
          // Return URL to garden level — preserve ?token= for guests so GardenRoute
          // doesn't redirect them to login when the modal closes.
          const params = guestToken ? `?token=${guestToken}` : '';
          navigate(`/garden/${gardenId}${params}`, { replace: true });
        }}
        flower={selectedFlower}
        definition={selectedFlower ? FLOWER_DEFINITIONS[selectedFlower.flowerDefinition?.key?.toLowerCase() || 'daisy'] : null}
        fromEmail={showConfetti}
        currentUserId={user?.id}
        gardenOwnerId={activeGarden?.ownerId}
        onDelete={async (fid) => {
          await deleteFlower(fid);
          setSelectedFlower(null);
          setShowConfetti(false);
          const params = guestToken ? `?token=${guestToken}` : '';
          navigate(`/garden/${gardenId}${params}`, { replace: true });
        }}
      />

      {/* Garden Settings Modal — only for authenticated owners */}
      {!isGuestMode && currentGarden && user && (
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
