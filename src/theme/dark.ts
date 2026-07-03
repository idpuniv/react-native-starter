import colors from './colors';
import { SPACING, BORDER_RADIUS } from '@/constants';
import { Theme } from './light';

const dark: Theme = {
  background:    colors.gray[900],
  surface:       colors.gray[800],
  surfaceRaised: colors.gray[700],
  border:        colors.gray[700],
  borderStrong:  colors.gray[600],

  text: {
    primary:   colors.gray[50],
    secondary: colors.gray[400],
    disabled:  colors.gray[600],
    inverse:   colors.gray[900],
    link:      colors.primary[400],
  },

  primary:        colors.primary[500],
  primaryLight:   colors.primary[900],
  primaryPressed: colors.primary[400],

  success: colors.success,
  warning: colors.warning,
  error:   colors.error,
  info:    colors.info,

  spacing:      SPACING,
  borderRadius: BORDER_RADIUS,
};

export default dark;
