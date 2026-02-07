/**
 * Dashboard Page
 * User's gardens overview
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/common';
import { useAuthStore } from '../stores/authStore';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: theme.bg.primary,
  };

  const headerStyle: React.CSSProperties = {
    padding: `${theme.spacing.xl} ${theme.spacing['2xl']}`,
    borderBottom: `1px solid ${theme.border.light}`,
    background: theme.bg.elevated,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle: React.CSSProperties = {
    ...typography.styles.h3,
    fontFamily: typography.fontFamily.serif,
    color: theme.text.primary,
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: theme.maxWidth.container,
    margin: '0 auto',
    padding: theme.spacing['2xl'],
  };

  const titleStyle: React.CSSProperties = {
    ...typography.styles.h1,
    marginBottom: theme.spacing.md,
  };

  const subtitleStyle: React.CSSProperties = {
    ...typography.styles.bodyLarge,
    color: theme.text.secondary,
    marginBottom: theme.spacing['3xl'],
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: `${theme.spacing['4xl']} ${theme.spacing.xl}`,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={logoStyle}>Horizons</div>
        <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
          <span style={typography.styles.body}>Welcome, {user?.name}</span>
          <Button variant="ghost" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={contentStyle}>
        <h1 style={titleStyle}>Your Gardens</h1>
        <p style={subtitleStyle}>
          Create beautiful memory gardens and plant flowers to commemorate special moments.
        </p>

        {/* Empty State */}
        <Card>
          <div style={emptyStateStyle}>
            <div style={{ fontSize: '64px', marginBottom: theme.spacing.lg }}>🌱</div>
            <h2 style={{ ...typography.styles.h3, marginBottom: theme.spacing.md }}>
              Start Your First Garden
            </h2>
            <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.xl }}>
              You haven't created any gardens yet. Begin your journey by planting your first memory.
            </p>
            <Button variant="primary" size="large">
              Create Garden
            </Button>
          </div>
        </Card>

        {/* Tier Info */}
        <div style={{ marginTop: theme.spacing['2xl'], textAlign: 'center' }}>
          <Card style={{ display: 'inline-block', padding: theme.spacing.lg }}>
            <div style={typography.styles.captionBold}>Current Plan: {user?.tier}</div>
            {user?.tier === 'FREE' && (
              <div style={{ ...typography.styles.caption, color: theme.text.secondary, marginTop: theme.spacing.xs }}>
                Upgrade to PRO for unlimited gardens
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};
