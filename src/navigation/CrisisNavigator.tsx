import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Triage5b from '../screens/crisis/Triage5b';
import StepGuide5c from '../screens/crisis/StepGuide5c';
import Safety5d from '../screens/crisis/Safety5d';
import Resume5e from '../screens/crisis/Resume5e';

const Stack = createNativeStackNavigator();

// Presented fullScreenModal from the root navigator. Entry screen depends on
// whether a crisis session was left mid-step (see SOSButton / ChatIA5a).
export function CrisisNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Triage5b" component={Triage5b} />
      <Stack.Screen name="StepGuide5c" component={StepGuide5c} />
      <Stack.Screen name="Safety5d" component={Safety5d} />
      <Stack.Screen name="Resume5e" component={Resume5e} />
    </Stack.Navigator>
  );
}
