/**
 * SearchScreen.tsx — Figma: "Search"
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, ChevronLeft, RotateCcw, ArrowRight, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Routes } from '@/constants/routes';
import type { MainTabParamList, SearchStackParamList } from '@/navigation/types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { usePopularSearches } from '@/hooks/usePopularSearches';

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<SearchStackParamList, typeof Routes.SEARCH>,
  BottomTabNavigationProp<MainTabParamList>
>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const recentQuery = useRecentSearches();
  const popularQuery = usePopularSearches();

  const goSuggestions = (term: string) => {
    if (!term.trim()) return;
    navigation.navigate(Routes.SEARCH_SUGGESTIONS, { query: term.trim() });
  };

  const handleChange = (text: string) => {
    setQuery(text);
    if (text.length > 1) {
      goSuggestions(text);
    }
  };

  const recentSearches = recentQuery.data ?? [];
  const popularSearches = popularQuery.data ?? [];

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate(Routes.HOME_TAB)}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchRow}>
          <Search size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleChange}
            placeholder="Search medicines, brands..."
            placeholderTextColor={Colors.textMuted}
            returnKeyType="search"
            onSubmitEditing={() => goSuggestions(query)}
            autoFocus
          />
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.sectionLabel}>Recent</Text>
        {recentQuery.isLoading ? (
          <LoadingSpinner text="Loading..." />
        ) : recentSearches.length === 0 ? (
          <Text style={styles.emptyText}>No recent searches yet.</Text>
        ) : (
          recentSearches.map(term => (
            <TouchableOpacity key={term} style={styles.listItem} onPress={() => goSuggestions(term)}>
              <View style={styles.listIconGray}>
                <RotateCcw size={14} color={Colors.textMuted} />
              </View>
              <Text style={styles.listText}>{term}</Text>
              <ArrowRight size={14} color={Colors.gray300} />
            </TouchableOpacity>
          ))
        )}

        <Text style={[styles.sectionLabel, styles.sectionGap]}>Popular</Text>
        {popularQuery.isLoading ? (
          <LoadingSpinner text="Loading..." />
        ) : popularSearches.length === 0 ? (
          <Text style={styles.emptyText}>Popular searches will appear here.</Text>
        ) : (
          popularSearches.map(term => (
            <TouchableOpacity key={term} style={styles.listItem} onPress={() => goSuggestions(term)}>
              <View style={styles.listIconTeal}>
                <Zap size={14} color={Colors.primary} />
              </View>
              <Text style={styles.listText}>{term}</Text>
              <ArrowRight size={14} color={Colors.gray300} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 32, height: 32, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  searchRow: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gray100, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  sectionLabel: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  sectionGap: { marginTop: Spacing.xl },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.md },
  listItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.gray50,
  },
  listIconGray: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gray100,
    alignItems: 'center', justifyContent: 'center',
  },
  listIconTeal: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  listText: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary },
});

export default SearchScreen;
