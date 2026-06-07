/**
 * @fileoverview Ekran ulubionych lokalizacji.
 *
 * Pobiera i wyświetla listę z Zustand.
 * Stan jest persystentny (AsyncStorage), co spełnia wymóg przechowywania lokalnego.
 */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useWeatherStore } from '@/store/weatherStore';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, removeFavorite } = useWeatherStore();

  return (
    <ScrollView className="flex-1 bg-weather-surface p-4">
      <Text className="text-2xl font-bold text-weather-primary-dark mb-4 text-center mt-4">
        ⭐ Ulubione Lokalizacje
      </Text>

      {favorites.length === 0 ? (
        <Text className="text-base text-weather-secondary text-center mt-10">
          Brak ulubionych lokalizacji. Zapisz coś na głównym ekranie!
        </Text>
      ) : (
        <View className="space-y-3">
          {favorites.map((fav) => (
            <Pressable
              key={fav.id}
              onPress={() =>
                router.push({
                  pathname: '/forecast',
                  params: {
                    lat: fav.lat.toString(),
                    lon: fav.lon.toString(),
                    cityName: fav.name,
                  },
                })
              }
              className="bg-white p-4 rounded-xl shadow-sm flex-row justify-between items-center mb-3 active:opacity-80"
            >
              <View className="flex-1">
                <Text className="text-lg font-semibold text-weather-text">{fav.name}</Text>
                <Text className="text-sm text-weather-secondary">
                  GPS: {fav.lat.toFixed(2)}, {fav.lon.toFixed(2)}
                </Text>
              </View>
              <Pressable
                onPress={() => removeFavorite(fav.id)}
                className="bg-red-100 px-3 py-2 rounded-lg ml-2"
              >
                <Text className="text-red-600 font-medium text-sm">Usuń</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
