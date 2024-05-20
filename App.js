import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomePage from './src/views/Homepage';
import BusSearchResultPage from './src/views/BusSearchResultPage';
import BusRoutePage from './src/views/BusRoutePage';
import BusTimingPage from './src/views/BusTimingPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Bus Search Result" component={BusSearchResultPage} /> 
        <Stack.Screen name="Bus Route" component={BusRoutePage} />
        <Stack.Screen name="Bus Timing" component={BusTimingPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
