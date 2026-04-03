// ── Timing (frames @ 30fps) — ~36.0s total = 1080 frames ────────────────────
export const FPS = 30;
export const TOTAL_FRAMES = 1080;

export const SCENE = {
  problem:  { start: 0,   dur: 160 },  // 0:00–0:05.3   dark problem hook (+0.5s for readability)
  intro:    { start: 160, dur: 83  },  // 0:05.3–0:08.1 "There's a better way." bridge
  sakura:   { start: 228, dur: 132 },  // 0:07.6–0:12.0 sakura logo bloom + tagline
  feat1:    { start: 360, dur: 195 },  // 0:12.0–0:18.5 send a memory (extended for reading time)
  feat2:    { start: 540, dur: 195 },  // 0:18.0–0:24.5 private garden (15f XFADE with feat1 end)
  feat3:    { start: 720, dur: 195 },  // 0:24.0–0:30.5 time capsule
  cta:      { start: 900, dur: 180 },  // 0:30.0–0:36.0 CTA finale → white fade (6s)
} as const;

// ── Exact Horizons design-system colours (from theme.ts) ─────────────────────
export const COLOR = {
  // backgrounds
  bgPrimary:   '#FAF7F5',
  bgSecondary: '#FFF9F7',
  bgWhite:     '#FFFFFF',
  bgGradient:  'linear-gradient(180deg, #FDFCFA 0%, #FFF9F7 50%, #FFFFFF 100%)',
  bgDark:      '#1E1624',   // deep warm plum for problem/intro scenes

  // text
  textPrimary:   '#3D3340',
  textSecondary: '#6B5F68',
  textTertiary:  '#6B5B6E',
  textOnDark:    '#F0E8F0',

  // rose palette
  rose400: '#D4707E',
  rose500: '#E8B4B8',
  rose600: '#D4909A',
  rose700: '#B87580',

  // lavender
  lavender400: '#C5A9D0',

  // glow / mesh
  glowRose:     'rgba(232, 180, 188, 0.08)',
  glowLavender: 'rgba(197, 169, 208, 0.06)',
  shadowGlow:   'rgba(232, 180, 184, 0.40)',
} as const;

// ── Typography ────────────────────────────────────────────────────────────────
export const FONT = {
  serif: "'Crimson Pro', Georgia, serif",
  sans:  "'Inter', system-ui, sans-serif",
} as const;

// ── Assets (resolved via Remotion staticFile() from /public) ─────────────────
export const ASSETS = {
  logoWordmark: 'images/horizons-logo-wordmark.svg',
  logoIcon:     'images/horizons-logo.svg',
  sakuraVideo:  'videos/sakura-blast.mp4',
  hydrangea:    'images/Default_A_delicate_intricately_detailed_3D_hydrangea_blooms_ag_1_5608c5bf-c46a-46b8-b9a4-6f3a3aeb05dc_0.png',
  peony:        'images/Default_A_delicate_translucent_3D_peony_depicted_in_a_sleek_gl_1_ea84b303-9941-4a01-a727-b0366c3d4aa6_0.png',
  glassMorph:   'images/Default_A_delicately_rendered_3D_glassmorphism_flower_radiates_1_700f987d-038b-4bb7-bdff-feeaa85be7dc_0 1.png',
  cornflower:   'images/Default_A_mesmerizing_3D_illustration_of_a_delicate_cornflower_0_19deed4c-65ec-411d-8afd-76a72577a397_0.png',
  glassFlower:  'images/Default_A_delicate_intricately_designed_3D_glass_flower_with_s_3_0df29597-2de3-4b9b-b21e-b189c6a4b42c_0.png',
} as const;
