import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsHome8a from '../screens/settings/SettingsHome8a';
import ProfileHome from '../screens/settings/ProfileHome';
import Notifications8b from '../screens/settings/Notifications8b';
import Accessibility8c from '../screens/settings/Accessibility8c';
import { EditProfile, Security, TrustedContactEdit, EditChild, Privacy, Help, Support } from '../screens/settings/AccountScreens';
import { useApp } from '../state/AppContext';

const Stack = createNativeStackNavigator();

export function SettingsNavigator() {
  const { state } = useApp();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: state.prefs.noAnimations ? 'none' : 'default' }}>
      <Stack.Screen name="SettingsHome8a" component={SettingsHome8a} />
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
      <Stack.Screen name="Notifications8b" component={Notifications8b} />
      <Stack.Screen name="Accessibility8c" component={Accessibility8c} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Security" component={Security} />
      <Stack.Screen name="TrustedContactEdit" component={TrustedContactEdit} />
      <Stack.Screen name="EditChild" component={EditChild} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Support" component={Support} />
    </Stack.Navigator>
  );
}
