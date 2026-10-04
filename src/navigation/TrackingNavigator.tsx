import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackingScreen from '../screens/tracking/TrackingScreen';

const Stack = createNativeStackNavigator();

export function TrackingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrackingHome9" component={TrackingScreen} />
    </Stack.Navigator>
  );
}
