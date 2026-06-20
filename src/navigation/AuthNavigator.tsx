import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '@/constants/routes';
import type { AuthStackParamList } from './types';

import SplashScreen from '@/screens/auth/SplashScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';
import OtpScreen from '@/screens/auth/OtpScreen';
import LocationPermScreen from '@/screens/auth/LocationPermScreen';
import ProfileSetupScreen from '@/screens/auth/ProfileSetupScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName={Routes.SPLASH}
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={Routes.SPLASH} component={SplashScreen} />
    <Stack.Screen name={Routes.LOGIN} component={LoginScreen} />
    <Stack.Screen name={Routes.SIGNUP} component={SignupScreen} />
    <Stack.Screen name={Routes.OTP} component={OtpScreen} />
    <Stack.Screen name={Routes.LOCATION_PERM} component={LocationPermScreen} />
    <Stack.Screen name={Routes.PROFILE_SETUP} component={ProfileSetupScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
