import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './providers/AppProvider';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
          translucent
          backgroundColor="transparent"
        />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
