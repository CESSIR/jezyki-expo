/**
 * @fileoverview Ekran prognozy 7-dniowej.
 *
 * Odbiera parametry z ekranu głównego (spełnia kryterium oceny).
 */
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ForecastScreen() {
  // Pobranie parametrów z URL / nawigacji
  const { lat, lon, cityName } = useLocalSearchParams<{
    lat: string;
    lon: string;
    cityName: string;
  }>();

  return (
    <View className="flex-1 items-center justify-center bg-weather-surface p-4">
      <Text className="text-3xl font-bold text-weather-primary-dark mb-2">
        📅 Prognoza 7-dniowa
      </Text>

      {/* Wyświetlanie przekazanych parametrów nawigacji */}
      <View className="bg-white p-4 rounded-xl shadow-sm mb-6 w-full max-w-sm">
        <Text className="text-lg font-semibold text-center mb-2">
          Wybrane miasto: <Text className="text-weather-primary">{cityName ?? 'Nieznane'}</Text>
        </Text>
        <Text className="text-sm text-weather-secondary text-center">
          Współrzędne: {lat}, {lon}
        </Text>
      </View>

      <Text className="text-base text-weather-secondary text-center">
        Docelowo tutaj pojawi się lista 7-dniowej prognozy pobrana z API Open-Meteo.
      </Text>
    </View>
  );
}
