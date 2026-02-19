/**
 * Card Component
 * Elegant content container
 */

import React from 'react';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = theme.spacing.xl,
  hover = false,
  onClick,
  style,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle: React.CSSProperties = {
    background: theme.bg.elevated,
    borderRadius: theme.radius.xl,
    padding,
    boxShadow: isHovered && hover ? theme.shadow.md : theme.shadow.sm,
    transition: theme.transition.base,
    cursor: onClick ? 'pointer' : 'default',
    border: `1px solid ${theme.border.light}`,
    ...style,
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
    >
      {children}
    </div>
  );
};
