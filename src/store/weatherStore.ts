/**
 * @fileoverview Globalny stan pogody (Zustand).
 *
 * Używamy Zustand, aby spełnić kryterium posiadania stanu globalnego.
 * Umożliwia to współdzielenie danych GPS i statusu pobierania pomiędzy ekranami.
 */
import { create } from 'zustand';

interface WeatherState {
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
  setLocation: (lat: number, lon: number) => void;
  setCityName: (name: string) => void;
  setStatus: (status: 'idle' | 'loading' | 'success' | 'error', error?: string | null) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  latitude: null,
  longitude: null,
  cityName: null,
  status: 'idle',
  errorMessage: null,
  /** Aktualizuje współrzędne w stanie globalnym po udanym odczycie z GPS. */
  setLocation: (lat, lon) =>
    set({ latitude: lat, longitude: lon, status: 'success', errorMessage: null }),
  setCityName: (name) => set({ cityName: name }),
  /** Obsługuje widoczność loaderów i komunikatów o błędach. */
  setStatus: (status, error = null) => set({ status, errorMessage: error }),
}));
