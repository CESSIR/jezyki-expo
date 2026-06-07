/**
 * @fileoverview Główny layout aplikacji WeatherNow.
 *
 * Używamy Expo Router (routing oparty na plikach), bo zapewnia
 * czytelną architekturę. ThemeProvider gwarantuje spójny motyw.
 * SplashScreen.preventAutoHideAsync() zapobiega miganiu przed załadowaniem zasobów.
 */
import '../global.css'; // Wymagane przez NativeWind v4

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import ErrorBoundary from '@/components/ErrorBoundary';

/** Zatrzymanie ukrywania ekranu powitalnego */
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    /**
     * Symulacja ładowania zasobów (zostanie zastąpiona docelową logiką).
     */
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/*
           * Nawigacja główna ukryta w podfolderze (tabs).
           * Dzięki wpisowi 'headerShown: false' główny Stack nie będzie dublował nagłówka z zakładkami.
           */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/*
           * Ekran prognozy 7-dniowej. Jest to ekran typu Stack, który może zostać otwarty
           * ponad zakładkami (jako podstrona).
           */}
          <Stack.Screen
            name="forecast"
            options={{
              title: 'Prognoza 7-dniowa',
              presentation: 'card',
            }}
          />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
