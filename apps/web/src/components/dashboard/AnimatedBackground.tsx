/**
 * Animated Background Component
 * Subtle gradient animation and floating petals
 */

import React from 'react';

export const AnimatedBackground: React.FC = () => {
  // Pre-generate durations to avoid Math.random in render
  const petalDurations = React.useMemo(() => [16, 18, 17, 19, 15, 20, 16.5, 18.5], []);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
    pointerEvents: 'none',
  };

  const gradientStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #fafaf7 0%, #fff5f7 50%, #fef7f8 100%)',
    animation: 'gradientShift 15s ease infinite',
  };

  const petalStyle = (delay: number, duration: number, left: string): React.CSSProperties => ({
    position: 'absolute',
    fontSize: '24px',
    opacity: 0.15,
    animation: `float ${duration}s ease-in-out ${delay}s infinite`,
    left,
    top: '-50px',
  });

  // Add keyframes to document if not already added
  React.useEffect(() => {
    const styleId = 'animated-background-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes gradientShift {
          0%, 100% {
            background: linear-gradient(135deg, #fafaf7 0%, #fff5f7 50%, #fef7f8 100%);
          }
          50% {
            background: linear-gradient(135deg, #fff5f7 0%, #fef7f8 50%, #fafaf7 100%);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.15;
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gradientStyle} />
      
      {/* Floating petals */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={petalStyle(
            i * 2,
            petalDurations[i],
            `${10 + i * 12}%`
          )}
        >
          🌸
        </div>
      ))}
    </div>
  );
};
