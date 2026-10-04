import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login2b from '../screens/onboarding/Login2b';
import WhoAreYou2c from '../screens/onboarding/WhoAreYou2c';
import AboutChild2d from '../screens/onboarding/AboutChild2d';
import Personalize2e from '../screens/onboarding/Personalize2e';
import TrustedContact2g from '../screens/onboarding/TrustedContact2g';
import PlansIntro2f from '../screens/onboarding/PlansIntro2f';

const Stack = createNativeStackNavigator();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login2b" component={Login2b} />
      <Stack.Screen name="WhoAreYou2c" component={WhoAreYou2c} />
      <Stack.Screen name="AboutChild2d" component={AboutChild2d} />
      <Stack.Screen name="Personalize2e" component={Personalize2e} />
      <Stack.Screen name="TrustedContact2g" component={TrustedContact2g} />
      <Stack.Screen name="PlansIntro2f" component={PlansIntro2f} />
    </Stack.Navigator>
  );
}
