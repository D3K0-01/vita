import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrilhasList6a from '../screens/phases/TrilhasList6a';
import TrilhaDetail6b from '../screens/phases/TrilhaDetail6b';
import RegisterAttempt6c from '../screens/phases/RegisterAttempt6c';
import Celebration6c2 from '../screens/phases/Celebration6c2';
import NotYet6d from '../screens/phases/NotYet6d';

const Stack = createNativeStackNavigator();

export function FasesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrilhasList6a" component={TrilhasList6a} />
      <Stack.Screen name="TrilhaDetail6b" component={TrilhaDetail6b} />
      <Stack.Screen name="RegisterAttempt6c" component={RegisterAttempt6c} options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="Celebration6c2" component={Celebration6c2} />
      <Stack.Screen name="NotYet6d" component={NotYet6d} />
    </Stack.Navigator>
  );
}
