/**
 * Input Component
 * Enterprise-grade text input with validation states
 */

import React from 'react';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
      width: fullWidth ? '100%' : 'auto',
      marginBottom: theme.spacing.lg,
    };

    const labelStyle: React.CSSProperties = {
      ...typography.styles.label,
      color: theme.text.primary,
    };

    const inputStyle: React.CSSProperties = {
      ...typography.styles.body,
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      border: `2px solid ${error ? theme.semantic.error : isFocused ? theme.colors.rose[600] : theme.border.medium}`,
      borderRadius: theme.radius.md, // Rounded corners (12px)
      background: theme.bg.elevated,
      color: theme.text.primary,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      width: '100%',
      fontSize: 'clamp(1rem, 1vw + 0.25rem, 1.125rem)', // Fluid typography (min 16px to prevent iOS Safari zoom)
      boxShadow: isFocused ? `0 0 0 3px rgba(232, 180, 184, 0.15)` : 'none',
    };

    const helperStyle: React.CSSProperties = {
      ...typography.styles.caption,
      color: error ? theme.semantic.error : theme.text.secondary,
    };

    return (
      <div style={containerStyle}>
        {label && <label style={labelStyle}>{label}</label>}
        <input
          ref={ref}
          style={{ ...inputStyle, ...style }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {(error || helperText) && (
          <span style={helperStyle}>{error || helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
