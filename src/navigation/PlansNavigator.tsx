import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlansScreen from '../screens/plans/PlansScreen';
import Checkout10c from '../screens/plans/Checkout10c';

const Stack = createNativeStackNavigator();

export function PlansNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlansHome10" component={PlansScreen} />
      <Stack.Screen name="Checkout10c" component={Checkout10c} />
    </Stack.Navigator>
  );
}
