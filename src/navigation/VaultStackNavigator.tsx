import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '@/constants/routes';
import type { VaultStackParamList } from './types';

import VaultScreen from '@/screens/vault/VaultScreen';
import VaultDetailScreen from '@/screens/vault/VaultDetailScreen';
import RxUploadScreen from '@/screens/prescription/RxUploadScreen';
import RxCropScreen from '@/screens/prescription/RxCropScreen';
import RxProgressScreen from '@/screens/prescription/RxProgressScreen';
import RxOcrScreen from '@/screens/prescription/RxOcrScreen';
import RxReviewScreen from '@/screens/prescription/RxReviewScreen';
import RxResultsScreen from '@/screens/prescription/RxResultsScreen';
import RxCompareScreen from '@/screens/prescription/RxCompareScreen';
import ReservationConfirmScreen from '@/screens/reservations/ReservationConfirmScreen';
import ReservationStatusScreen from '@/screens/reservations/ReservationStatusScreen';

const Stack = createNativeStackNavigator<VaultStackParamList>();

const VaultStackNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName={Routes.VAULT}
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={Routes.VAULT} component={VaultScreen} />
    <Stack.Screen name={Routes.VAULT_DETAIL} component={VaultDetailScreen} />
    <Stack.Screen name={Routes.RX_UPLOAD} component={RxUploadScreen} />
    <Stack.Screen name={Routes.RX_CROP} component={RxCropScreen} />
    <Stack.Screen name={Routes.RX_PROGRESS} component={RxProgressScreen} />
    <Stack.Screen name={Routes.RX_OCR} component={RxOcrScreen} />
    <Stack.Screen name={Routes.RX_REVIEW} component={RxReviewScreen} />
    <Stack.Screen name={Routes.RX_RESULTS} component={RxResultsScreen} />
    <Stack.Screen name={Routes.RX_COMPARE} component={RxCompareScreen} />
    <Stack.Screen name={Routes.RSV_CONFIRM} component={ReservationConfirmScreen} />
    <Stack.Screen name={Routes.RSV_STATUS}  component={ReservationStatusScreen} />
  </Stack.Navigator>
);

export default VaultStackNavigator;
