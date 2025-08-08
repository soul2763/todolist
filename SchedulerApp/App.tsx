/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { ScheduleProvider } from './src/context/ScheduleContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <PaperProvider>
      <ScheduleProvider>
        <AppNavigator />
      </ScheduleProvider>
    </PaperProvider>
  );
};

export default App;
