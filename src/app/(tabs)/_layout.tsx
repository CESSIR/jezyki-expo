/**
 * @fileoverview Konfiguracja dolnego paska nawigacji (Tabs).
 *
 * Używamy Expo Router Tabs do prostego zarządzania zakładkami.
 */
import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.backgroundElement,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pogoda',
          // Tymczasowy brak ikony - dodamy w przyszłości
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Szukaj',
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Ulubione',
        }}
      />
    </Tabs>
  );
}
