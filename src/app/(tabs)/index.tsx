/**
 * @fileoverview Ekran główny - Aktualna pogoda.
 *
 * Implementuje wizualną informację o trybie offline oraz zarządzanie ulubionymi,
 * demonstrując integrację ze sklepem Zustand i trwałym AsyncStorage.
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
    isOffline,
    favorites,
    setStatus,
    setLocation,
    fetchWeatherData,
    loadFavorites,
    addFavorite,
    removeFavorite,
  } = useWeatherStore();
  const router = useRouter();

  useEffect(() => {
    /** Inicjalizuje asynchroniczne dane sklepowe i lokalizację na starcie. */
    const initApp = async () => {
      await loadFavorites();
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

        await fetchWeatherData(lat, lon);
      } catch {
        setStatus('error', 'Nie udało się pobrać lokalizacji GPS');
      }
    };

    initApp();
  }, [setLocation, setStatus, fetchWeatherData, loadFavorites]);

  const handleGoToForecast = () => {
    if (latitude && longitude) {
      router.push({
        pathname: '/forecast',
        params: { lat: latitude.toString(), lon: longitude.toString(), cityName: 'GPS' },
      });
    }
  };

  const isCurrentFavorite = favorites.some((f) => f.id === 'gps-current');

  const toggleFavorite = () => {
    if (isCurrentFavorite) {
      removeFavorite('gps-current');
    } else if (latitude && longitude) {
      addFavorite({ id: 'gps-current', name: 'Moja lokalizacja', lat: latitude, lon: longitude });
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-weather-surface p-4">
      <Text className="text-3xl font-bold text-weather-primary-dark mb-4">📍 Twoja Pogoda</Text>

      {isOffline && (
        <View className="bg-yellow-100 p-3 rounded-lg mb-4 w-full max-w-sm border border-yellow-300">
          <Text className="text-yellow-800 text-center font-semibold text-sm">
            Tryb offline - wyświetlam dane archiwalne
          </Text>
        </View>
      )}

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
          <Text className="text-lg text-weather-secondary mt-2 mb-4">Zaktualizowano pomyślnie</Text>
          <Pressable
            onPress={toggleFavorite}
            className={`px-4 py-2 rounded-full border ${
              isCurrentFavorite
                ? 'bg-weather-surface-selected border-weather-secondary'
                : 'bg-transparent border-weather-primary'
            }`}
          >
            <Text
              className={`font-semibold ${
                isCurrentFavorite ? 'text-weather-text' : 'text-weather-primary'
              }`}
            >
              {isCurrentFavorite ? '★ Usuń z ulubionych' : '☆ Dodaj do ulubionych'}
            </Text>
          </Pressable>
        </View>
      )}

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
