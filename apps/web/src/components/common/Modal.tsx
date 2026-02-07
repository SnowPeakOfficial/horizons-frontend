/**
 * Modal Component
 * Elegant overlay modal with backdrop
 */

import React, { useEffect } from 'react';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '600px',
  showCloseButton = true,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(47, 47, 47, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    zIndex: theme.zIndex.modal,
    animation: 'fadeIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const modalStyle: React.CSSProperties = {
    background: theme.bg.elevated,
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadow.xl,
    maxWidth,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    animation: 'gentleScale 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const headerStyle: React.CSSProperties = {
    padding: `${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.lg}`,
    borderBottom: `1px solid ${theme.border.light}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle: React.CSSProperties = {
    ...typography.styles.h3,
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: theme.text.secondary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    transition: theme.transition.base,
    lineHeight: 1,
  };

  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div style={headerStyle}>
            {title && <h2 style={titleStyle}>{title}</h2>}
            {showCloseButton && (
              <button
                style={closeButtonStyle}
                onClick={onClose}
                aria-label="Close modal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.bg.secondary;
                  e.currentTarget.style.color = theme.text.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = theme.text.secondary;
                }}
              >
                ×
              </button>
            )}
          </div>
        )}
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
};
