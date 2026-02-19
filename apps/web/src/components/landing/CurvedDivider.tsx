/**
 * Curved Divider Component
 * Organic section transitions inspired by high-end design
 */

import React from 'react';

interface CurvedDividerProps {
  color?: string;
  flip?: boolean;
}

export const CurvedDivider: React.FC<CurvedDividerProps> = ({
  color = '#FAF7F5',
  flip = false,
}) => {
  return (
    <div
      style={{
        width: '100%',
        lineHeight: 0,
        transform: flip ? 'rotate(180deg)' : 'none',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '60px',
        }}
      >
        <path
          d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"
          fill={color}
          style={{ transition: 'fill 0.3s ease' }}
        />
      </svg>
    </div>
  );
};
