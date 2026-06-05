/**
 * @fileoverview Ekran główny - Aktualna pogoda.
 *
 * Obsługujemy uprawnienia GPS (kryterium walidacji uprawnień).
 * Wynik zapisujemy do sklepu Zustand.
 */
import * as Location from 'expo-location';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useWeatherStore } from '@/store/weatherStore';

export default function HomeScreen() {
  const { latitude, longitude, status, errorMessage, setStatus, setLocation } = useWeatherStore();

  useEffect(() => {
    /** Pobiera lokalizację przy starcie i zapisuje wynik do sklepu. */
    const fetchLocation = async () => {
      setStatus('loading');
      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

      if (permissionStatus !== 'granted') {
        setStatus('error', 'Odmowa dostępu do lokalizacji');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords.latitude, location.coords.longitude);
      } catch (_error) {
        setStatus('error', 'Nie udało się pobrać lokalizacji GPS');
      }
    };

    fetchLocation();
  }, [setLocation, setStatus]);

  return (
    <View className="flex-1 items-center justify-center bg-weather-surface p-4">
      <Text className="text-3xl font-bold text-weather-primary-dark mb-4">📍 Twoja Pogoda</Text>

      {status === 'loading' && (
        <View className="items-center mb-6">
          <ActivityIndicator size="large" color="#208AEF" />
          <Text className="text-weather-secondary mt-2">Pobieranie lokalizacji...</Text>
        </View>
      )}

      {status === 'error' && (
        <View className="bg-red-100 p-4 rounded-xl mb-6 w-full max-w-sm">
          <Text className="text-red-600 font-semibold text-center">{errorMessage}</Text>
        </View>
      )}

      {status === 'success' && (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6 w-full max-w-sm">
          <Text className="text-lg text-center mb-1 font-semibold text-weather-text">
            Pomyślnie pobrano pozycję GPS
          </Text>
          <Text className="text-sm text-weather-secondary text-center">
            {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
          </Text>
        </View>
      )}

      {/* 
        Przycisk otwierający prognozę 7-dniową.
        Przekazuje parametry GPS ze sklepu (spełnia kryterium parametrów nawigacji).
      */}
      <Link
        href={{
          pathname: '/forecast',
          params: {
            lat: latitude?.toString() ?? '',
            lon: longitude?.toString() ?? '',
            cityName: 'GPS',
          },
        }}
        asChild
      >
        <Pressable
          className={`bg-weather-primary px-6 py-3 rounded-full active:opacity-80 ${
            status !== 'success' ? 'opacity-50' : ''
          }`}
          disabled={status !== 'success'}
        >
          <Text className="text-white font-semibold text-base">Zobacz prognozę 7-dniową</Text>
        </Pressable>
      </Link>
    </View>
  );
}
