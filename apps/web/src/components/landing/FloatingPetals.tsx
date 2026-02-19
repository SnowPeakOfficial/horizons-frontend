/**
 * Floating Petals Component
 * Gentle, organic animation for visual interest
 * Inspired by high-end botanical websites
 */

import React from 'react';

interface Petal {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
  size: number;
  opacity: number;
}

export const FloatingPetals: React.FC = () => {
  // Generate random petals once on mount
  const [petals] = React.useState<Petal[]>(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${15 + Math.random() * 10}s`,
      size: 20 + Math.random() * 30,
      opacity: 0.15 + Math.random() * 0.25,
    }))
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          style={{
            position: 'absolute',
            left: petal.left,
            top: '-50px',
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            opacity: petal.opacity,
            animation: `floatDown ${petal.animationDuration} linear infinite`,
            animationDelay: petal.animationDelay,
          }}
        >
          {/* Petal SVG */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{
              width: '100%',
              height: '100%',
              color: '#E8B4BC',
              filter: 'blur(0.5px)',
            }}
          >
            <path d="M12 2C9.24 2 7 4.24 7 7c0 1.77.94 3.32 2.35 4.19C9.13 11.8 9 12.38 9 13c0 1.66 1.34 3 3 3s3-1.34 3-3c0-.62-.13-1.2-.35-1.81C16.06 10.32 17 8.77 17 7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3 0 1.32-.84 2.44-2 2.87V9c0-.55-.45-1-1-1s-1 .45-1 1v.87C9.84 9.44 9 8.32 9 7c0-1.66 1.34-3 3-3z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
