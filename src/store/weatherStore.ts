/**
 * @fileoverview Globalny stan pogody (Zustand).
 *
 * Używamy Zustand, aby spełnić kryterium posiadania stanu globalnego.
 * Umożliwia to współdzielenie danych GPS i pogody pomiędzy ekranami.
 */
import { create } from 'zustand';

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
}

interface WeatherState {
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;

  currentWeather: { temp: number; code: number } | null;
  forecastData: DailyForecast | null;

  setLocation: (lat: number, lon: number) => void;
  setCityName: (name: string) => void;
  setStatus: (status: 'idle' | 'loading' | 'success' | 'error', error?: string | null) => void;
  fetchWeatherData: (lat: number, lon: number) => Promise<void>;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  latitude: null,
  longitude: null,
  cityName: null,
  status: 'idle',
  errorMessage: null,

  currentWeather: null,
  forecastData: null,

  /** Aktualizuje współrzędne w stanie globalnym po udanym odczycie z GPS. */
  setLocation: (lat, lon) =>
    set({ latitude: lat, longitude: lon, status: 'success', errorMessage: null }),
  setCityName: (name) => set({ cityName: name }),
  /** Obsługuje widoczność loaderów i komunikatów o błędach. */
  setStatus: (status, error = null) => set({ status, errorMessage: error }),

  /**
   * Asynchronicznie pobiera dane o pogodzie przez HTTPS (kryterium bezpieczeństwa).
   * Zarządza bezpośrednio stanem ładowania i błędami.
   */
  fetchWeatherData: async (lat, lon) => {
    set({ status: 'loading', errorMessage: null });
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
      );

      if (!response.ok) throw new Error('Błąd API pogody');

      const data = await response.json();

      set({
        status: 'success',
        currentWeather: {
          temp: data.current.temperature_2m,
          code: data.current.weather_code,
        },
        forecastData: data.daily,
      });
    } catch {
      set({ status: 'error', errorMessage: 'Nie udało się pobrać pogody.' });
    }
  },
}));
