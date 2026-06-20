import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '@/constants/routes';
import type { RxStackParamList } from './types';

import RxUploadScreen from '@/screens/prescription/RxUploadScreen';
import RxCropScreen from '@/screens/prescription/RxCropScreen';
import RxProgressScreen from '@/screens/prescription/RxProgressScreen';
import RxOcrScreen from '@/screens/prescription/RxOcrScreen';
import RxReviewScreen from '@/screens/prescription/RxReviewScreen';
import RxResultsScreen from '@/screens/prescription/RxResultsScreen';
import RxCompareScreen from '@/screens/prescription/RxCompareScreen';

const Stack = createNativeStackNavigator<RxStackParamList>();

const RxStackNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName={Routes.RX_UPLOAD}
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={Routes.RX_UPLOAD} component={RxUploadScreen} />
    <Stack.Screen name={Routes.RX_CROP} component={RxCropScreen} />
    <Stack.Screen name={Routes.RX_PROGRESS} component={RxProgressScreen} />
    <Stack.Screen name={Routes.RX_OCR} component={RxOcrScreen} />
    <Stack.Screen name={Routes.RX_REVIEW} component={RxReviewScreen} />
    <Stack.Screen name={Routes.RX_RESULTS} component={RxResultsScreen} />
    <Stack.Screen name={Routes.RX_COMPARE} component={RxCompareScreen} />
  </Stack.Navigator>
);

export default RxStackNavigator;
