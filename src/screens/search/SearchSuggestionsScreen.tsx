/**
 * SearchSuggestionsScreen.tsx — Figma: "Search Suggestions"
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { X, Search, ArrowUpRight, Package, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { medicinesApi } from '@/services/api/medicines';
import type { MedicineSuggestion } from '@/types/medicine';
import { Button } from '@/components/ui/Button';

type Nav = NativeStackNavigationProp<SearchStackParamList>;
type RouteProps = RouteProp<SearchStackParamList, typeof Routes.SEARCH_SUGGESTIONS>;

const SearchSuggestionsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(route.params.query ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const suggestionsQuery = useQuery({
    queryKey: ['medicines', 'suggest', debouncedQuery],
    queryFn: () => medicinesApi.getSuggestions(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
  });

  const suggestions = suggestionsQuery.data ?? [];
  const loading = suggestionsQuery.isFetching;
  const showEmpty = debouncedQuery.trim().length >= 2 && !loading && suggestions.length === 0;

  const handleSelect = (s: MedicineSuggestion) => {
    navigation.navigate(Routes.RESULTS_LIST, {
      medicineId: s.id,
      medicineName: s.brandName,
    });
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
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

      {suggestionsQuery.isError ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorTitle}>Could not load suggestions</Text>
          <Button
            title="Try again"
            onPress={() => suggestionsQuery.refetch()}
            icon={RefreshCw}
            variant="outline"
          />
        </View>
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            showEmpty ? (
              <View style={styles.emptyState}>
                <Package size={36} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No medicines found</Text>
                <Text style={styles.emptySub}>Try a different name or check spelling</Text>
              </View>
            ) : debouncedQuery.trim().length < 2 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptySub}>Type at least 2 characters to search</Text>
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface,
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
  emptySub: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  errorWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.xl, gap: Spacing.lg,
  },
  errorTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
});

export default SearchSuggestionsScreen;
