/**
 * Login Page
 * Clean, professional authentication
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button, Input, Card } from '../../components/common';
import { Navbar } from '../../components/layout/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import type { ApiError } from '../../types/api.types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: typeof errors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setFormError('');

    try {
      console.log('🔐 Attempting login for:', formData.email);
      await login({ email: formData.email.trim(), password: formData.password });
      const redirectTo = searchParams.get('redirect');
      navigate(redirectTo ? decodeURIComponent(redirectTo) : '/my-gardens');
    } catch (error: unknown) {
      console.error('❌ Login error:', error);
      
      // Handle specific error cases inline (no toast)
      const err = error as ApiError;
      if (err.statusCode === 401) {
        setFormError('Incorrect email or password. Please double-check and try again.');
      } else if (err.statusCode === 429) {
        setFormError('Too many sign-in attempts. Please wait a few minutes before trying again.');
      } else if (err.statusCode === 0 || err.error === 'NETWORK_ERROR') {
        setFormError("Our servers are temporarily unavailable. Please try again in a moment.");
      } else if (err.statusCode && err.statusCode >= 500) {
        setFormError('Something went wrong on our end. Please try again in a moment.');
      } else if (err.message) {
        setFormError(err.message);
      } else {
        setFormError('Unable to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    background: `linear-gradient(to bottom, ${theme.bg.primary} 0%, ${theme.bg.secondary} 100%)`,
  };

  const formContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '420px',
  };

  const titleStyle: React.CSSProperties = {
    ...typography.styles.h3,
    color: theme.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  };

  const subtitleStyle: React.CSSProperties = {
    ...typography.styles.body,
    color: theme.text.secondary,
    marginBottom: theme.spacing['2xl'],
    textAlign: 'center',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
  };

  const linkStyle: React.CSSProperties = {
    ...typography.styles.body,
    color: theme.colors.rose[600],
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <div style={formContainerStyle}>
          <img
            src="/images/horizons-logo-wordmark.png"
            alt="Horizons"
            style={{ display: 'block', margin: '0 auto', marginBottom: theme.spacing.lg, height: '40px', width: 'auto' }}
          />
        
          <Card>
            <h1 style={titleStyle}>Welcome Back</h1>
            <p style={subtitleStyle}>Sign in to your memory garden</p>

            <form onSubmit={handleSubmit} style={formStyle} noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                fullWidth
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                fullWidth
                autoComplete="current-password"
              />

              {formError && (
                <p style={{ color: '#DC2626', fontSize: '14px', textAlign: 'center', margin: 0 }}>
                  {formError}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                isLoading={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div style={linkStyle}>
              Don't have an account?{' '}
              <Link to="/auth/register" style={{ fontWeight: 600, textDecoration: 'underline' }}>
                Create one
              </Link>
            </div>
          </Card>

          <div style={{ textAlign: 'center', marginTop: theme.spacing.xl }}>
            <Link to="/" style={{ ...typography.styles.caption, color: theme.text.tertiary }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
