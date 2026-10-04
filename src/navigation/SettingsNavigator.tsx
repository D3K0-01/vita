import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsHome8a from '../screens/settings/SettingsHome8a';
import Notifications8b from '../screens/settings/Notifications8b';
import Accessibility8c from '../screens/settings/Accessibility8c';

const Stack = createNativeStackNavigator();

export function SettingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome8a" component={SettingsHome8a} />
      <Stack.Screen name="Notifications8b" component={Notifications8b} />
      <Stack.Screen name="Accessibility8c" component={Accessibility8c} />
    </Stack.Navigator>
  );
}
