/**
 * Letter Templates
 * Defines the visual theme, copy, and tone for each relationship type.
 * The letterTemplate key is stored on the Flower object (backend field).
 */

export type LetterTemplateKey =
  | 'romantic'
  | 'friendship'
  | 'family'
  | 'gratitude'
  | 'celebration'
  | 'encouragement';

export interface LetterTemplate {
  key: LetterTemplateKey;

  /** Display label shown in the step 4 picker */
  label: string;

  /** Emoji shown on the picker card */
  emoji: string;

  /** Short description on the picker card */
  description: string;

  /** Example snippet shown as a preview on the picker card */
  previewSnippet: string;

  // ── Visual Theme ──────────────────────────────────────────────

  /** Outer frame background color */
  frameColor: string;

  /** White-card CSS gradient string */
  cardGradient: string;

  /** Primary accent color (dates, flower name, quote border) */
  accentColor: string;

  /** Slightly darker shade for headings / greeting */
  accentDark: string;

  // ── Decorations ───────────────────────────────────────────────

  /** Top garland string (rendered verbatim) */
  garland: string;

  /** Whether to show the doodle hearts (♡, ♥︎) — Romantic only */
  showDoodleHearts: boolean;

  /**
   * Scattered body decorations — symbols placed absolutely inside the white card.
   * All positions are hardcoded so the layout is perfectly consistent on every open.
   * Always 6 entries alternating left/right: indices 0,2,4 → left; 1,3,5 → right.
   */
  bodyDecorations: Array<{
    symbol: string;
    fontSize: string;
    opacity: number;
    /** CSS top percentage e.g. "10%" */
    top: string;
    /** Which side of the card */
    side: 'left' | 'right';
    /** Distance from the edge in px e.g. 16 */
    inset: number;
  }>;

  // ── Copy / Tone ───────────────────────────────────────────────

  /** Sign-off phrase above the sender name */
  signOff: string;

  /**
   * Opening body sentence.
   * Use {date} and {flower} as placeholders — replaced at render time.
   */
  openingSentence: string;

  /** Default message when the sender left no custom message */
  defaultMessage: string;
}

