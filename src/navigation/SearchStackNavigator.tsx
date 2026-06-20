import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '@/constants/routes';
import type { SearchStackParamList } from './types';

import SearchScreen from '@/screens/search/SearchScreen';
import SearchSuggestionsScreen from '@/screens/search/SearchSuggestionsScreen';
import ResultsListScreen from '@/screens/search/ResultsListScreen';
import ResultsMapScreen from '@/screens/search/ResultsMapScreen';
import PharmacyDetailScreen from '@/screens/search/PharmacyDetailScreen';
import FullMapScreen from '@/screens/search/FullMapScreen';
import ReservationConfirmScreen from '@/screens/reservations/ReservationConfirmScreen';
import ReservationStatusScreen from '@/screens/reservations/ReservationStatusScreen';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStackNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName={Routes.SEARCH}
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={Routes.SEARCH} component={SearchScreen} />
    <Stack.Screen name={Routes.SEARCH_SUGGESTIONS} component={SearchSuggestionsScreen} />
    <Stack.Screen name={Routes.RESULTS_LIST} component={ResultsListScreen} />
    <Stack.Screen name={Routes.RESULTS_MAP} component={ResultsMapScreen} />
    <Stack.Screen name={Routes.PHARMACY_DETAIL} component={PharmacyDetailScreen} />
    <Stack.Screen name={Routes.FULL_MAP} component={FullMapScreen} />
    <Stack.Screen name={Routes.RSV_CONFIRM} component={ReservationConfirmScreen} />
    <Stack.Screen name={Routes.RSV_STATUS} component={ReservationStatusScreen} />
  </Stack.Navigator>
);

export default SearchStackNavigator;
