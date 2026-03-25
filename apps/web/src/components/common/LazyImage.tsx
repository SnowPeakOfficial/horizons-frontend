/**
 * LazyImage — Drop-in replacement for <img> with lazy loading + fade-in
 *
 * - Uses native loading="lazy" for viewport-based deferred loading
 * - Shows a shimmer skeleton placeholder while the image loads
 * - Smoothly fades in once the image is ready
 * - All standard <img> props are passed through
 */

import React, { useState } from 'react';
import type { CSSProperties } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Optional background color for the placeholder skeleton. Defaults to a warm neutral. */
  placeholderColor?: string;
  /** Optional: disable the skeleton/fade-in (e.g. for already-in-memory blob URLs) */
  noSkeleton?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  style,
  placeholderColor = '#EDE8E3',
  noSkeleton = false,
  className,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    // Inherit sizing from the passed style if it controls layout
    width: style?.width,
    height: style?.height,
    maxWidth: style?.maxWidth,
    minHeight: style?.minHeight,
    flex: style?.flex,
    borderRadius: style?.borderRadius,
  };

  const skeletonStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(
      90deg,
      ${placeholderColor} 0%,
      ${lighten(placeholderColor, 0.08)} 50%,
      ${placeholderColor} 100%
    )`,
    backgroundSize: '200% 100%',
    animation: loaded || noSkeleton ? 'none' : 'lazyimage-shimmer 1.6s ease-in-out infinite',
    opacity: loaded || noSkeleton ? 0 : 1,
    transition: 'opacity 300ms ease',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  };

  const imgStyle: CSSProperties = {
    ...style,
    opacity: loaded || noSkeleton ? 1 : 0,
    transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'block',
    // Reset positioning props that are now on the wrapper
    width: '100%',
    height: style?.height ?? 'auto',
  };

  return (
    <>
      {/* Inject shimmer keyframes once */}
      <style>{`
        @keyframes lazyimage-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <span style={wrapperStyle} className={className}>
        {/* Skeleton shimmer */}
        {!noSkeleton && <span style={skeletonStyle} aria-hidden="true" />}

        <img
          src={src}
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={imgStyle}
          {...rest}
        />
      </span>
    </>
  );
};

/**
 * Lighten a hex color by a given amount (0–1).
 * Simple utility — only handles 6-digit hex.
 */
function lighten(hex: string, amount: number): string {
  try {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * amount));
    const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * amount));
    const b = Math.min(255, (n & 0xff) + Math.round(255 * amount));
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return hex;
  }
}