export const LETTER_TEMPLATES: Record<LetterTemplateKey, LetterTemplate> = {
  // ─────────────────────────────────────────────────────────────
  romantic: {
    key: 'romantic',
    label: 'Romantic',
    emoji: '💕',
    description: 'For a partner or someone you love',
    previewSnippet: '"loving you feels like watching something beautiful grow"',

    frameColor: '#E8A4B0',
    cardGradient: 'linear-gradient(135deg, #FFFEF9 0%, #FFF9F0 100%)',
    accentColor: '#C2475D',
    accentDark: '#9B2D42',

    garland: '♡―✿―♡',
    showDoodleHearts: true,
    bodyDecorations: [
      { symbol: '♡', fontSize: '16px', opacity: 0.35, top: '9%',  side: 'left',  inset: 14 },
      { symbol: '♥︎', fontSize: '16px', opacity: 0.28, top: '21%', side: 'right', inset: 18 },
      { symbol: '♡', fontSize: '14px', opacity: 0.22, top: '37%', side: 'left',  inset: 20 },
      { symbol: '♥︎', fontSize: '20px', opacity: 0.30, top: '53%', side: 'right', inset: 14 },
      { symbol: '♡', fontSize: '17px', opacity: 0.25, top: '68%', side: 'left',  inset: 16 },
      { symbol: '♥︎', fontSize: '13px', opacity: 0.20, top: '82%', side: 'right', inset: 20 },
    ],

    signOff: 'With all my love,',
    openingSentence:
      'On {date}, this {flower} was planted because loving you feels like watching something beautiful grow.',
    defaultMessage: 'You are the reason this garden exists.',
  },

  // ─────────────────────────────────────────────────────────────
  friendship: {
    key: 'friendship',
    label: 'Friendship',
    emoji: '🌿',
    description: 'For a close friend',
    previewSnippet: '"some people just make life better"',

    frameColor: '#A8D5A2',
    cardGradient: 'linear-gradient(135deg, #F7FDF4 0%, #F0FAF0 100%)',
    accentColor: '#4A7C59',
    accentDark: '#2E5C3A',

    garland: '✦―✿―✦',
    showDoodleHearts: false,
    bodyDecorations: [
      { symbol: '✿', fontSize: '16px', opacity: 0.30, top: '10%', side: 'left',  inset: 16 },
      { symbol: '✦', fontSize: '14px', opacity: 0.25, top: '23%', side: 'right', inset: 14 },
      { symbol: '✿', fontSize: '16px', opacity: 0.22, top: '39%', side: 'left',  inset: 18 },
      { symbol: '✦', fontSize: '18px', opacity: 0.28, top: '55%', side: 'right', inset: 16 },
      { symbol: '✿', fontSize: '13px', opacity: 0.20, top: '69%', side: 'left',  inset: 20 },
      { symbol: '✦', fontSize: '15px', opacity: 0.23, top: '83%', side: 'right', inset: 14 },
    ],

    signOff: 'Your friend,',
    openingSentence:
      'On {date}, this {flower} was planted to remind you — some people just make life better.',
    defaultMessage:
      "Here's to the adventures we've shared, and all the ones still ahead.",
  },

  // ─────────────────────────────────────────────────────────────
  family: {
    key: 'family',
    label: 'Family',
    emoji: '🏡',
    description: 'For a family member',
    previewSnippet: '"the bond that holds us together"',

    frameColor: '#D4A96A',
    cardGradient: 'linear-gradient(135deg, #FFFBF0 0%, #FFF5E0 100%)',
    accentColor: '#8B5E2A',
    accentDark: '#6B4018',

    garland: '❧―✿―❧',
    showDoodleHearts: false,
    bodyDecorations: [
      { symbol: '❧', fontSize: '16px', opacity: 0.28, top: '11%', side: 'left',  inset: 15 },
      { symbol: '✿', fontSize: '15px', opacity: 0.24, top: '24%', side: 'right', inset: 17 },
      { symbol: '❧', fontSize: '16px', opacity: 0.22, top: '40%', side: 'left',  inset: 19 },
      { symbol: '✿', fontSize: '18px', opacity: 0.26, top: '56%', side: 'right', inset: 15 },
      { symbol: '❧', fontSize: '14px', opacity: 0.20, top: '70%', side: 'left',  inset: 17 },
      { symbol: '✿', fontSize: '13px', opacity: 0.18, top: '83%', side: 'right', inset: 21 },
    ],

    signOff: 'With love,',
    openingSentence:
      'On {date}, this {flower} was planted to honor the bond that holds us together.',
    defaultMessage: 'Family is the garden that never stops growing.',
  },

  // ─────────────────────────────────────────────────────────────
  gratitude: {
    key: 'gratitude',
    label: 'Gratitude',
    emoji: '🙏',
    description: 'A heartfelt thank-you',
    previewSnippet: '"something words rarely do justice to — thank you"',

    frameColor: '#B5C8E8',
    cardGradient: 'linear-gradient(135deg, #F8FAFF 0%, #F2F6FF 100%)',
    accentColor: '#3B6CB7',
    accentDark: '#2A4E8A',

    garland: '❀―✿―❀',
    showDoodleHearts: false,
    bodyDecorations: [
      { symbol: '❀', fontSize: '16px', opacity: 0.28, top: '9%',  side: 'left',  inset: 16 },
      { symbol: '✿', fontSize: '14px', opacity: 0.22, top: '22%', side: 'right', inset: 18 },
      { symbol: '❀', fontSize: '22px', opacity: 0.20, top: '38%', side: 'left',  inset: 14 },
      { symbol: '✿', fontSize: '16px', opacity: 0.24, top: '54%', side: 'right', inset: 20 },
      { symbol: '❀', fontSize: '14px', opacity: 0.18, top: '69%', side: 'left',  inset: 18 },
      { symbol: '✿', fontSize: '12px', opacity: 0.20, top: '82%', side: 'right', inset: 15 },
    ],

    signOff: 'With gratitude,',
    openingSentence:
      'On {date}, this {flower} was planted to say something words rarely do justice to — thank you.',
    defaultMessage: 'What you did (or who you are) made a real difference.',
  },

  // ─────────────────────────────────────────────────────────────
  celebration: {
    key: 'celebration',
    label: 'Celebration',
    emoji: '🎉',
    description: 'Birthdays, achievements, milestones',
    previewSnippet: '"because you deserve to be celebrated"',

    frameColor: '#C5A3E0',
    cardGradient: 'linear-gradient(135deg, #FDF8FF 0%, #F8F0FF 100%)',
    accentColor: '#7B4FA6',
    accentDark: '#5E3280',

    garland: '◈―✿―◈',
    showDoodleHearts: false,
    bodyDecorations: [
      { symbol: '◈', fontSize: '16px', opacity: 0.32, top: '10%', side: 'left',  inset: 14 },
      { symbol: '✿', fontSize: '15px', opacity: 0.28, top: '23%', side: 'right', inset: 16 },
      { symbol: '◈', fontSize: '14px', opacity: 0.25, top: '39%', side: 'left',  inset: 20 },
      { symbol: '✿', fontSize: '17px', opacity: 0.30, top: '55%', side: 'right', inset: 14 },
      { symbol: '◈', fontSize: '16px', opacity: 0.22, top: '69%', side: 'left',  inset: 18 },
      { symbol: '✿', fontSize: '13px', opacity: 0.24, top: '82%', side: 'right', inset: 20 },
    ],

    signOff: 'Cheers to you,',
    openingSentence:
      'On {date}, this {flower} was planted to mark this moment — because you deserve to be celebrated.',
    defaultMessage: "This is your moment. Here's to many more.",
  },

  // ─────────────────────────────────────────────────────────────
  encouragement: {
    key: 'encouragement',
    label: 'Encouragement',
    emoji: '✨',
    description: 'Uplifting support for someone',
    previewSnippet: '"even small growth counts"',

    frameColor: '#F0C080',
    cardGradient: 'linear-gradient(135deg, #FFFDF5 0%, #FFFBE8 100%)',
    accentColor: '#C47C00',
    accentDark: '#9A5E00',

    garland: '❖―✿―❖',
    showDoodleHearts: false,
    bodyDecorations: [
      { symbol: '❖', fontSize: '16px', opacity: 0.28, top: '11%', side: 'left',  inset: 15 },
      { symbol: '✿', fontSize: '14px', opacity: 0.22, top: '24%', side: 'right', inset: 19 },
      { symbol: '❖', fontSize: '13px', opacity: 0.20, top: '40%', side: 'left',  inset: 17 },
      { symbol: '✿', fontSize: '18px', opacity: 0.24, top: '56%', side: 'right', inset: 15 },
      { symbol: '❖', fontSize: '15px', opacity: 0.18, top: '70%', side: 'left',  inset: 21 },
      { symbol: '✿', fontSize: '12px', opacity: 0.20, top: '83%', side: 'right', inset: 16 },
    ],

    signOff: 'Rooting for you,',
    openingSentence:
      'On {date}, this {flower} was planted to remind you — take this as a reminder that even small growth counts.',
    defaultMessage: "Whatever you're facing, you don't have to face it alone.",
  },
};

/** Ordered list for displaying templates in the picker */
export const LETTER_TEMPLATE_ORDER: LetterTemplateKey[] = [
  'romantic',
  'friendship',
  'family',
  'gratitude',
  'celebration',
  'encouragement',
];

/** Helper: resolve a stored string to a LetterTemplate, fallback to romantic */
export function resolveLetterTemplate(key: string | null | undefined): LetterTemplate {
  if (key && key in LETTER_TEMPLATES) {
    return LETTER_TEMPLATES[key as LetterTemplateKey];
  }
  return LETTER_TEMPLATES.romantic;
}
