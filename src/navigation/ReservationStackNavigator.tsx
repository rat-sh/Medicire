import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '@/constants/routes';
import type { ReservationStackParamList } from './types';

import ReservationTrackerScreen from '@/screens/reservations/ReservationTrackerScreen';
import ReservationStatusScreen from '@/screens/reservations/ReservationStatusScreen';
import ReservationConfirmScreen from '@/screens/reservations/ReservationConfirmScreen';

const Stack = createNativeStackNavigator<ReservationStackParamList>();

const ReservationStackNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName={Routes.RSV_TRACKER}
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={Routes.RSV_TRACKER} component={ReservationTrackerScreen} />
    <Stack.Screen name={Routes.RSV_CONFIRM} component={ReservationConfirmScreen} />
    <Stack.Screen name={Routes.RSV_STATUS} component={ReservationStatusScreen} />
  </Stack.Navigator>
);

export default ReservationStackNavigator;
