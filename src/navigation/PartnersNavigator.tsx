import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartnersList1a from '../screens/partners/PartnersList1a';
import Filters1b from '../screens/partners/Filters1b';
import PartnerDetail1c from '../screens/partners/PartnerDetail1c';
import CouponGenerated1d from '../screens/partners/CouponGenerated1d';
import PartnersMap1e from '../screens/partners/PartnersMap1e';
import PartnerReviews1f from '../screens/partners/PartnerReviews1f';
import BecomePartner1g from '../screens/partners/BecomePartner1g';
import MyCoupons1h from '../screens/partners/MyCoupons1h';
import NewReview from '../screens/partners/NewReview';
import { PartnerFiltersProvider } from '../state/PartnerFilters';

const Stack = createNativeStackNavigator();

export function PartnersNavigator() {
  return (
    <PartnerFiltersProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PartnersList1a" component={PartnersList1a} />
        <Stack.Screen name="Filters1b" component={Filters1b} options={{ presentation: 'modal' }} />
        <Stack.Screen name="PartnerDetail1c" component={PartnerDetail1c} />
        <Stack.Screen name="CouponGenerated1d" component={CouponGenerated1d} options={{ presentation: 'modal' }} />
        <Stack.Screen name="PartnersMap1e" component={PartnersMap1e} />
        <Stack.Screen name="PartnerReviews1f" component={PartnerReviews1f} />
        <Stack.Screen name="NewReview" component={NewReview} options={{ presentation: 'modal' }} />
        <Stack.Screen name="BecomePartner1g" component={BecomePartner1g} />
        <Stack.Screen name="MyCoupons1h" component={MyCoupons1h} />
      </Stack.Navigator>
    </PartnerFiltersProvider>
  );
}
