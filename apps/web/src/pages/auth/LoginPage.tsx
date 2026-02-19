/**
 * Login Page
 * Clean, professional authentication
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../../components/common';
import { Navbar } from '../../components/layout/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import type { ApiError } from '../../types/api.types';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

    try {
      console.log('🔐 Attempting login for:', formData.email);
      await login({ email: formData.email.trim(), password: formData.password });
      toast.success('Welcome back!');
      navigate('/my-gardens');
    } catch (error: unknown) {
      console.error('❌ Login error:', error);
      
      // Handle specific error cases
      const err = error as ApiError;
      if (err.statusCode === 401) {
        toast.error('Invalid email or password');
        setErrors({ password: 'Invalid credentials' });
      } else if (err.statusCode === 429) {
        toast.error('Too many login attempts. Please try again later.');
      } else if (err.statusCode === 0 || err.error === 'NETWORK_ERROR') {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error('Login failed. Please try again.');
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

  const logoStyle: React.CSSProperties = {
    ...typography.styles.h2,
    fontFamily: typography.fontFamily.serif,
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
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
        <div style={logoStyle}>Horizons</div>
        
        <Card>
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Sign in to your memory garden</p>

          <form onSubmit={handleSubmit} style={formStyle}>
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
