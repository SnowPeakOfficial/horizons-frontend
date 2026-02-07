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

  // Predefined Text Styles
  styles: {
    // Display Styles (for hero sections)
    display1: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: '72px',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    display2: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: '64px',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    display3: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: '56px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
    },

    // Heading Styles
    h1: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: '48px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Crimson Pro", "Playfair Display", Georgia, serif',
      fontSize: '40px',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '32px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '0',
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },

    // Body Styles
    bodyLarge: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    body: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    bodySmall: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },

    // UI Text
    label: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    labelBold: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    captionBold: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '13px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },

    // Button Styles
    buttonLarge: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.01em',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.01em',
    },
    buttonSmall: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.015em',
    },
  },
} as const;

export type Typography = typeof typography;
