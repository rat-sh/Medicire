/**
 * ProfileScreen.tsx — Figma: "Profile"
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  User, MapPin, Heart, Bell, Settings, Shield, Trash2, ChevronRight, LogOut,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';
import { useAuthStore } from '@/store/authStore';
import { capitalize } from '@/utils/formatters';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  const handleSignout = () => {
    logout();
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '—';
    if (phone.startsWith('+')) return phone;
    if (phone.length === 10) {
      return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  const conditionsSummary =
    user?.conditions?.length
      ? user.conditions.join(', ')
      : undefined;

  const addressCount = user?.savedAddresses?.length ?? 0;
  const addressSub =
    addressCount === 0
      ? undefined
      : `${addressCount} address${addressCount === 1 ? '' : 'es'}`;

  const menuItems: {
    icon: React.ComponentType<any>;
    label: string;
    sub?: string;
    route?: keyof ProfileStackParamList;
    destructive?: boolean;
  }[] = [
    { icon: MapPin, label: 'Saved Addresses', sub: addressSub, route: Routes.ADDRESSES },
    { icon: Heart, label: 'Chronic Conditions', sub: conditionsSummary, route: Routes.CONDITIONS },
    { icon: Bell, label: 'Notification Preferences', route: Routes.NOTIF_PREFS },
    { icon: Settings, label: 'Settings', route: Routes.SETTINGS },
    { icon: Shield, label: 'Privacy & Security', route: Routes.SETTINGS },
    { icon: Trash2, label: 'Delete Account', route: Routes.DELETE_ACCOUNT, destructive: true },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.heading}>My Profile</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User size={28} color={Colors.primary} />
          </View>
          <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
          <Text style={styles.phone}>{formatPhone(user?.phone)}</Text>
          {(user?.age || user?.gender) && (
            <View style={styles.pillRow}>
              {user.age != null && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{user.age} yrs</Text>
                </View>
              )}
              {user.gender && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{capitalize(user.gender)}</Text>
                </View>
              )}
            </View>
          )}
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menu}>
          {menuItems.map(({ icon: Icon, label, sub, route, destructive }) => (
            <TouchableOpacity
              key={label}
              style={styles.menuItem}
              onPress={() => route && navigation.navigate(route)}>
              <View style={[styles.menuIcon, destructive && styles.menuIconDestructive]}>
                <Icon size={16} color={destructive ? Colors.error : Colors.textSecondary} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuLabel, destructive && { color: Colors.error }]}>
                  {label}
                </Text>
                {sub ? <Text style={styles.menuSub} numberOfLines={1}>{sub}</Text> : null}
              </View>
              <ChevronRight size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signoutBtn} onPress={handleSignout}>
          <LogOut size={16} color={Colors.error} />
          <Text style={styles.signoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Medicire v{Config.APP_VERSION}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  body: { flex: 1 },
  bodyContent: { paddingBottom: 100 },
  avatarSection: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
  menuIcon: {
    width: 32, height: 32, backgroundColor: Colors.gray50, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
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
