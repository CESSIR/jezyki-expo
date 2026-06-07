/**
 * @fileoverview Testy jednostkowe dla globalnego sklepu pogodowego (Zustand).
 *
 * Weryfikacja logiki biznesowej zapewnia niezawodność i spełnia wymóg testowania (Kryterium 12).
 */
import { useWeatherStore } from '../weatherStore';

// Mock dla @react-native-community/netinfo (często powoduje problemy w testach RN)
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

// Mock dla @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('weatherStore', () => {
  const initialStoreState = useWeatherStore.getState();

  beforeEach(() => {
    // Resetowanie sklepu do czystego stanu przed każdym testem
    useWeatherStore.setState(initialStoreState, true);
  });

  // 1. Inicjalny stan
  it('powinien mieć poprawny stan początkowy', () => {
    const state = useWeatherStore.getState();
    expect(state.latitude).toBeNull();
    expect(state.longitude).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.favorites).toEqual([]);
    expect(state.isOffline).toBe(false);
  });

  // 2. Aktualizacja lokalizacji
  it('powinien poprawnie aktualizować pozycję GPS (setLocation)', () => {
    useWeatherStore.getState().setLocation(52.2297, 21.0122);
    const state = useWeatherStore.getState();
    expect(state.latitude).toBe(52.2297);
    expect(state.longitude).toBe(21.0122);
    expect(state.status).toBe('success');
    expect(state.errorMessage).toBeNull();
  });

  // 3. Aktualizacja statusu - błąd
  it('powinien poprawnie zapisywać komunikat o błędzie (setStatus)', () => {
    useWeatherStore.getState().setStatus('error', 'Odmowa GPS');
    const state = useWeatherStore.getState();
    expect(state.status).toBe('error');
    expect(state.errorMessage).toBe('Odmowa GPS');
  });

  // 4. Aktualizacja statusu - ładowanie
  it('powinien czyścić błąd przy ustawieniu statusu ładowania', () => {
    useWeatherStore.getState().setStatus('error', 'Stary błąd');
    useWeatherStore.getState().setStatus('loading');
    const state = useWeatherStore.getState();
    expect(state.status).toBe('loading');
    expect(state.errorMessage).toBeNull();
  });

  // 5. Dodawanie ulubionych
  it('powinien pozwalać na dodanie lokalizacji do ulubionych', async () => {
    const loc = { id: 'waw', name: 'Warszawa', lat: 52.2, lon: 21.0 };
    await useWeatherStore.getState().addFavorite(loc);
    expect(useWeatherStore.getState().favorites.length).toBe(1);
    expect(useWeatherStore.getState().favorites[0].name).toBe('Warszawa');
  });

  // 6. Duplikaty ulubionych
  it('nie powinien pozwalać na dodanie duplikatu do ulubionych', async () => {
    const loc = { id: 'waw', name: 'Warszawa', lat: 52.2, lon: 21.0 };
    await useWeatherStore.getState().addFavorite(loc);
    await useWeatherStore.getState().addFavorite(loc); // próba duplikacji
    expect(useWeatherStore.getState().favorites.length).toBe(1);
  });

  // 7. Usuwanie ulubionych
  it('powinien pozwalać na usunięcie lokalizacji z ulubionych po jej ID', async () => {
    const loc = { id: 'waw', name: 'Warszawa', lat: 52.2, lon: 21.0 };
    await useWeatherStore.getState().addFavorite(loc);
    await useWeatherStore.getState().removeFavorite('waw');
    expect(useWeatherStore.getState().favorites.length).toBe(0);
  });

  // 8. Odrzucenie usuwania nieistniejącego ulubionego
  it('nie powinien modyfikować listy, jeśli usuwamy nieistniejące ID', async () => {
    const loc = { id: 'waw', name: 'Warszawa', lat: 52.2, lon: 21.0 };
    await useWeatherStore.getState().addFavorite(loc);
    await useWeatherStore.getState().removeFavorite('krk'); // usuwanie braku wpisu
    expect(useWeatherStore.getState().favorites.length).toBe(1);
  });
});
