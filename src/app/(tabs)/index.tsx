/**
 * @fileoverview Ekran główny - Aktualna pogoda.
 *
 * Wykorzystuje klasy Tailwind (NativeWind) do stylowania.
 */
import { Link } from 'expo-router';
import { Text, View, Pressable } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-weather-surface p-4">
      <Text className="text-3xl font-bold text-weather-primary-dark mb-2">
        📍 Obecna lokalizacja
      </Text>
      <Text className="text-lg text-weather-secondary text-center mb-8">
        Docelowo tutaj znajdzie się aktualna pogoda pobrana na podstawie GPS użytkownika.
      </Text>

      {/* 
        Przycisk otwierający prognozę 7-dniową.
        Przekazuje parametry (wymagane w kryteriach).
      */}
      <Link
        href={{
          pathname: '/forecast',
          params: { lat: '52.2297', lon: '21.0122', cityName: 'Warszawa' },
        }}
        asChild
      >
        <Pressable className="bg-weather-primary px-6 py-3 rounded-full active:opacity-80">
          <Text className="text-white font-semibold text-base">Zobacz prognozę 7-dniową</Text>
        </Pressable>
      </Link>
    </View>
  );
}
