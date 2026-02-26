/**
 * Navbar Component - Clean Design
 * Supports both guest and authenticated states
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../common';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import subscriptionService from '../../services/subscriptionService';
import Person from '@mui/icons-material/Person';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import BugReport from '@mui/icons-material/BugReport';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, loadUser } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);
  const [devLoading, setDevLoading] = useState<string | null>(null);

  // Refresh user tier from API on mount so badge is always current
  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
    }
  }, [isAuthenticated, loadUser]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navbarStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: `1px solid rgba(232, 180, 184, 0.2)`,
    boxShadow: '0 2px 12px rgba(212, 144, 154, 0.08)',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: theme.maxWidth.containerWide,
    margin: '0 auto',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle: React.CSSProperties = {
    ...typography.styles.h4,
    fontWeight: 700,
    fontFamily: 'Georgia, serif',
    background: 'linear-gradient(135deg, #D4909A 0%, #C48991 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center',
  };

  const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
    ...typography.styles.body,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? theme.colors.rose[700] : theme.text.secondary,
    textDecoration: 'none',
    cursor: 'pointer',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,
    transition: 'all 0.2s ease',
    background: isActive ? theme.colors.rose[50] : 'transparent',
  });

  const userSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const tierBadgeStyle: React.CSSProperties = {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.full,
    ...typography.styles.caption,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #FFE5EC 0%, #FFC9D9 100%)',
    color: theme.colors.rose[700],
    border: `1px solid rgba(255, 255, 255, 0.8)`,
    boxShadow: '0 2px 8px rgba(212, 144, 154, 0.15)',
  };

  const userMenuButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.md,
    background: 'transparent',
    border: `1px solid ${theme.border.light}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const avatarStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: theme.colors.rose[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.rose[700],
    fontWeight: 600,
    fontSize: '14px',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: '#FFFFFF',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xs,
    minWidth: '200px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.border.light}`,
    zIndex: 1001,
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...typography.styles.body,
    color: theme.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const handleDevChangeTier = async (tier: 'FREE' | 'PRO' | 'PREMIUM') => {
    setDevLoading(tier);
    try {
      await subscriptionService.changeTier(tier);
      await loadUser();
    } catch (e) {
      console.error('Dev tier change failed', e);
    } finally {
      setDevLoading(null);
      setIsDevMenuOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Guest Navbar (when not authenticated)
  if (!isAuthenticated) {
    return (
      <nav style={navbarStyle}>
        <div style={containerStyle}>
          {/* Logo */}
          <div style={logoStyle} onClick={() => navigate('/')}>
            <span style={{ fontSize: '1.2em' }}>🌸</span>
            Horizons
          </div>

          {/* Right Side - Auth Buttons */}
          <div style={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate('/auth/login')}
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate('/auth/register')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated Navbar
  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <div style={logoStyle} onClick={() => navigate('/')}>
          <span style={{ fontSize: '1.2em' }}>🌸</span>
          Horizons
        </div>

        {/* Right Side - Navigation Links + User Section */}
        <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
          {/* Navigation Links */}
          <div style={navLinksStyle}>
            <div
              style={navLinkStyle(location.pathname === '/my-gardens')}
              onClick={() => navigate('/my-gardens')}
              onMouseEnter={(e) => {
                if (location.pathname !== '/my-gardens') {
                  (e.currentTarget as HTMLElement).style.background = theme.colors.rose[50];
                  (e.currentTarget as HTMLElement).style.color = theme.colors.rose[700];
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/my-gardens') {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = theme.text.secondary;
                }
              }}
            >
              My Gardens
            </div>
            <div
              style={navLinkStyle(location.pathname === '/pricing')}
              onClick={() => navigate('/pricing')}
              onMouseEnter={(e) => {
                if (location.pathname !== '/pricing') {
                  (e.currentTarget as HTMLElement).style.background = theme.colors.rose[50];
                  (e.currentTarget as HTMLElement).style.color = theme.colors.rose[700];
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/pricing') {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = theme.text.secondary;
                }
              }}
            >
              Pricing
            </div>
          </div>

          {/* User Section */}
          <div style={userSectionStyle}>
            <div style={tierBadgeStyle}>
              {user?.tier || 'FREE'}
            </div>

            {/* DEV: Tier Switcher */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: theme.radius.md,
                  background: 'rgba(255, 200, 100, 0.15)',
                  border: '1px dashed rgba(200, 150, 50, 0.4)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#9B7B30',
                  letterSpacing: '0.05em',
                }}
                onClick={() => { setIsDevMenuOpen(!isDevMenuOpen); setIsUserMenuOpen(false); }}
              >
                <BugReport sx={{ fontSize: 14 }} />
                DEV
              </div>

              {isDevMenuOpen && (
                <div style={{ ...dropdownStyle, minWidth: '140px' }}>
                  <div style={{ padding: '6px 12px 4px', fontSize: '10px', fontWeight: 700, color: '#9B7B30', letterSpacing: '0.08em' }}>
                    SWITCH TIER
                  </div>
                  {(['FREE', 'PRO', 'PREMIUM'] as const).map((tier) => (
                    <div
                      key={tier}
                      style={{
                        ...dropdownItemStyle,
                        fontWeight: user?.tier === tier ? 700 : 400,
                        color: user?.tier === tier ? theme.colors.rose[700] : theme.text.primary,
                        background: user?.tier === tier ? theme.colors.rose[50] : 'transparent',
                        opacity: devLoading && devLoading !== tier ? 0.5 : 1,
                        cursor: devLoading ? 'default' : 'pointer',
                        fontSize: '13px',
                      }}
                      onClick={() => devLoading ? undefined : handleDevChangeTier(tier)}
                      onMouseEnter={(e) => {
                        if (!devLoading && user?.tier !== tier) {
                          (e.currentTarget as HTMLElement).style.background = theme.colors.rose[50];
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (user?.tier !== tier) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }
                      }}
                    >
                      {devLoading === tier ? '...' : tier}
                      {user?.tier === tier && ' ✓'}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={userMenuButtonStyle}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = theme.colors.rose[50];
                  (e.currentTarget as HTMLElement).style.borderColor = theme.colors.rose[200];
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.borderColor = theme.border.light;
                }}
              >
                <div style={avatarStyle}>
                  {user?.name ? getInitials(user.name) : 'U'}
                </div>
                <span style={{...typography.styles.body, fontWeight: 500, fontSize: '0.875rem'}}>
                  {user?.name || 'User'}
                </span>
              </div>

              {isUserMenuOpen && (
                <div style={dropdownStyle}>
                  <div
                    style={dropdownItemStyle}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/profile');
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = theme.colors.rose[50];
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <Person sx={{ fontSize: 18 }} />
                    Profile
                  </div>
                  <div
                    style={dropdownItemStyle}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/settings');
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = theme.colors.rose[50];
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <Settings sx={{ fontSize: 18 }} />
                    Settings
                  </div>
                  <div style={{ height: '1px', background: theme.border.light, margin: `${theme.spacing.xs} 0` }} />
                  <div
                    style={{...dropdownItemStyle, color: theme.text.tertiary}}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = theme.colors.rose[50];
                      (e.currentTarget as HTMLElement).style.color = theme.colors.rose[600];
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = theme.text.tertiary;
                    }}
                  >
                    <Logout sx={{ fontSize: 18 }} />
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(isUserMenuOpen || isDevMenuOpen) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => { setIsUserMenuOpen(false); setIsDevMenuOpen(false); }}
        />
      )}
    </nav>
  );
};
