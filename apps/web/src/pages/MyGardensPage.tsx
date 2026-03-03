/**
 * My Gardens Page
 * Clean, minimal design - main page for logged-in users
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
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

  const handleCreateGarden = async (title: string) => {
    await createGarden({ title });
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

  // Premium styles with gradient background
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #FFF9F5 0%, #FFE8E8 50%, #FFF0F5 100%)',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: theme.maxWidth.containerWide,
    margin: '0 auto',
    padding: `${theme.spacing['2xl']} ${theme.spacing.xl}`,
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
    paddingTop: theme.spacing.lg,
  };

  const titleStyle: React.CSSProperties = {
    ...typography.styles.h1,
    color: theme.text.primary,
    fontWeight: 700,
    marginBottom: theme.spacing.xs,
    background: 'linear-gradient(135deg, #D4909A 0%, #E8A4A4 50%, #C48991 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const subtitleStyle: React.CSSProperties = {
    ...typography.styles.body,
    color: theme.text.secondary,
    fontSize: '1.125rem',
    marginBottom: theme.spacing.xl,
  };

  const headerActionsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing['2xl'],
  };

  const statCardStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    border: `1px solid rgba(255, 255, 255, 0.6)`,
    borderRadius: theme.radius.xl,
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(212, 144, 154, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  };

  const statValueStyle: React.CSSProperties = {
    ...typography.styles.h2,
    color: theme.colors.rose[600],
    marginBottom: theme.spacing.sm,
    fontWeight: 700,
  };

  const statLabelStyle: React.CSSProperties = {
    ...typography.styles.body,
    color: theme.text.secondary,
    fontSize: '0.9375rem',
    fontWeight: 500,
  };

  const gardensGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing.lg,
  };

  const gardenCardStyle: React.CSSProperties = {
    border: `1px solid rgba(255, 255, 255, 0.8)`,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  };

  const gardenHeaderStyle: React.CSSProperties = {
    height: '140px',
    background: 'linear-gradient(135deg, #FFE5EC 0%, #FFC9D9 50%, #FFB3C7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    position: 'relative',
    overflow: 'hidden',
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
          <h1 style={titleStyle}>Your Memory Gardens</h1>
          <p style={subtitleStyle}>Preserved moments, blooming forever</p>
          {canCreateMore() && (
            <div style={headerActionsStyle}>
              <Button 
                variant="primary" 
                size="medium"
                onClick={() => setIsCreateModalOpen(true)}
              >
                🌸 Plant a New Garden
              </Button>
            </div>
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
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px) scale(1.02)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(212, 144, 154, 0.25), 0 8px 16px rgba(0, 0, 0, 0.1)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <div style={gardenHeaderStyle}>🌸</div>
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
            marginTop: theme.spacing['4xl'],
            marginBottom: theme.spacing['4xl'],
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

      <Footer />

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
