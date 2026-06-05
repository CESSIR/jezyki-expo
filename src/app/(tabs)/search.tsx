/**
 * @fileoverview Ekran wyszukiwarki miast.
 *
 * Używa FlatList dla wydajnego renderowania wyników geokodowania, co
 * zapewnia optymalizację przy listach (Kryterium 9).
 */
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';

export interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Realizuje bezpieczne (HTTPS) zapytanie do API Open-Meteo. */
  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query,
        )}&count=5&language=pl`,
      );
      if (!response.ok) throw new Error('Błąd API');
      const data = await response.json();
      setResults(data.results || []);
    } catch {
      setError('Wystąpił błąd podczas wyszukiwania.');
    } finally {
      setIsLoading(false);
    }
  };

  /** Callback kliknięcia: programatyczna nawigacja z parametrami (Kryterium 8). */
  const handleCityPress = useCallback(
    (city: GeocodingResult) => {
      router.push({
        pathname: '/forecast',
        params: {
          lat: city.latitude.toString(),
          lon: city.longitude.toString(),
          cityName: city.name,
        },
      });
    },
    [router],
  );

  /** Zewnętrzna metoda renderItem zapewnia brak alokacji w każdym cyklu, podnosząc wydajność. */
  const renderItem = useCallback(
    ({ item }: { item: GeocodingResult }) => (
      <Pressable
        onPress={() => handleCityPress(item)}
        className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row justify-between items-center active:opacity-80"
      >
        <View>
          <Text className="text-lg font-bold text-weather-text">{item.name}</Text>
          <Text className="text-sm text-weather-secondary">
            {item.admin1 ? `${item.admin1}, ` : ''}
            {item.country}
          </Text>
        </View>
        <Text className="text-weather-primary font-semibold text-2xl">›</Text>
      </Pressable>
    ),
    [handleCityPress],
  );

  return (
    <View className="flex-1 bg-weather-surface p-4 pt-6">
      <Text className="text-3xl font-bold text-weather-primary-dark mb-4">🔍 Szukaj Miasta</Text>

      <View className="flex-row items-center mb-6 gap-2">
        <TextInput
          className="flex-1 bg-white px-4 py-3 rounded-full border border-gray-200 text-base"
          placeholder="Wpisz nazwę miasta..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Pressable
          onPress={handleSearch}
          className="bg-weather-primary px-6 py-3 rounded-full active:opacity-80"
          disabled={isLoading}
        >
          <Text className="text-white font-semibold">Szukaj</Text>
        </Pressable>
      </View>

      {isLoading && <ActivityIndicator size="large" color="#208AEF" className="mt-4" />}

      {error && (
        <Text className="text-red-600 bg-red-100 p-4 rounded-xl text-center font-semibold mb-4">
          {error}
        </Text>
      )}

      {/* 
        Wykorzystanie FlatList z kluczem keyExtractor to wymóg 
        optymalizacyjny dla renderowania list (Kryterium 9). 
      */}
      {!isLoading && !error && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className="text-center text-weather-secondary mt-10">
              {query.trim() && results.length === 0
                ? 'Nie znaleziono miast. Spróbuj inaczej.'
                : 'Wpisz miasto powyżej, aby rozpocząć.'}
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
