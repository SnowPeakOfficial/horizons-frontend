/**
 * Dashboard Page
 * User's gardens overview
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/common';
import { CreateGardenModal } from '../components/gardens/CreateGardenModal';
import { useAuthStore } from '../stores/authStore';
import { useGardenStore } from '../stores/gardenStore';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';
import type { Garden } from '../types/api.types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { gardens, isLoading, fetchGardens, createGarden } = useGardenStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchGardens();
  }, [fetchGardens]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateGarden = async (title: string, gardenDefinitionId?: string) => {
    await createGarden({ title, gardenDefinitionId });
    setIsCreateModalOpen(false);
  };

  const handleOpenGarden = (garden: Garden) => {
    navigate(`/garden/${garden.id}`);
  };

  const canCreateMore = () => {
    if (!user) return false;
    if (user.tier === 'FREE') return gardens.length < 1;
    if (user.tier === 'PRO') return gardens.length < 10;
    return true; // PREMIUM unlimited
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
    cursor: 'pointer',
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

  const gardensGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing['2xl'],
  };

  const gardenCardStyle: React.CSSProperties = {
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    position: 'relative',
  };

  const gardenCardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: `${theme.spacing['4xl']} ${theme.spacing.xl}`,
  };

  const tierBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    background: theme.colors.rose[50],
    borderRadius: theme.radius.full,
    ...typography.styles.caption,
    fontWeight: 600,
    color: theme.colors.rose[700],
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={logoStyle} onClick={() => navigate('/')}>Horizons</div>
        <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
          <span style={typography.styles.body}>Welcome, {user?.name}</span>
          <div style={tierBadgeStyle}>
            {user?.tier === 'FREE' && '🌱'}
            {user?.tier === 'PRO' && '🌸'}
            {user?.tier === 'PREMIUM' && '🌺'}
            {user?.tier}
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing['2xl'] }}>
          <div>
            <h1 style={titleStyle}>Your Gardens</h1>
            <p style={subtitleStyle}>
              {gardens.length === 0 
                ? 'Create beautiful memory gardens and plant flowers to commemorate special moments.'
                : `You have ${gardens.length} garden${gardens.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          {canCreateMore() && (
            <Button 
              variant="primary" 
              size="large"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Create Garden
            </Button>
          )}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: theme.spacing['4xl'] }}>
            <div style={typography.styles.h3}>Loading your gardens...</div>
          </div>
        ) : gardens.length === 0 ? (
          /* Empty State */
          <Card>
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '64px', marginBottom: theme.spacing.lg }}>🌱</div>
              <h2 style={{ ...typography.styles.h3, marginBottom: theme.spacing.md }}>
                Start Your First Garden
              </h2>
              <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.xl, maxWidth: '500px', margin: '0 auto' }}>
                You haven't created any gardens yet. Begin your journey by planting your first memory.
              </p>
              <Button 
                variant="primary" 
                size="large"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Garden
              </Button>
            </div>
          </Card>
        ) : (
          /* Gardens Grid */
          <div style={gardensGridStyle}>
            {gardens.map((garden) => (
              <div
                key={garden.id}
                style={gardenCardStyle}
                onClick={() => handleOpenGarden(garden)}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  Object.assign(e.currentTarget.style, gardenCardHoverStyle);
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <Card>
                <div style={{ marginBottom: theme.spacing.md }}>
                  <h3 style={{ ...typography.styles.h4, marginBottom: theme.spacing.xs }}>
                    {garden.title}
                  </h3>
                  <div style={{ ...typography.styles.caption, color: theme.text.tertiary }}>
                    Created {formatDate(garden.createdAt)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: theme.spacing.lg, ...typography.styles.body }}>
                  <div>
                    <span style={{ color: theme.text.secondary }}>Flowers: </span>
                    <span style={{ fontWeight: 600 }}>{garden._count?.flowers || 0}</span>
                  </div>
                  <div>
                    <span style={{ color: theme.text.secondary }}>Members: </span>
                    <span style={{ fontWeight: 600 }}>{garden._count?.members || 1}</span>
                  </div>
                </div>

                {garden.gardenDefinition && (
                  <div style={{ 
                    marginTop: theme.spacing.md, 
                    paddingTop: theme.spacing.md, 
                    borderTop: `1px solid ${theme.border.light}`,
                    ...typography.styles.caption,
                    color: theme.text.secondary,
                  }}>
                    Theme: {garden.gardenDefinition.displayName}
                  </div>
                )}
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Tier Limit Warning */}
        {!canCreateMore() && (
          <Card style={{ marginTop: theme.spacing.xl }}>
            <div style={{ textAlign: 'center', padding: theme.spacing.lg }}>
              <div style={typography.styles.body}>
                {user?.tier === 'FREE' ? (
                  <>
                    🌸 <strong>You've reached your garden limit.</strong> Upgrade to PRO to create up to 10 gardens!
                  </>
                ) : (
                  <>
                    🌺 <strong>You've reached your garden limit.</strong> Upgrade to PREMIUM for unlimited gardens!
                  </>
                )}
              </div>
              <Button 
                variant="primary" 
                style={{ marginTop: theme.spacing.md }}
                onClick={() => navigate('/upgrade')}
              >
                Upgrade Now
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Create Garden Modal */}
      <CreateGardenModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGarden={handleCreateGarden}
        userTier={user?.tier || 'FREE'}
      />
    </div>
  );
};
