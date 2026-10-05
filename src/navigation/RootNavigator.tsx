import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabs } from './MainTabs';
import { CrisisNavigator } from './CrisisNavigator';
import { SettingsNavigator } from './SettingsNavigator';
import { TrackingNavigator } from './TrackingNavigator';
import { PlansNavigator } from './PlansNavigator';
import NewTask4d from '../screens/routine/NewTask4d';
import LockScreenReminder4e from '../screens/routine/LockScreenReminder4e';
import Breathing from '../screens/wellbeing/Breathing';
import Article from '../screens/community/Article';
import PostThread from '../screens/community/PostThread';
import GroupDetail from '../screens/community/GroupDetail';
import CrisisLog from '../screens/crisis/CrisisLog';
import CrisisDiary from '../screens/crisis/CrisisDiary';
import Professional from '../screens/plans/Professional';
import Companions from '../screens/plans/Companions';
import { useApp } from '../state/AppContext';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { state } = useApp();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: state.prefs.noAnimations ? 'none' : 'default' }}>
      {!state.hasOnboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="NewTask4d" component={NewTask4d} options={{ presentation: 'transparentModal', animation: 'fade' }} />
          <Stack.Screen name="LockScreenReminder4e" component={LockScreenReminder4e} options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="CrisisStack" component={CrisisNavigator} options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="SettingsStack" component={SettingsNavigator} options={{ presentation: 'card' }} />
          <Stack.Screen name="TrackingStack" component={TrackingNavigator} options={{ presentation: 'card' }} />
          <Stack.Screen name="PlansStack" component={PlansNavigator} options={{ presentation: 'card' }} />
          <Stack.Screen name="Breathing" component={Breathing} options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="Article" component={Article} />
          <Stack.Screen name="PostThread" component={PostThread} />
          <Stack.Screen name="GroupDetail" component={GroupDetail} />
          <Stack.Screen name="CrisisLog" component={CrisisLog} />
          <Stack.Screen name="CrisisDiary" component={CrisisDiary} />
          <Stack.Screen name="Professional" component={Professional} />
          <Stack.Screen name="Companions" component={Companions} />
        </>
      )}
    </Stack.Navigator>
  );
}
