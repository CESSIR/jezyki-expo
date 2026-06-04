/**
 * @fileoverview Hook udostępniający kolory obecnego motywu.
 *
 * Abstrakcja nad useColorScheme, dająca bezpośredni dostęp do palety
 * oraz zapewniająca domyślny jasny motyw w przypadku braku preferencji.
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  /** Zabezpieczenie przed wartością null z useColorScheme. */
  const theme = scheme ?? 'light';

  return Colors[theme];
}
