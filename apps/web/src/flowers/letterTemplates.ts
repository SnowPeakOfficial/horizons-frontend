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

  /** Outer pink-frame background color */
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

    frameColor: '#E8A4B0',           // rose-300 equivalent
    cardGradient: 'linear-gradient(135deg, #FFFEF9 0%, #FFF9F0 100%)',
    accentColor: '#C2475D',          // rose-600
    accentDark: '#9B2D42',           // rose-700

    garland: '♡―♥︎―♡',
    showDoodleHearts: true,

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

    frameColor: '#A8D5A2',           // soft sage green
    cardGradient: 'linear-gradient(135deg, #F7FDF4 0%, #F0FAF0 100%)',
    accentColor: '#4A7C59',          // forest green
    accentDark: '#2E5C3A',

    garland: '✦―✿―✦',
    showDoodleHearts: false,

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

    frameColor: '#D4A96A',           // warm amber / honey
    cardGradient: 'linear-gradient(135deg, #FFFBF0 0%, #FFF5E0 100%)',
    accentColor: '#8B5E2A',          // warm brown
    accentDark: '#6B4018',

    garland: '❧―✿―❧',
    showDoodleHearts: false,

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

    frameColor: '#B5C8E8',           // soft periwinkle / sky blue
    cardGradient: 'linear-gradient(135deg, #F8FAFF 0%, #F2F6FF 100%)',
    accentColor: '#3B6CB7',          // cornflower blue
    accentDark: '#2A4E8A',

    garland: '· · ✦ · ·',
    showDoodleHearts: false,

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

    frameColor: '#C5A3E0',           // soft lavender / violet
    cardGradient: 'linear-gradient(135deg, #FDF8FF 0%, #F8F0FF 100%)',
    accentColor: '#7B4FA6',          // violet
    accentDark: '#5E3280',

    garland: '✦―◈―✦',
    showDoodleHearts: false,

    signOff: 'Cheers to you,',
    openingSentence:
      'On {date}, this {flower} was planted to mark this moment — because you deserve to be celebrated.',
    defaultMessage: 'This is your moment. Here\'s to many more.',
  },

  // ─────────────────────────────────────────────────────────────
  encouragement: {
    key: 'encouragement',
    label: 'Encouragement',
    emoji: '✨',
    description: 'Uplifting support for someone',
    previewSnippet: '"even small growth counts"',

    frameColor: '#F0C080',           // warm golden yellow
    cardGradient: 'linear-gradient(135deg, #FFFDF5 0%, #FFFBE8 100%)',
    accentColor: '#C47C00',          // golden amber
    accentDark: '#9A5E00',

    garland: '— ✦ —',
    showDoodleHearts: false,

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
