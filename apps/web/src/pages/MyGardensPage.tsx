/**
 * My Gardens Page
 * Clean, minimal design - main page for logged-in users
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';
import { Navbar } from '../components/layout/Navbar';
import { CreateGardenModal } from '../components/gardens/CreateGardenModal';
import { useAuthStore } from '../stores/authStore';
import { useGardenStore } from '../stores/gardenStore';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';
import type { Garden } from '../types/api.types';

export const MyGardensPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { gardens, isLoading, fetchGardens, createGarden } = useGardenStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchGardens();
  }, [fetchGardens]);

  const handleCreateGarden = async (title: string, gardenDefinitionKey?: string) => {
    await createGarden({ title, gardenDefinitionKey });
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

  const getTotalFlowers = () => {
    return gardens.reduce((sum, garden) => sum + (garden._count?.flowers || 0), 0);
  };

  // Clean styles
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#FFFFFF',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: theme.maxWidth.containerWide,
    margin: '0 auto',
    padding: `${theme.spacing['2xl']} ${theme.spacing.xl}`,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottom: `1px solid ${theme.border.light}`,
  };

  const titleStyle: React.CSSProperties = {
    ...typography.styles.h2,
    color: theme.text.primary,
    fontWeight: 600,
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing['2xl'],
  };

  const statCardStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    border: `1px solid ${theme.border.light}`,
    borderRadius: theme.radius.lg,
    background: '#FFFFFF',
  };

  const statValueStyle: React.CSSProperties = {
    ...typography.styles.h3,
    color: theme.text.primary,
    marginBottom: theme.spacing.xs,
  };

  const statLabelStyle: React.CSSProperties = {
    ...typography.styles.body,
    color: theme.text.secondary,
    fontSize: '0.875rem',
  };

  const gardensGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing.lg,
  };

  const gardenCardStyle: React.CSSProperties = {
    border: `1px solid ${theme.border.light}`,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#FFFFFF',
  };

  const gardenHeaderStyle: React.CSSProperties = {
    height: '120px',
    background: theme.colors.rose[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const gardenContentStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
  };

  const gardenTitleStyle: React.CSSProperties = {
    ...typography.styles.h4,
    color: theme.text.primary,
    marginBottom: theme.spacing.xs,
  };

  const gardenMetaStyle: React.CSSProperties = {
    ...typography.styles.caption,
    color: theme.text.tertiary,
    marginBottom: theme.spacing.md,
  };

  const gardenStatsStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
  };

  const gardenStatStyle: React.CSSProperties = {
    ...typography.styles.body,
    color: theme.text.secondary,
    fontSize: '0.875rem',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: `${theme.spacing['4xl']} ${theme.spacing.xl}`,
    border: `1px dashed ${theme.border.light}`,
    borderRadius: theme.radius.lg,
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
      <Navbar />

      <main style={contentStyle}>
        {/* Page Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>My Gardens</h1>
          {canCreateMore() && (
            <Button 
              variant="primary" 
              size="medium"
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Garden
            </Button>
          )}
        </div>

        {/* Stats */}
        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{gardens.length}</div>
            <div style={statLabelStyle}>Active Gardens</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{getTotalFlowers()}</div>
            <div style={statLabelStyle}>Total Flowers</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{user?.tier || 'FREE'}</div>
            <div style={statLabelStyle}>Current Plan</div>
          </div>
        </div>

        {/* Gardens Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: theme.spacing['4xl'], color: theme.text.secondary }}>
            Loading gardens...
          </div>
        ) : gardens.length === 0 ? (
          <div style={emptyStateStyle}>
            <h3 style={{ ...typography.styles.h3, marginBottom: theme.spacing.md, color: theme.text.primary }}>
              No gardens yet
            </h3>
            <p style={{ ...typography.styles.body, color: theme.text.secondary, marginBottom: theme.spacing.lg }}>
              Create your first garden to start preserving memories
            </p>
            <Button 
              variant="primary" 
              size="medium"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Garden
            </Button>
          </div>
        ) : (
          <div style={gardensGridStyle}>
            {gardens.map((garden) => (
              <div
                key={garden.id}
                style={gardenCardStyle}
                onClick={() => handleOpenGarden(garden)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = theme.colors.rose[300];
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = theme.border.light;
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={gardenHeaderStyle}></div>
                <div style={gardenContentStyle}>
                  <h3 style={gardenTitleStyle}>{garden.title}</h3>
                  <div style={gardenMetaStyle}>{formatDate(garden.createdAt)}</div>
                  <div style={gardenStatsStyle}>
                    <span style={gardenStatStyle}>{garden._count?.flowers || 0} flowers</span>
                    <span style={gardenStatStyle}>{garden._count?.members || 1} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upgrade CTA (if at limit) */}
        {!canCreateMore() && user?.tier !== 'PREMIUM' && (
          <div style={{
            marginTop: theme.spacing.xl,
            padding: theme.spacing.lg,
            border: `1px solid ${theme.colors.rose[200]}`,
            borderRadius: theme.radius.lg,
            background: theme.colors.rose[50],
            textAlign: 'center',
          }}>
            <h3 style={{ ...typography.styles.h4, marginBottom: theme.spacing.sm, color: theme.text.primary }}>
              Ready to create more gardens?
            </h3>
            <p style={{ ...typography.styles.body, marginBottom: theme.spacing.md, color: theme.text.secondary }}>
              Upgrade to {user?.tier === 'FREE' ? 'PRO' : 'PREMIUM'} for more gardens and features
            </p>
            <Button 
              variant="primary" 
              size="medium"
              onClick={() => navigate('/pricing')}
            >
              View Plans
            </Button>
          </div>
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
