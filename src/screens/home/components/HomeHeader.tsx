/**
 * HomeHeader.tsx
 * Reusable top header for the Home screen containing greeting, search, and location.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, Search, MapPin } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';

interface HomeHeaderProps {
  greeting: string;
  firstName: string;
  city: string;
  insetsTop: number;
  onSearch: () => void;
  onNotifications: () => void;
  onChangeLocation: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  greeting,
  firstName,
  city,
  insetsTop,
  onSearch,
  onNotifications,
  onChangeLocation,
}) => {
  return (
    <View style={[styles.header, { paddingTop: insetsTop + Spacing.md }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.username} numberOfLines={1}>
            {firstName} 👋
          </Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={onNotifications}>
          <Bell size={20} color={Colors.textInverse} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.searchBar} onPress={onSearch}>
        <Search size={16} color={Colors.textMuted} />
        <Text style={styles.searchPlaceholder}>Search medicines, brands...</Text>
      </TouchableOpacity>

      <View style={styles.locationRow}>
        <MapPin size={12} color="rgba(255,255,255,0.7)" />
        <Text style={styles.locationText} numberOfLines={1}>
          {city}
        </Text>
        <TouchableOpacity onPress={onChangeLocation}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerTextWrap: { flex: 1, paddingRight: Spacing.md },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  username: { color: Colors.textInverse, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  bellBtn: {
    width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute', top: 2, right: 2, width: 8, height: 8,
    backgroundColor: '#f87171', borderRadius: 4, borderWidth: 1.5, borderColor: Colors.primary,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    ...Shadow.sm, marginBottom: Spacing.md,
  },
  searchPlaceholder: { color: Colors.textMuted, fontSize: FontSize.sm, flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.xs, flex: 1 },
  changeText: {
    color: Colors.textInverse, fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold, textDecorationLine: 'underline',
  },
});
