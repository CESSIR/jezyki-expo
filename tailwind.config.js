/**
 * @fileoverview Konfiguracja Tailwind CSS dla NativeWind.
 *
 * Mapuje klasy Tailwind na style React Native.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * Ścieżki do plików, które Tailwind ma skanować w poszukiwaniu klas.
   */
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  /**
   * Preset NativeWind dostosowuje Tailwind do React Native.
   */
  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      /**
       * Niestandardowa paleta kolorów WeatherNow zgrana z theme.ts.
       */
      colors: {
        weather: {
          primary: '#208AEF',
          'primary-dark': '#1A6FBF',
          secondary: '#60646C',
          surface: '#F0F0F3',
          'surface-dark': '#212225',
          'surface-selected': '#E0E1E6',
          'surface-selected-dark': '#2E3135',
        },
      },
    },
  },

  plugins: [],
};
