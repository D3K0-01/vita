import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import RoutineScreen from '../screens/routine/RoutineScreen';
import { FasesNavigator } from './FasesNavigator';
import { PartnersNavigator } from './PartnersNavigator';
import CommunityScreen from '../screens/community/CommunityScreen';
import ChatIA5a from '../screens/crisis/ChatIA5a';
import { BottomTabBar } from './BottomTabBar';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} />}>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="RotinaTab" component={RoutineScreen} />
      <Tab.Screen name="FasesTab" component={FasesNavigator} />
      <Tab.Screen name="ParceirosTab" component={PartnersNavigator} />
      <Tab.Screen name="ComunidadeTab" component={CommunityScreen} />
      <Tab.Screen name="IATab" component={ChatIA5a} />
    </Tab.Navigator>
  );
}
