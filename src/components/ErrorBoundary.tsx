/**
 * @fileoverview Komponent przechwytujący nieoczekiwane błędy (Error Boundary).
 *
 * Zapobiega awariom całej aplikacji, serwując bezpieczny ekran błędu (Kryterium 4).
 */
import React, { Component, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMsg: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // W profesjonalnych aplikacjach tu trafia logowanie do Sentry lub Crashlytics.
    console.warn('ErrorBoundary przechwycił krytyczny błąd:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, errorMsg: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-weather-surface items-center justify-center p-6">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-2xl font-bold text-weather-text text-center mb-2">
            Coś poszło nie tak
          </Text>
          <Text className="text-weather-secondary text-center mb-8">
            Wystąpił nieoczekiwany błąd aplikacji. {this.state.errorMsg}
          </Text>
          <Pressable
            onPress={this.resetError}
            className="bg-weather-primary px-6 py-3 rounded-full active:opacity-80"
          >
            <Text className="text-white font-semibold text-base">Spróbuj ponownie</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
