/**
 * Horizons Design System - Premium Theme
 * Sophisticated pinkish palette inspired by elegant web design
 */

export const theme = {
  // Primary Pinkish Color Palette
  colors: {
    // Rose & Pink Tones
    rose: {
      50: '#FFF5F7',
      100: '#FFEEF2',
      200: '#FFE0E8',
      300: '#FFC9D9',
      400: '#FFB0C8',
      500: '#E8B4B8',  // Primary dusty rose
      600: '#D4909A',  // Deeper rose for CTAs
      700: '#B87580',
      800: '#9D5F6A',
      900: '#7D4A54',
    },
    
    // Blush & Cream
    blush: {
      50: '#FFFCFD',
      100: '#FFF8F9',
      200: '#FFF0F2',
      300: '#F5D5D8',  // Soft blush backgrounds
      400: '#F0C5CA',
      500: '#E8B0B7',
    },
    
    // Lavender Accents
    lavender: {
      50: '#FAF8FC',
      100: '#F3EEF7',
      200: '#E5D9EE',
      300: '#D6C3E3',
      400: '#C5A9D0',  // Tertiary lavender
      500: '#B494C1',
      600: '#9E7DAE',
    },
    
    // Gold Premium Accents
    gold: {
      50: '#FFFCF5',
      100: '#FFF8E7',
      200: '#FFEFD1',
      300: '#FFE5B8',
      400: '#E8D4A0',
      500: '#D4AF6A',  // Premium tier
      600: '#B8945A',
    },
    
    // Neutrals
    neutral: {
      white: '#FFFFFF',
      cream: '#FAF7F5',      // Warm backgrounds
      lightCream: '#FFF9F7',
      blush: '#FFF5F5',
      warmGray: '#F5F0EE',
      gray: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
      },
      charcoal: '#3D3340',   // Premium text
      deepCharcoal: '#2A2530',
    },
  },

  // Semantic Colors
  semantic: {
    success: '#6B9B7A',
    warning: '#E8C47A',
    error: '#D4909A',
    info: '#9BB5D4',
  },

  // Background System
  bg: {
    primary: '#FAF7F5',          // Main background
    secondary: '#FFF9F7',        // Secondary sections
    elevated: '#FFFFFF',         // Cards, modals
    blush: '#FFF5F5',           // Soft accents
    gradient: {
      primary: 'linear-gradient(135deg, #FFF5F7 0%, #FAF7F5 100%)',
      rose: 'linear-gradient(135deg, #FFE0E8 0%, #F5D5D8 100%)',
      lavender: 'linear-gradient(135deg, #F3EEF7 0%, #E5D9EE 100%)',
      warm: 'linear-gradient(135deg, #FFFCF5 0%, #FFF5F7 100%)',
      mesh: 'radial-gradient(circle at 20% 50%, rgba(232, 180, 184, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(197, 169, 208, 0.12) 0%, transparent 50%)',
    },
  },

  // Text Colors
  text: {
    primary: '#3D3340',         // Charcoal
    secondary: '#6B5F68',       // Muted charcoal
    tertiary: '#9D8F99',        // Light gray
    inverse: '#FFFFFF',
    accent: '#D4909A',          // Rose accent
    gold: '#D4AF6A',           // Premium
  },

  // Border System
  border: {
    light: 'rgba(232, 180, 184, 0.15)',
    medium: 'rgba(232, 180, 184, 0.25)',
    dark: 'rgba(232, 180, 184, 0.4)',
    gradient: 'linear-gradient(135deg, rgba(232, 180, 184, 0.3), rgba(197, 169, 208, 0.3))',
  },

  // Accent Colors (from old theme, updated)
  accent: {
    rose: '#E8B4B8',
    deepRose: '#D4909A',
    lavender: '#C5A9D0',
    gold: '#D4AF6A',
  },

  // Shadows (softer, more elegant)
  shadow: {
    xs: '0 1px 2px rgba(61, 51, 64, 0.04)',
    sm: '0 2px 8px rgba(61, 51, 64, 0.06), 0 1px 3px rgba(61, 51, 64, 0.04)',
    md: '0 4px 16px rgba(61, 51, 64, 0.08), 0 2px 6px rgba(61, 51, 64, 0.04)',
    lg: '0 8px 24px rgba(61, 51, 64, 0.10), 0 4px 12px rgba(61, 51, 64, 0.06)',
    xl: '0 16px 48px rgba(61, 51, 64, 0.12), 0 8px 16px rgba(61, 51, 64, 0.06)',
    '2xl': '0 24px 64px rgba(61, 51, 64, 0.15), 0 12px 24px rgba(61, 51, 64, 0.08)',
    glow: '0 0 24px rgba(232, 180, 184, 0.4)',
    glowLavender: '0 0 24px rgba(197, 169, 208, 0.4)',
  },

  // Border Radius (more rounded for organic feel)
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    full: '9999px',
    blob: '60% 40% 30% 70% / 60% 30% 70% 40%',  // Organic blob shape
  },

  // Spacing Scale (more generous)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
    '5xl': '80px',
    '6xl': '96px',
    '7xl': '128px',
  },

  // Transitions (smooth, spring-like)
  transition: {
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',  // Bouncy
    smooth: 'all 500ms cubic-bezier(0.25, 0.8, 0.25, 1)',   // Elegant
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
  },

  // Blur effects (glass morphism)
  blur: {
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(12px)',
    xl: 'blur(16px)',
  },

  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1536px',
    ultrawide: '1920px',
  },

  // Max widths for content
  maxWidth: {
    content: '720px',        // Text content
    contentWide: '960px',    // Wide content
    container: '1280px',     // Main container
    containerWide: '1440px', // Wide container
    full: '100%',
  },

  // Animation Keyframes
  animations: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    slideUp: {
      from: { transform: 'translateY(20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    shimmer: {
      '0%': { backgroundPosition: '-1000px 0' },
      '100%': { backgroundPosition: '1000px 0' },
    },
  },
} as const;

export type Theme = typeof theme;
