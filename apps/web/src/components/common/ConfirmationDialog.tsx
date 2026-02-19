/**
 * ConfirmationDialog - Reusable confirmation modal
 * Beautiful, simple design for confirming destructive actions
 */

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
import WarningAmber from '@mui/icons-material/WarningAmber';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import HelpOutline from '@mui/icons-material/HelpOutline';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <ErrorOutline sx={{ fontSize: 48, color: '#DC143C' }} />;
      case 'warning':
        return <WarningAmber sx={{ fontSize: 48, color: '#FF6B6B' }} />;
      case 'info':
        return <HelpOutline sx={{ fontSize: 48, color: theme.colors.rose[500] }} />;
    }
  };

  const getConfirmButtonVariant = () => {
    return variant === 'danger' ? 'danger' : 'primary';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px">
      <div style={containerStyle}>
        {/* Icon */}
        <div style={iconContainerStyle}>
          {getIcon()}
        </div>

        {/* Title */}
        <h2 style={titleStyle}>{title}</h2>

        {/* Message */}
        <p style={messageStyle}>{message}</p>

        {/* Actions */}
        <div style={actionsStyle}>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  padding: theme.spacing.xl,
  textAlign: 'center',
};

const iconContainerStyle: React.CSSProperties = {
  marginBottom: theme.spacing.lg,
  display: 'flex',
  justifyContent: 'center',
  animation: 'gentlePulse 2s ease-in-out infinite',
};

const titleStyle: React.CSSProperties = {
  ...typography.styles.h4,
  color: theme.text.primary,
  marginBottom: theme.spacing.md,
  fontWeight: 600,
};

const messageStyle: React.CSSProperties = {
  ...typography.styles.body,
  color: theme.text.secondary,
  lineHeight: 1.6,
  marginBottom: theme.spacing.xl,
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: theme.spacing.md,
  marginTop: theme.spacing.xl,
};
