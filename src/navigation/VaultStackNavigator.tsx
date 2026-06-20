import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '@/constants/routes';
import type { VaultStackParamList } from './types';

import VaultScreen from '@/screens/vault/VaultScreen';
import VaultDetailScreen from '@/screens/vault/VaultDetailScreen';

const Stack = createNativeStackNavigator<VaultStackParamList>();

const VaultStackNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName={Routes.VAULT}
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={Routes.VAULT} component={VaultScreen} />
    <Stack.Screen name={Routes.VAULT_DETAIL} component={VaultDetailScreen} />
  </Stack.Navigator>
);

export default VaultStackNavigator;
