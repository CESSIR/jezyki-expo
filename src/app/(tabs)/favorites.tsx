/**
 * @fileoverview Ekran ulubionych lokalizacji - Favorites Screen.
 *
 * Wyświetla zapisane lokalizacje z AsyncStorage.
 * Na ten moment jest to placeholder.
 */
import { Text, View } from 'react-native';

export default function FavoritesScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-weather-surface p-4">
      <Text className="text-2xl font-bold text-weather-primary-dark mb-4">
        ⭐ Ulubione Lokalizacje
      </Text>
      <Text className="text-base text-weather-secondary text-center">
        Docelowo tutaj znajdzie się lista zapisanych miast (pobrana z AsyncStorage).
      </Text>
    </View>
  );
}
