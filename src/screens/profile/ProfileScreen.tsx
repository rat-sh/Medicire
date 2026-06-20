/**
 * ProfileScreen.tsx
 * Figma: "Profile" — avatar, name, phone, list of account menu items with chevrons,
 *        signout button at bottom
 * Mock: Hardcoded user data
 * Real API: GET /users/profile
 * MOCK_MARKER: Replace MOCK_USER with useQuery(() => usersApi.getProfile())
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  User, MapPin, Heart, Bell, Settings, Shield, Trash2, ChevronRight, LogOut,
} from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: 'Arjun Sharma',
  phone: '+91 98765 43210',
  email: 'arjun.sharma@example.com',
  age: 32,
  gender: 'Male',
};
// ─────────────────────────────────────────────────────────────────────────────

const MENU_ITEMS: {
  icon: React.ComponentType<any>;
  label: string;
  sub?: string;
  route?: string;
  destructive?: boolean;
}[] = [
  { icon: MapPin, label: 'Saved Addresses', sub: '2 addresses', route: Routes.ADDRESSES },
  { icon: Heart, label: 'Chronic Conditions', sub: 'Diabetes, Hypertension', route: Routes.CONDITIONS },
  { icon: Bell, label: 'Notification Preferences', route: Routes.NOTIF_PREFS },
  { icon: Settings, label: 'Settings', route: Routes.SETTINGS },
  { icon: Shield, label: 'Privacy & Security', route: Routes.SETTINGS },
  { icon: Trash2, label: 'Delete Account', route: Routes.DELETE_ACCOUNT, destructive: true },
];

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const handleSignout = () => {
    if (Config.USE_MOCK) {
      // ── MOCK_MARKER: Clear auth store when backend is ready ───────────────
      navigation.navigate(Routes.LOGIN as any);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <View style={styles.statusSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>My Profile</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Avatar + info */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User size={28} color={Colors.primary} />
          </View>
          <Text style={styles.name}>{MOCK_USER.name}</Text>
          <Text style={styles.phone}>{MOCK_USER.phone}</Text>
          <View style={styles.pillRow}>
            <View style={styles.pill}><Text style={styles.pillText}>{MOCK_USER.age} yrs</Text></View>
            <View style={styles.pill}><Text style={styles.pillText}>{MOCK_USER.gender}</Text></View>
          </View>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        <View style={styles.menu}>
          {MENU_ITEMS.map(({ icon: Icon, label, sub, route, destructive }) => (
            <TouchableOpacity
              key={label}
              style={styles.menuItem}
              onPress={() => route && navigation.navigate(route as any)}>
              <View style={[styles.menuIcon, destructive && styles.menuIconDestructive]}>
                <Icon size={16} color={destructive ? Colors.error : Colors.textSecondary} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuLabel, destructive && { color: Colors.error }]}>{label}</Text>
                {sub && <Text style={styles.menuSub}>{sub}</Text>}
              </View>
              <ChevronRight size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Signout */}
        <TouchableOpacity style={styles.signoutBtn} onPress={handleSignout}>
          <LogOut size={16} color={Colors.error} />
          <Text style={styles.signoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Medicire v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  statusSpacer: { height: 44 },
  header: {
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  body: { flex: 1 },
  bodyContent: { paddingBottom: 100 },
  avatarSection: {
    alignItems: 'center', backgroundColor: Colors.surface,
    padding: Spacing.xl, marginBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
  },
  name: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  phone: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2, marginBottom: Spacing.sm },
  pillRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  pill: {
    paddingHorizontal: Spacing.md, paddingVertical: 4,
    backgroundColor: Colors.primaryLight, borderRadius: Radius.full,
  },
  pillText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.primary },
  editProfileBtn: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl, paddingVertical: 8,
  },
  editProfileText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  menu: { backgroundColor: Colors.surface, marginBottom: Spacing.sm },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  menuIcon: { width: 32, height: 32, backgroundColor: Colors.gray50, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  menuIconDestructive: { backgroundColor: Colors.errorLight },
  menuText: { flex: 1 },
  menuLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  menuSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  signoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.surface,
    margin: Spacing.lg, borderWidth: 1, borderColor: Colors.error,
    borderRadius: Radius.md, paddingVertical: 12,
  },
  signoutText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.error },
  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted },
});

export default ProfileScreen;
