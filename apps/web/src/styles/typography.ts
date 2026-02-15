/**
 * Horizons Typography System
 * Elegant, sophisticated font hierarchy
 */

export const typography = {
  // Font Families
  fontFamily: {
    // Elegant serif for display and headings
    serif: '"Crimson Pro", "Playfair Display", Georgia, serif',
    // Clean sans-serif for UI and body
    sans: '"Inter", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    // Monospace for code
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Font Sizes (Desktop-first, generous sizing)
  fontSize: {
    // Display (Hero sections)
    display1: '72px',
    display2: '64px',
    display3: '56px',
    
    // Headings
    h1: '48px',
    h2: '40px',
    h3: '32px',
    h4: '28px',
    h5: '24px',
    h6: '20px',
    
    // Body
    bodyLarge: '20px',
    body: '18px',
    bodySmall: '16px',
    
    // UI Elements
    label: '14px',
    caption: '13px',
    tiny: '12px',
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
    extraLoose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Predefined Text Styles (Enhanced with Fluid Typography)
  styles: {
    // Display Styles (for hero sections) - Now responsive!
    display1: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: 'clamp(3rem, 6vw + 1rem, 4.5rem)', // 48px → 72px
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    display2: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: 'clamp(2.5rem, 5vw + 1rem, 4rem)', // 40px → 64px
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    display3: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: 'clamp(2rem, 4vw + 1rem, 3.5rem)', // 32px → 56px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
    },

    // Heading Styles - Now responsive!
    h1: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: 'clamp(2rem, 4vw + 0.5rem, 3rem)', // 32px → 48px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: 'clamp(1.75rem, 3vw + 0.5rem, 2.5rem)', // 28px → 40px
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(1.5rem, 2.5vw + 0.5rem, 2rem)', // 24px → 32px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(1.25rem, 2vw + 0.5rem, 1.75rem)', // 20px → 28px
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '0',
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem)', // 18px → 24px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(1rem, 1vw + 0.5rem, 1.25rem)', // 16px → 20px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },

    // Body Styles - Now responsive!
    bodyLarge: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(1.125rem, 1.5vw + 0.25rem, 1.25rem)', // 18px → 20px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    body: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(1rem, 1vw + 0.25rem, 1.125rem)', // 16px → 18px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    bodySmall: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(0.875rem, 0.75vw + 0.25rem, 1rem)', // 14px → 16px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },

    // UI Text - Now responsive!
    label: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(0.875rem, 0.5vw + 0.5rem, 0.875rem)', // 14px
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    labelBold: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(0.875rem, 0.5vw + 0.5rem, 0.875rem)', // 14px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(0.813rem, 0.5vw + 0.25rem, 0.813rem)', // 13px
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    captionBold: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(0.813rem, 0.5vw + 0.25rem, 0.813rem)', // 13px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },

    // Button Styles - Now responsive!
    buttonLarge: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(1rem, 1vw + 0.25rem, 1.125rem)', // 16px → 18px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.01em',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(0.875rem, 1vw + 0.25rem, 1rem)', // 14px → 16px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.01em',
    },
    buttonSmall: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(0.813rem, 0.75vw + 0.25rem, 0.875rem)', // 13px → 14px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.015em',
    },
  },
} as const;

export type Typography = typeof typography;
