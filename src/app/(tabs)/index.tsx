/**
 * @fileoverview Ekran główny - Aktualna pogoda.
 *
 * Obsługujemy uprawnienia GPS (kryterium walidacji uprawnień).
 * Wynik zapisujemy do sklepu Zustand.
 */
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useWeatherStore } from '@/store/weatherStore';

export default function HomeScreen() {
  const {
    latitude,
    longitude,
    status,
    errorMessage,
    currentWeather,
    setStatus,
    setLocation,
    fetchWeatherData,
  } = useWeatherStore();
  const router = useRouter();

  useEffect(() => {
    /** Pobiera lokalizację przy starcie i uruchamia zapytanie do API. */
    const initWeather = async () => {
      setStatus('loading');
      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

      if (permissionStatus !== 'granted') {
        setStatus('error', 'Odmowa dostępu do lokalizacji');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;
        setLocation(lat, lon);

        // Pomyślny GPS - uruchamiamy pobieranie z Open-Meteo
        await fetchWeatherData(lat, lon);
      } catch {
        setStatus('error', 'Nie udało się pobrać lokalizacji GPS');
      }
    };

    initWeather();
  }, [setLocation, setStatus, fetchWeatherData]);

  /**
   * Przejście do prognozy używając router.push (wymóg programatycznej nawigacji z parametrami).
   */
  const handleGoToForecast = () => {
    if (latitude && longitude) {
      router.push({
        pathname: '/forecast',
        params: { lat: latitude.toString(), lon: longitude.toString(), cityName: 'GPS' },
      });
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-weather-surface p-4">
      <Text className="text-3xl font-bold text-weather-primary-dark mb-4">📍 Twoja Pogoda</Text>

      {status === 'loading' && (
        <View className="items-center mb-6">
          <ActivityIndicator size="large" color="#208AEF" />
          <Text className="text-weather-secondary mt-2">Pobieranie danych...</Text>
        </View>
      )}

      {status === 'error' && (
        <View className="bg-red-100 p-4 rounded-xl mb-6 w-full max-w-sm">
          <Text className="text-red-600 font-semibold text-center">{errorMessage}</Text>
        </View>
      )}

      {status === 'success' && currentWeather && (
        <View className="bg-white p-8 rounded-3xl shadow-sm mb-6 w-full max-w-sm items-center">
          <Text className="text-6xl font-bold text-weather-text">
            {Math.round(currentWeather.temp)}°C
          </Text>
          <Text className="text-lg text-weather-secondary mt-2">Zaktualizowano pomyślnie</Text>
        </View>
      )}

      {/* 
        Przycisk otwierający prognozę 7-dniową.
        Wykorzystuje router.push zamiast komponentu Link dla odmiany.
      */}
      <Pressable
        onPress={handleGoToForecast}
        className={`bg-weather-primary px-6 py-3 rounded-full active:opacity-80 mt-4 ${
          status !== 'success' ? 'opacity-50' : ''
        }`}
        disabled={status !== 'success'}
      >
        <Text className="text-white font-semibold text-base">Zobacz prognozę 7-dniową</Text>
      </Pressable>
    </View>
  );
}
