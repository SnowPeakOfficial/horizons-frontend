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
    };

    const labelStyle: React.CSSProperties = {
      ...typography.styles.label,
      color: theme.text.primary,
    };

    const inputStyle: React.CSSProperties = {
      ...typography.styles.body,
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      border: `2px solid ${error ? theme.semantic.error : isFocused ? theme.colors.rose[500] : theme.border.medium}`,
      borderRadius: theme.radius.lg,
      background: theme.bg.elevated,
      color: theme.text.primary,
      transition: theme.transition.base,
      outline: 'none',
      width: '100%',
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
