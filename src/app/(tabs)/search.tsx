/**
 * @fileoverview Ekran wyszukiwarki - Search Screen.
 *
 * Pozwala użytkownikowi na ręczne wyszukanie miasta.
 * Na ten moment jest to placeholder.
 */
import { Text, View } from 'react-native';

export default function SearchScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-weather-surface p-4">
      <Text className="text-2xl font-bold text-weather-primary-dark mb-4">🔍 Wyszukaj Miasto</Text>
      <Text className="text-base text-weather-secondary text-center">
        Docelowo tutaj znajdzie się pole wyszukiwarki (TextInput) oraz wyniki z API geokodowania.
      </Text>
    </View>
  );
}
