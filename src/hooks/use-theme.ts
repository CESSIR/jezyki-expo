/**
 * @fileoverview Custom hook providing typed access to the current theme colors.
 *
 * WHY a wrapper hook? Abstracts the null-check from useColorScheme() and provides
 * direct access to the theme color palette. Components don't need to handle the
 * null case or manually index into the Colors object.
 *
 * WHY fallback to 'light'? If the system color scheme is not determined (null),
 * we default to light mode for a consistent initial experience.
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  /** WHY ?? 'light'? useColorScheme() can return null on some platforms. */
  const theme = scheme ?? 'light';

  return Colors[theme];
}
