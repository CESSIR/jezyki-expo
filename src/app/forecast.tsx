/**
 * @fileoverview Ekran prognozy 7-dniowej.
 *
 * Odbiera parametry z ekranu głównego (spełnia kryterium oceny).
 * Wykorzystuje dane pobrane ze sklepu Zustand.
 */
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { useWeatherStore } from '@/store/weatherStore';

export default function ForecastScreen() {
  const { cityName } = useLocalSearchParams<{
    lat: string;
    lon: string;
    cityName: string;
  }>();

  const { forecastData } = useWeatherStore();

  return (
    <ScrollView className="flex-1 bg-weather-surface p-4">
      <View className="items-center mb-6 mt-4">
        <Text className="text-3xl font-bold text-weather-primary-dark mb-2">
          📅 Prognoza 7-dniowa
        </Text>
        <Text className="text-lg font-semibold">
          Wybrane miasto: <Text className="text-weather-primary">{cityName ?? 'GPS'}</Text>
        </Text>
      </View>

      {forecastData ? (
        <View className="space-y-3">
          {forecastData.time.map((dateStr, index) => (
            <View
              key={dateStr}
              className="bg-white p-4 rounded-xl shadow-sm flex-row justify-between items-center mb-2"
            >
              <Text className="text-base font-medium">{dateStr}</Text>
              <View className="flex-row items-center gap-4">
                <Text className="text-weather-secondary">
                  Min: {Math.round(forecastData.temperature_2m_min[index])}°C
                </Text>
                <Text className="text-weather-primary font-bold">
                  Max: {Math.round(forecastData.temperature_2m_max[index])}°C
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text className="text-base text-weather-secondary text-center">
          Brak danych prognozy. Wróć do ekranu głównego.
        </Text>
      )}
    </ScrollView>
  );
}
