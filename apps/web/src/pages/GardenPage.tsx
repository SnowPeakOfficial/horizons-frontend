/**
 * Garden Page
 * 3D garden view with our existing GardenScene
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '../components/common';
import { GardenScene } from '../gardens/GardenScene';
import { GARDEN_CONFIGS } from '../gardens/gardenConfigs';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';

export const GardenPage: React.FC = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    position: 'relative',
    background: theme.bg.primary,
  };

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    background: 'linear-gradient(to bottom, rgba(250, 250, 247, 0.95), transparent)',
    backdropFilter: 'blur(8px)',
  };

  const titleStyle: React.CSSProperties = {
    ...typography.styles.h4,
    color: theme.text.primary,
  };

  const buttonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
  };

  const canvasContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      {/* Header Overlay */}
      <div style={headerStyle}>
        <div style={titleStyle}>
          {gardenId ? `Garden ${gardenId}` : 'Your Garden'}
        </div>
        <div style={buttonsStyle}>
          <Button variant="secondary" size="small">
            Plant Flower
          </Button>
          <Button variant="ghost" size="small" onClick={() => navigate('/my-gardens')}>
            Back to My Gardens
          </Button>
        </div>
      </div>

      {/* 3D Garden Scene */}
      <div style={canvasContainerStyle}>
        <Canvas
          shadows
          camera={{ position: [0, 25, 35], fov: 50 }}
        >
          <GardenScene config={GARDEN_CONFIGS.test_garden} />
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
    </div>
  );
};
