import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '@/constants/routes';
import type { ProfileStackParamList } from './types';

import ProfileScreen from '@/screens/profile/ProfileScreen';
import NotificationsScreen from '@/screens/profile/NotificationsScreen';
import SettingsScreen from '@/screens/profile/SettingsScreen';
import AddressesScreen from '@/screens/profile/AddressesScreen';
import ConditionsScreen from '@/screens/profile/ConditionsScreen';
import NotifPrefsScreen from '@/screens/profile/NotifPrefsScreen';
import DeleteAccountScreen from '@/screens/profile/DeleteAccountScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName={Routes.PROFILE}
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={Routes.PROFILE} component={ProfileScreen} />
    <Stack.Screen name={Routes.NOTIFICATIONS} component={NotificationsScreen} />
    <Stack.Screen name={Routes.SETTINGS} component={SettingsScreen} />
    <Stack.Screen name={Routes.ADDRESSES} component={AddressesScreen} />
    <Stack.Screen name={Routes.CONDITIONS} component={ConditionsScreen} />
    <Stack.Screen name={Routes.NOTIF_PREFS} component={NotifPrefsScreen} />
    <Stack.Screen name={Routes.DELETE_ACCOUNT} component={DeleteAccountScreen} />
  </Stack.Navigator>
);

export default ProfileStackNavigator;
