/**
 * SettingsScreen.tsx
 * Figma: "Settings" — list of toggleable preferences, theme, language, about
 * Mock: Local state for toggles
 * Real API: PATCH /users/settings
 * MOCK_MARKER: Sync toggle state with real settings API
 */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/navigation/types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [locationTracking, setLocationTracking] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Privacy */}
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Location Tracking</Text>
              <Text style={styles.rowSub}>Used to find nearby pharmacies</Text>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              thumbColor={locationTracking ? Colors.primary : Colors.gray300}
              trackColor={{ true: Colors.primaryLight, false: Colors.gray200 }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Analytics</Text>
              <Text style={styles.rowSub}>Share anonymous usage data</Text>
            </View>
            <Switch
              value={analytics}
              onValueChange={setAnalytics}
              thumbColor={analytics ? Colors.primary : Colors.gray300}
              trackColor={{ true: Colors.primaryLight, false: Colors.gray200 }}
            />
          </View>
        </View>

        {/* Appearance */}
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Dark Mode</Text>
              <Text style={styles.rowSub}>Coming soon</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              disabled
              thumbColor={Colors.gray300}
              trackColor={{ true: Colors.primaryLight, false: Colors.gray200 }}
            />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Language</Text>
              <Text style={styles.rowSub}>English (India)</Text>
            </View>
            <ChevronRight size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Push Notifications</Text>
              <Text style={styles.rowSub}>Reservation updates, stock alerts</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              thumbColor={notifications ? Colors.primary : Colors.gray300}
              trackColor={{ true: Colors.primaryLight, false: Colors.gray200 }}
            />
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.group}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Terms of Service</Text>
            <ChevronRight size={16} color={Colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Privacy Policy</Text>
            <ChevronRight size={16} color={Colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  statusSpacer: { height: 44 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.sm, marginTop: Spacing.md },
  group: { backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  rowText: { flex: 1 },
  rowLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  rowSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  rowValue: { fontSize: FontSize.sm, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: Spacing.lg },
});

export default SettingsScreen;
