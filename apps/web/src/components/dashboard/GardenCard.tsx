/**
 * Enhanced Garden Card Component
 * Beautiful garden card with gradients and animations
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import type { Garden } from '../../types/api.types';

interface GardenCardProps {
  garden: Garden;
  onClick: () => void;
}

export const GardenCard: React.FC<GardenCardProps> = ({ garden, onClick }) => {
  const getGardenGradient = () => {
    // Different gradients based on garden theme
    const gradients = [
      'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
      'linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 100%)',
      'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
    ];
    
    // Use garden ID to consistently pick a gradient
    const index = garden.id.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'white',
    border: '1px solid rgba(232, 180, 184, 0.2)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  };

  const gradientHeaderStyle: React.CSSProperties = {
    height: '120px',
    background: getGardenGradient(),
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
  };

  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
  };

  const titleStyle: React.CSSProperties = {
    ...typography.styles.h4,
    marginBottom: theme.spacing.xs,
    color: theme.text.primary,
  };

  const metaStyle: React.CSSProperties = {
    ...typography.styles.caption,
    color: theme.text.tertiary,
    marginBottom: theme.spacing.md,
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  };

  const statStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
  };

  const statLabelStyle: React.CSSProperties = {
    ...typography.styles.caption,
    color: theme.text.secondary,
  };

  const statValueStyle: React.CSSProperties = {
    ...typography.styles.h4,
    background: 'linear-gradient(135deg, #c96868 0%, #7d5a5a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const themeBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.radius.full,
    ...typography.styles.caption,
    fontWeight: 600,
    color: theme.colors.rose[700],
    border: '1px solid rgba(232, 180, 184, 0.3)',
  };

  const floatingElementsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.3,
    fontSize: '80px',
    pointerEvents: 'none',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getGardenEmoji = () => {
    const emojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '🪷'];
    const index = garden.id.charCodeAt(1) % emojis.length;
    return emojis[index];
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px) scale(1.02)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
      }}
    >
      {/* Gradient Header with Emoji */}
      <div style={gradientHeaderStyle}>
        <div style={floatingElementsStyle}>{getGardenEmoji()}</div>
        <div style={{ fontSize: '64px', zIndex: 1 }}>{getGardenEmoji()}</div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{garden.title}</h3>
        <div style={metaStyle}>Created {formatDate(garden.createdAt)}</div>

        {/* Stats */}
        <div style={statsContainerStyle}>
          <div style={statStyle}>
            <div style={statLabelStyle}>Flowers</div>
            <div style={statValueStyle}>{garden._count?.flowers || 0}</div>
          </div>
          <div style={statStyle}>
            <div style={statLabelStyle}>Members</div>
            <div style={statValueStyle}>{garden._count?.members || 1}</div>
          </div>
        </div>

        {/* Theme Badge */}
        {garden.gardenDefinition && (
          <div style={themeBadgeStyle}>
            🎨 {garden.gardenDefinition.displayName}
          </div>
        )}
      </div>
    </div>
  );
};
