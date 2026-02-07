/**
 * Stat Card Component
 * Displays a stat with icon and label
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  gradient?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  gradient = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
  trend,
}) => {
  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    border: '1px solid rgba(232, 180, 184, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: theme.radius.lg,
    background: gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: theme.spacing.md,
  };

  const valueStyle: React.CSSProperties = {
    ...typography.styles.h2,
    marginBottom: theme.spacing.xs,
    background: 'linear-gradient(135deg, #c96868 0%, #7d5a5a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const labelStyle: React.CSSProperties = {
    ...typography.styles.body,
    color: theme.text.secondary,
    marginBottom: theme.spacing.xs,
  };

  const trendStyle: React.CSSProperties = {
    ...typography.styles.caption,
    color: trend?.isPositive ? theme.colors.rose[600] : theme.text.tertiary,
    fontWeight: 600,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={iconContainerStyle}>{icon}</div>
      <div style={valueStyle}>{value}</div>
      <div style={labelStyle}>{label}</div>
      {trend && (
        <div style={trendStyle}>
          {trend.isPositive ? '↗' : '↘'} {trend.value}
        </div>
      )}
    </div>
  );
};
