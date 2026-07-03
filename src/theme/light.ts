import colors from './colors';
import { SPACING, BORDER_RADIUS } from '@/constants';

const light = {
  // ─── Couleurs de surface ─────────────────────────────────────────────────────
  background:    colors.gray[50],
  surface:       colors.white,
  surfaceRaised: colors.white,
  border:        colors.gray[200],
  borderStrong:  colors.gray[300],

  // ─── Texte ───────────────────────────────────────────────────────────────────
  text: {
    primary:   colors.gray[900],
    secondary: colors.gray[500],
    disabled:  colors.gray[300],
    inverse:   colors.white,
    link:      colors.primary[600],
  },

  // ─── Brand ───────────────────────────────────────────────────────────────────
  primary:        colors.primary[600],
  primaryLight:   colors.primary[50],
  primaryPressed: colors.primary[700],

  // ─── Semantic ────────────────────────────────────────────────────────────────
  success: colors.success,
  warning: colors.warning,
  error:   colors.error,
  info:    colors.info,

  // ─── Shared tokens ───────────────────────────────────────────────────────────
  spacing:      SPACING,
  borderRadius: BORDER_RADIUS,
} as const;

export type Theme = typeof light;
export default light;
