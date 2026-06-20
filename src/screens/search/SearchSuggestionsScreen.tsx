/**
 * SearchSuggestionsScreen.tsx
 * Figma: "Search Suggestions" — live suggestions as user types, spinner
 * Mock: getMockSuggestions(query) with 200ms delay
 * Real API: GET /medicines/suggest?q={query}
 * MOCK_MARKER: Replace useQuery with real medicinesApi.getSuggestions(query)
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { X, Search, ArrowUpRight, Package } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';
import { getMockSuggestions } from '@/services/api/mock/medicines';
import type { MedicineSuggestion } from '@/types/medicine';

type Nav = NativeStackNavigationProp<SearchStackParamList>;
type RouteProps = RouteProp<SearchStackParamList, typeof Routes.SEARCH_SUGGESTIONS>;

const SearchSuggestionsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const [query, setQuery] = useState(route.params.query ?? '');
  const [suggestions, setSuggestions] = useState<MedicineSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      if (Config.USE_MOCK) {
        // ── MOCK_MARKER: Replace with medicinesApi.getSuggestions(query) ──────
        const results = getMockSuggestions(query);
        setSuggestions(results);
      }
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const handleSelect = (s: MedicineSuggestion) => {
    navigation.navigate(Routes.RESULTS_LIST, {
      medicineId: s.id,
      medicineName: s.brandName,
    });
  };

  return (
    <View style={styles.root}>
      {/* Search bar sticky header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <X size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchRow}>
          <Search size={16} color={Colors.primary} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search medicines..."
            placeholderTextColor={Colors.textMuted}
            autoFocus
            returnKeyType="search"
          />
          {loading && <ActivityIndicator size="small" color={Colors.primary} />}
        </View>
      </View>

      {/* Suggestions list */}
      <FlatList
        data={suggestions}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          query.length > 0 && !loading ? (
            <View style={styles.emptyState}>
              <Package size={36} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No medicines found</Text>
              <Text style={styles.emptySub}>Try a different name or check spelling</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.suggItem} onPress={() => handleSelect(item)}>
            <View style={styles.suggIcon}>
              <Package size={14} color={Colors.primary} />
            </View>
            <View style={styles.suggInfo}>
              <Text style={styles.suggName}>{item.brandName}</Text>
              <Text style={styles.suggGeneric}>{item.genericName}</Text>
            </View>
            <ArrowUpRight size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, paddingTop: 48,
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 32, height: 32, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  searchRow: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gray100, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderWidth: 2, borderColor: Colors.primary,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.textPrimary },
  list: { padding: Spacing.xl, paddingBottom: 100 },
  suggItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  suggIcon: {
    width: 32, height: 32, backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center',
  },
  suggInfo: { flex: 1 },
  suggName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  suggGeneric: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: Spacing.md },
  emptyTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  emptySub: { fontSize: FontSize.sm, color: Colors.textMuted },
});

export default SearchSuggestionsScreen;
