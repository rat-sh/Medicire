/**
 * SearchScreen.tsx
 * Figma: "Search" — empty state with search bar, recent searches, popular tags
 * Mock: Recent + popular searches from MOCK data
 * Real API: GET /medicines/recent, GET /medicines/popular
 * MOCK_MARKER: Replace MOCK arrays with useRecentSearches() hook
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
// ── MOCK_MARKER: Replace with useQuery(() => medicinesApi.getRecentSearches()) ──
import { MOCK_RECENT_SEARCHES, MOCK_POPULAR_SEARCHES } from '@/services/api/mock/medicines';
// ────────────────────────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<SearchStackParamList>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    navigation.navigate(Routes.SEARCH_SUGGESTIONS, { query: term });
  };

  const handleChange = (text: string) => {
    setQuery(text);
    if (text.length > 1) {
      navigation.navigate(Routes.SEARCH_SUGGESTIONS, { query: text });
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Find Medicines</Text>
        <Text style={styles.sub}>Search by name, brand, or salt</Text>
        {/* Search bar */}
        <View style={styles.searchRow}>
          <Search size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleChange}
            placeholder="e.g. Paracetamol, Metformin..."
            placeholderTextColor={Colors.textMuted}
            onSubmitEditing={() => handleSearch(query)}
            returnKeyType="search"
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Recent searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.sectionTitle}>Recent Searches</Text>
          </View>
          {/* MOCK_MARKER: Replace with real recent searches */}
          {MOCK_RECENT_SEARCHES.map((term) => (
            <TouchableOpacity
              key={term}
              style={styles.recentItem}
              onPress={() => handleSearch(term)}>
              <Text style={styles.recentText}>{term}</Text>
              <ArrowRight size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={14} color={Colors.textSecondary} />
            <Text style={styles.sectionTitle}>Popular Near You</Text>
          </View>
          <View style={styles.popularWrap}>
            {/* MOCK_MARKER: Replace with real popular searches */}
            {MOCK_POPULAR_SEARCHES.map((term) => (
              <Pressable
                key={term}
                style={styles.popularChip}
                onPress={() => handleSearch(term)}>
                <Text style={styles.popularChipText}>{term}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface, paddingTop: 48,
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2, marginBottom: Spacing.lg },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gray100, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.textPrimary },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.xl, paddingBottom: 100 },
  section: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  recentText: { fontSize: FontSize.base, color: Colors.textPrimary },
  popularWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  popularChip: {
    paddingHorizontal: Spacing.lg, paddingVertical: 8,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full,
  },
  popularChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
});

export default SearchScreen;
