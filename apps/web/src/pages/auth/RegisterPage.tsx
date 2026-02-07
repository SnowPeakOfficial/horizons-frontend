/**
 * Register Page
 * Beautiful sign-up experience
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../../components/common';
import { useAuthStore } from '../../stores/authStore';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import type { ApiError } from '../../types/api.types';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: typeof errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase and lowercase letters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Auto-detect timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      console.log('📝 Attempting registration for:', formData.email);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        timezone,
      });
      toast.success('Welcome to Horizons! 🌸');
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('❌ Registration error:', error);
      
      // Handle specific error cases
      const err = error as ApiError;
      if (err.statusCode === 409) {
        toast.error('An account with this email already exists');
        setErrors({ email: 'Email already in use' });
      } else if (err.statusCode === 400) {
        toast.error('Invalid registration data. Please check your inputs.');
      } else if (err.statusCode === 0 || err.error === 'NETWORK_ERROR') {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error('Registration failed. Please try again.');
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
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={logoStyle}>Horizons</div>
        
        <Card>
          <h1 style={titleStyle}>Begin Your Journey</h1>
          <p style={subtitleStyle}>Create your memory garden</p>

          <form onSubmit={handleSubmit} style={formStyle}>
            <Input
              label="Name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              fullWidth
              autoComplete="name"
            />

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
              placeholder="At least 6 characters, mixed case"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              fullWidth
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              fullWidth
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              isLoading={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div style={linkStyle}>
            Already have an account?{' '}
            <Link to="/auth/login" style={{ fontWeight: 600, textDecoration: 'underline' }}>
              Sign in
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
  );
};
