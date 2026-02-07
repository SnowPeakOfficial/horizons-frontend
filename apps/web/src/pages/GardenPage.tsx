/**
 * Garden Page - Completely Redesigned
 * Beautiful 3D garden view with professional UI
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '../components/common';
import { PlantFlowerModal } from '../components/gardens/PlantFlowerModal';
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

export const GardenPage: React.FC = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentGarden, fetchGardenById } = useGardenStore();
  const { flowers, fetchFlowersByGarden } = useFlowerStore();
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

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
    width: '320px',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(232, 180, 184, 0.3)',
    zIndex: 10,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const infoPanelHeaderStyle: React.CSSProperties = {
    ...typography.styles.h5,
    marginBottom: theme.spacing.md,
    color: theme.text.primary,
    fontWeight: 600,
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    ...typography.styles.body,
    fontSize: '14px',
  };

  const infoLabelStyle: React.CSSProperties = {
    color: theme.text.secondary,
  };

  const infoValueStyle: React.CSSProperties = {
    color: theme.text.primary,
    fontWeight: 500,
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
            onClick={() => setIsPlantModalOpen(true)}
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

      {/* Floating Info Panel */}
      {showInfoPanel && currentGarden && (
        <div style={infoPanelStyle}>
          <div style={infoPanelHeaderStyle}>Garden Info</div>
          
          <div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Name</span>
              <span style={infoValueStyle}>{currentGarden.title}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Flowers</span>
              <span style={infoValueStyle}>{flowers.length}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Members</span>
              <span style={infoValueStyle}>{currentGarden._count?.members || 1}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Theme</span>
              <span style={infoValueStyle}>
                {currentGarden.gardenDefinition?.displayName || 'Default'}
              </span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Created</span>
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

      {/* Show Panel Toggle (when hidden) */}
      {!showInfoPanel && (
        <button
          onClick={() => setShowInfoPanel(true)}
          style={{
            position: 'absolute',
            bottom: theme.spacing.xl,
            right: theme.spacing.xl,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.98)',
            border: `1px solid rgba(232, 180, 184, 0.3)`,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.16)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
          }}
        >
          <span style={{ fontSize: '20px' }}>ℹ️</span>
        </button>
      )}

      {/* Plant Flower Modal */}
      <PlantFlowerModal
        isOpen={isPlantModalOpen}
        onClose={() => setIsPlantModalOpen(false)}
        gardenId={gardenId || ''}
        userTier={user?.tier || 'FREE'}
        onPlantSuccess={handlePlantSuccess}
      />
    </div>
  );
};
