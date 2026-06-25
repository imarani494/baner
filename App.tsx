/**

 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './src/store/AppContext';
import { NavigationProvider } from './src/navigation/NavigationContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppProvider>
        <NavigationProvider initialRoute="Splash">
          <RootNavigator />
        </NavigationProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
