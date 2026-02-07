/**
 * Button Component
 * Premium, elegant button with gradient variants
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled,
  children,
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const isDisabled = disabled || isLoading;

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    border: 'none',
    borderRadius: theme.radius.full,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: theme.transition.smooth,
    opacity: isDisabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: '0.01em',
  };

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    small: {
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      fontSize: typography.fontSize.bodySmall,
      height: '36px',
    },
    medium: {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: typography.fontSize.body,
      height: '48px',
    },
    large: {
      padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`,
      fontSize: typography.fontSize.bodyLarge,
      height: '56px',
    },
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${theme.colors.rose[500]} 0%, ${theme.colors.rose[600]} 100%)`,
      color: theme.text.inverse,
      boxShadow: theme.shadow.sm,
    },
    secondary: {
      background: theme.bg.elevated,
      color: theme.text.primary,
      border: `2px solid ${theme.border.medium}`,
    },
    ghost: {
      background: 'transparent',
      color: theme.text.primary,
    },
    danger: {
      background: theme.semantic.error,
      color: theme.text.inverse,
      boxShadow: theme.shadow.sm,
    },
  };

  const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${theme.colors.rose[600]} 0%, ${theme.colors.rose[700]} 100%)`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transform: 'translateY(-1px)',
    },
    secondary: {
      background: theme.bg.blush,
      borderColor: theme.border.dark,
      transform: 'translateY(-1px)',
    },
    ghost: {
      background: theme.bg.blush,
    },
    danger: {
      background: theme.colors.rose[700],
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transform: 'translateY(-1px)',
    },
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...(isHovered && !isDisabled ? hoverStyles[variant] : {}),
        ...style,
      }}
      disabled={isDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {isLoading && (
        <div 
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
};
