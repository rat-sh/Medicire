import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, FileText, Package, User } from 'lucide-react-native';
import { Routes } from '@/constants/routes';
import type { MainTabParamList } from './types';

import HomeScreen from '@/screens/home/HomeScreen';
import SearchStackNavigator from './SearchStackNavigator';
import VaultStackNavigator from './VaultStackNavigator';
import ReservationStackNavigator from './ReservationStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

import { BottomNav } from '@/components/navigation/BottomNav';

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderHomeIcon = ({ color, size }: { color: string; size: number }) => <Home color={color} size={size} />;
const renderSearchIcon = ({ color, size }: { color: string; size: number }) => <Search color={color} size={size} />;
const renderVaultIcon = ({ color, size }: { color: string; size: number }) => <FileText color={color} size={size} />;
const renderOrdersIcon = ({ color, size }: { color: string; size: number }) => <Package color={color} size={size} />;
const renderProfileIcon = ({ color, size }: { color: string; size: number }) => <User color={color} size={size} />;
const renderTabBar = (props: any) => <BottomNav {...props} />;

const MainNavigator: React.FC = () => (
  <Tab.Navigator
    tabBar={renderTabBar}
    screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name={Routes.HOME_TAB}
      component={HomeScreen}
      options={{ tabBarLabel: 'Home', tabBarIcon: renderHomeIcon }}
    />
    <Tab.Screen
      name={Routes.SEARCH_TAB}
      component={SearchStackNavigator}
      options={{ tabBarLabel: 'Search', tabBarIcon: renderSearchIcon }}
    />
    <Tab.Screen
      name={Routes.VAULT_TAB}
      component={VaultStackNavigator}
      options={{ tabBarLabel: 'Vault', tabBarIcon: renderVaultIcon }}
    />
    <Tab.Screen
      name={Routes.RESERVATIONS_TAB}
      component={ReservationStackNavigator}
      options={{ tabBarLabel: 'Orders', tabBarIcon: renderOrdersIcon }}
    />
    <Tab.Screen
      name={Routes.PROFILE_TAB}
      component={ProfileStackNavigator}
      options={{ tabBarLabel: 'Profile', tabBarIcon: renderProfileIcon }}
    />
  </Tab.Navigator>
);

export default MainNavigator;
