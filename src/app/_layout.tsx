/**
 * @fileoverview Root layout for WeatherNow application.
 *
 * WHY ThemeProvider? Ensures consistent dark/light theme propagation through
 * the entire navigation tree, following Expo Router best practices.
 *
 * WHY SplashScreen.preventAutoHideAsync()? Prevents flash of unstyled content
 * on app launch. The splash screen stays visible until we explicitly hide it
 * after critical resources (fonts, cached data) are loaded.
 */
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

/** Keep splash screen visible while we load resources */
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    /**
     * WHY setTimeout? In a real app, we'd await font loading, cached data, etc.
     * For now, we hide the splash screen immediately after the first render.
     * This will be replaced with actual resource loading logic in future tasks.
     */
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'WeatherNow' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
