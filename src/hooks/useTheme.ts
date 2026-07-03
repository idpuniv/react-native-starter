import { useThemeContext } from '@/app/providers/ThemeProvider';

/**
 * Hook public pour accéder au thème courant et changer de mode.
 *
 * @example
 * const { theme, isDark, setMode } = useTheme();
 * <View style={{ backgroundColor: theme.background }} />
 */
export function useTheme() {
  return useThemeContext();
}
