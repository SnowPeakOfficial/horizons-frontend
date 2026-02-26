/**
 * Create Garden Modal
 * Simple modal for creating a new garden - just needs a name
 */

import React, { useState } from 'react';
import { Modal, Button, Input } from '../common';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/typography';
interface CreateGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGarden: (title: string) => Promise<void>;
  userTier: string;
}

export const CreateGardenModal: React.FC<CreateGardenModalProps> = ({
  isOpen,
  onClose,
  onCreateGarden,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a garden name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Don't send gardenDefinitionKey — backend validates it against its DB
      // The 3D scene always uses the test_garden config regardless
      await onCreateGarden(title.trim());
      setTitle('');
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to create garden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px" showCloseButton={false}>
      <div style={containerStyle}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
          <div style={{ fontSize: '48px', marginBottom: theme.spacing.sm }}>🌳</div>
          <h2 style={{ ...typography.styles.h3, marginBottom: theme.spacing.xs }}>
            Create New Garden
          </h2>
          <p style={{ ...typography.styles.body, color: theme.text.secondary }}>
            Your RS3-inspired garden with cabana, fountain &amp; more
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Garden Name"
            type="text"
            placeholder="My Memory Garden"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            error={error}
            fullWidth
            autoFocus
          />

          <div style={{
            display: 'flex',
            gap: theme.spacing.sm,
            justifyContent: 'flex-end',
            marginTop: theme.spacing.xl,
          }}>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              {isLoading ? 'Creating...' : '🌸 Create Garden'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'relative',
  background: '#FFFFFF',
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.xl,
  padding: theme.spacing.xl,
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(255, 201, 217, 0.3)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  color: theme.text.secondary,
  transition: 'opacity 0.2s ease',
  zIndex: 10,
  opacity: 0.6,
};
