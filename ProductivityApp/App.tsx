import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FirebaseProvider, useFirebase } from './src/context/FirebaseContext';
import { TaskProvider } from './src/context/TaskContext';
import { ProjectProvider } from './src/context/ProjectContext';
import { theme } from './src/utils/theme';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { loading, error } = useFirebase();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <FirebaseProvider>
      <TaskProvider>
        <ProjectProvider>
          <NavigationContainer>
            <AppContent />
            <StatusBar style="light" />
          </NavigationContainer>
        </ProjectProvider>
      </TaskProvider>
    </FirebaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.danger,
    textAlign: 'center',
  },
});
