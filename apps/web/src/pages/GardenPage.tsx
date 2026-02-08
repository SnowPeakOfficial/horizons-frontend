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
import { GardenScene } from '../gardens/GardenScene';
import { GARDEN_CONFIGS } from '../gardens/gardenConfigs';
import { useGardenStore } from '../stores/gardenStore';
import { useFlowerStore } from '../stores/flowerStore';
import { useAuthStore } from '../stores/authStore';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import People from '@mui/icons-material/People';
import CalendarToday from '@mui/icons-material/CalendarToday';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Landscape from '@mui/icons-material/Landscape';
import TrendingUp from '@mui/icons-material/TrendingUp';

export const GardenPage: React.FC = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentGarden, fetchGardenById } = useGardenStore();
  const { flowers, fetchFlowersByGarden } = useFlowerStore();
  const [isPlantPanelOpen, setIsPlantPanelOpen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [selectedFlowerForPlacement, setSelectedFlowerForPlacement] = useState<any>(null);
  const [placedPosition, setPlacedPosition] = useState<{ x: number; y: number; z: number } | null>(null);

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

  const infoPanelStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: '360px',
    background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E9 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    boxShadow: '0 12px 40px rgba(220, 20, 60, 0.15), 0 0 0 1px rgba(232, 180, 184, 0.4)',
    border: '1px solid rgba(255, 182, 193, 0.5)',
    zIndex: 10,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideInFromRight 0.5s ease-out',
  };

  const infoPanelHeaderStyle: React.CSSProperties = {
    ...typography.styles.h5,
    marginBottom: theme.spacing.lg,
    color: theme.colors.rose[700],
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: theme.radius.md,
    transition: 'all 0.2s ease',
  };

  const infoLabelStyle: React.CSSProperties = {
    color: theme.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    fontSize: '14px',
  };

  const infoValueStyle: React.CSSProperties = {
    color: theme.text.primary,
    fontWeight: 600,
    fontSize: '15px',
  };

  const quickActionsStyle: React.CSSProperties = {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.border.light}`,
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
                <span>{currentGarden._count?.members || 1} members</span>
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
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={80}
            maxPolarAngle={Math.PI / 2.1}
          />
        </Canvas>
      </div>

      {/* Floating Info Panel - Beautiful Redesign */}
      {showInfoPanel && currentGarden && (
        <div style={infoPanelStyle}>
          <div style={infoPanelHeaderStyle}>
            <Landscape sx={{ fontSize: 24, color: theme.colors.rose[500] }} />
            Garden Details
          </div>
          
          <div>
            <div 
              style={infoRowStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.9)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.7)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
              }}
            >
              <span style={infoLabelStyle}>
                <Landscape sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                Name
              </span>
              <span style={infoValueStyle}>{currentGarden.title}</span>
            </div>
            
            <div 
              style={infoRowStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.9)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.7)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
              }}
            >
              <span style={infoLabelStyle}>
                <LocalFlorist sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                Flowers
              </span>
              <span style={infoValueStyle}>{flowers.length}</span>
            </div>
            
            <div 
              style={infoRowStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.9)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.7)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
              }}
            >
              <span style={infoLabelStyle}>
                <People sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                Members
              </span>
              <span style={infoValueStyle}>{currentGarden._count?.members || 1}</span>
            </div>
            
            <div 
              style={infoRowStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.9)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.7)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
              }}
            >
              <span style={infoLabelStyle}>
                <TrendingUp sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                Theme
              </span>
              <span style={infoValueStyle}>
                {currentGarden.gardenDefinition?.displayName || 'Default'}
              </span>
            </div>
            
            <div 
              style={infoRowStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.9)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.7)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
              }}
            >
              <span style={infoLabelStyle}>
                <CalendarToday sx={{ fontSize: 16, color: theme.colors.rose[400] }} />
                Created
              </span>
              <span style={infoValueStyle}>{formatDate(currentGarden.createdAt)}</span>
            </div>
          </div>

          <div style={quickActionsStyle}>
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowInfoPanel(false)}
              style={{ width: '100%' }}
            >
              Hide Panel
            </Button>
          </div>
        </div>
      )}

      {/* Professional Toggle Icon (when hidden) */}
      {!showInfoPanel && (
        <button
          onClick={() => setShowInfoPanel(true)}
          style={{
            position: 'absolute',
            bottom: theme.spacing.xl,
            right: theme.spacing.xl,
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%)',
            border: `2px solid ${theme.colors.rose[300]}`,
            boxShadow: '0 8px 24px rgba(220, 20, 60, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.15) rotate(5deg)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(220, 20, 60, 0.3)';
            (e.currentTarget as HTMLElement).style.borderColor = theme.colors.rose[500];
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1) rotate(0deg)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(220, 20, 60, 0.2)';
            (e.currentTarget as HTMLElement).style.borderColor = theme.colors.rose[300];
          }}
        >
          <InfoOutlined sx={{ fontSize: 28, color: theme.colors.rose[500] }} />
        </button>
      )}

      {/* Plant Flower Panel */}
      <PlantFlowerPanel
        isOpen={isPlantPanelOpen}
        onClose={() => {
          setIsPlantPanelOpen(false);
          setIsPlacementMode(false);
          setSelectedFlowerForPlacement(null);
          setPlacedPosition(null);
        }}
        gardenId={gardenId || ''}
        userTier={user?.tier || 'FREE'}
        onPlantSuccess={handlePlantSuccess}
        onPlacementModeChange={(active, definition) => {
          setIsPlacementMode(active);
          setSelectedFlowerForPlacement(definition);
          if (!active) {
            setPlacedPosition(null);
          }
        }}
        placedPosition={placedPosition}
      />
    </div>
  );
};
