/**
 * Navbar Component - Clean Design
 * Supports both guest and authenticated states
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../common';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import Person from '@mui/icons-material/Person';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import CreditCard from '@mui/icons-material/CreditCard';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
    background: '#FFFFFF',
    borderBottom: `1px solid ${theme.border.light}`,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
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
    fontWeight: 600,
    color: theme.colors.rose[700],
    cursor: 'pointer',
    textDecoration: 'none',
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
    borderRadius: theme.radius.md,
    ...typography.styles.caption,
    fontWeight: 600,
    background: theme.colors.rose[100],
    color: theme.colors.rose[700],
    border: `1px solid ${theme.colors.rose[200]}`,
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
        <div style={logoStyle} onClick={() => navigate('/my-gardens')}>
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
                  {user?.tier !== 'FREE' && (
                    <div
                      style={dropdownItemStyle}
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/billing');
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = theme.colors.rose[50];
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }}
                    >
                      <CreditCard sx={{ fontSize: 18 }} />
                      Billing
                    </div>
                  )}
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

      {/* Click outside to close menu */}
      {isUserMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};
