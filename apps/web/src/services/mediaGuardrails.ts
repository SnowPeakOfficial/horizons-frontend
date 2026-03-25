/**
 * Media Upload Guardrails — Phase 1 (Client-Side)
 * Enforces size, duration, and type limits before any bytes reach Firebase.
 *
 * Limits (flat — no per-tier differences in Phase 1):
 *   📷 Photo  — 8 MB               | JPG, PNG, WebP, GIF
 *   🎤 Voice  — 5 MB  · 20 seconds | MP3, M4A, WAV, OGG, WebM audio
 *   🎬 Video  — 25 MB · 20 seconds | MP4, MOV, WebM video
 *
 * Source of truth: horizons-backend/MEDIA_TRANSCODING_PIPELINE.md
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type MediaType = 'image' | 'voice' | 'video';

// ── Limits ────────────────────────────────────────────────────────────────────

const MB = 1024 * 1024;

const LIMITS = {
  image: {
    maxBytes: 8 * MB,
    maxDuration: null as null, // no duration check for images
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    label: 'Photo',
    formats: 'JPG, PNG, WebP, GIF',
  },
  voice: {
    maxBytes: 5 * MB,
    maxDuration: 20, // seconds
    mimeTypes: [
      'audio/mpeg',
      'audio/mp4',
      'audio/x-m4a',
      'audio/wav',
      'audio/ogg',
      'audio/webm',
    ],
    label: 'Voice',
    formats: 'MP3, M4A, WAV, OGG',
  },
  video: {
    maxBytes: 25 * MB,
    maxDuration: 20, // seconds
    mimeTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
    label: 'Video',
    formats: 'MP4, MOV, WebM',
  },
} as const;

// ── Custom error ──────────────────────────────────────────────────────────────

export class MediaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MediaValidationError';
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Loads a media file into a hidden <audio>/<video> element to read its duration.
 * Resolves with the duration in seconds, or Infinity if it can't be determined.
 */
function getMediaDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const isVideo = file.type.startsWith('video/');
    const el = document.createElement(isVideo ? 'video' : 'audio') as
      | HTMLVideoElement
      | HTMLAudioElement;
    el.preload = 'metadata';
    const url = URL.createObjectURL(file);

    const cleanup = (duration: number) => {
      URL.revokeObjectURL(url);
      resolve(duration);
    };

    // Timeout fallback: if metadata never loads (common on mobile for MP4/MOV),
    // resolve with 0 so the size check still runs and the file isn't rejected.
    const timeout = setTimeout(() => cleanup(0), 3000);

    el.src = url;
    el.onloadedmetadata = () => {
      clearTimeout(timeout);
      cleanup(el.duration);
    };
    el.onerror = () => {
      // Fail open — resolve 0 so size check protects instead of blocking all videos.
      clearTimeout(timeout);
      cleanup(0);
    };
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Validates a file before upload.
 * Throws `MediaValidationError` with a user-friendly message on failure.
 *
 * Checks (in order):
 *  1. MIME type is allowed
 *  2. File size is within limit
 *  3. Duration is within limit (voice & video only)
 */
export async function validateMediaFile(
  file: File,
  type: MediaType,
): Promise<void> {
  const limits = LIMITS[type];

  // 1. MIME type check
  const allowed = limits.mimeTypes as readonly string[];
  if (!allowed.includes(file.type)) {
    const ext = file.name.split('.').pop()?.toUpperCase() ?? 'This format';
    throw new MediaValidationError(
      `${ext} files aren't supported. Please use ${limits.formats}.`,
    );
  }

  // 2. Size check
  if (file.size > limits.maxBytes) {
    const maxMB = limits.maxBytes / MB;
    const fileMB = (file.size / MB).toFixed(1);
    throw new MediaValidationError(
      `File is too large (${fileMB} MB). ${limits.label} must be under ${maxMB} MB.`,
    );
  }

  // 3. Duration check (voice & video only)
  if (limits.maxDuration !== null) {
    const duration = await getMediaDuration(file);
    if (duration > limits.maxDuration) {
      const secs = Math.round(duration);
      throw new MediaValidationError(
        `${limits.label} is too long (${secs}s). Maximum duration is ${limits.maxDuration} seconds.`,
      );
    }
  }
}

/**
 * Returns a hint string for display beneath each upload button.
 * e.g. "JPG, PNG, WebP, GIF · max 10 MB"
 *      "MP3, M4A, WAV, OGG · max 10 MB · 30s limit"
 */
export function getUploadHint(type: MediaType): string {
  const l = LIMITS[type];
  const sizePart = `max ${l.maxBytes / MB} MB`;
  const durationPart = l.maxDuration !== null ? ` · ${l.maxDuration}s limit` : '';
  return `${l.formats} · ${sizePart}${durationPart}`;
}
