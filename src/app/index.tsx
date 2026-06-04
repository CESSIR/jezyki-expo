/**
 * @fileoverview Home screen — entry point of WeatherNow.
 *
 * WHY a simple placeholder? This is the project initialization phase (setup/project-init).
 * The actual weather UI, API integration, and navigation structure will be built
 * in subsequent feature branches. This screen serves as a smoke test to verify
 * that the Expo SDK 54 project runs correctly in Expo Go.
 */
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>☀️ WeatherNow</Text>
      <Text style={styles.subtitle}>Twoja prognoza pogody</Text>
      <Text style={styles.info}>Expo SDK 54 • React Native 0.81</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  info: {
    fontSize: 12,
    color: '#999',
  },
});
