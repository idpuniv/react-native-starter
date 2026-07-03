// ─── Regex ───────────────────────────────────────────────────────────────────

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
} as const;

// ─── Dimensions ───────────────────────────────────────────────────────────────

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

// ─── Strings ─────────────────────────────────────────────────────────────────

export const STRINGS = {
  app: {
    name: 'MonApp',
  },
  errors: {
    generic: 'Une erreur inattendue est survenue.',
    network: 'Impossible de joindre le serveur.',
  },
} as const;
