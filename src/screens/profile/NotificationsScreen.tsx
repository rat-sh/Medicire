/**
 * NotificationsScreen.tsx
 * Figma: "Notifications" — notification items grouped by Today/Earlier,
 *        unread dot, mark-all-read button
 * Mock: Hardcoded notification list
 * Real API: GET /notifications
 * MOCK_MARKER: Replace MOCK_NOTIFS with notificationsApi.list()
 */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bell, Package, AlertTriangle, CheckCircle, Info } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

type NotifType = 'reservation' | 'medicine' | 'alert' | 'info';

// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
const MOCK_NOTIFS = [
  { id: 'n1', type: 'reservation' as NotifType, title: 'Reservation Confirmed!', body: 'Apollo Pharmacy confirmed your reservation for Paracetamol 500mg.', time: '5 min ago', unread: true, group: 'Today' },
  { id: 'n2', type: 'medicine' as NotifType, title: 'Medicine Now Available', body: 'Metformin 500mg is now in stock at MedPlus, Sector V.', time: '1 hr ago', unread: true, group: 'Today' },
  { id: 'n3', type: 'alert' as NotifType, title: 'Low Stock Alert', body: 'Atorvastatin 10mg is running low at your preferred pharmacy.', time: '3 hr ago', unread: false, group: 'Today' },
  { id: 'n4', type: 'reservation' as NotifType, title: 'Pickup Reminder', body: 'Don\'t forget to collect your medicine before 9 PM.', time: 'Yesterday', unread: false, group: 'Earlier' },
  { id: 'n5', type: 'info' as NotifType, title: 'Prescription Processed', body: 'Your prescription from Jun 2 has been successfully processed.', time: '2 days ago', unread: false, group: 'Earlier' },
];
// ─────────────────────────────────────────────────────────────────────────────

const NOTIF_ICON: Record<NotifType, { icon: React.ComponentType<any>; bg: string; color: string }> = {
  reservation: { icon: Package, bg: Colors.primaryLight, color: Colors.primary },
  medicine: { icon: CheckCircle, bg: Colors.successLight, color: Colors.success },
  alert: { icon: AlertTriangle, bg: Colors.warningLight, color: Colors.warning },
  info: { icon: Info, bg: Colors.infoLight, color: Colors.info },
};

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const unreadCount = notifs.filter(n => n.unread).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  const groups = ['Today', 'Earlier'];

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={groups}
        keyExtractor={g => g}
        contentContainerStyle={styles.list}
        renderItem={({ item: group }) => {
          const items = notifs.filter(n => n.group === group);
          if (!items.length) return null;
          return (
            <View>
              <Text style={styles.groupLabel}>{group}</Text>
              {items.map(n => {
                const icfg = NOTIF_ICON[n.type];
                const Icon = icfg.icon;
                return (
                  <TouchableOpacity key={n.id} style={[styles.notifCard, n.unread && styles.notifCardUnread]}>
                    <View style={[styles.notifIcon, { backgroundColor: icfg.bg }]}>
                      <Icon size={16} color={icfg.color} />
                    </View>
                    <View style={styles.notifBody}>
                      <View style={styles.notifTitleRow}>
                        <Text style={[styles.notifTitle, n.unread && styles.notifTitleUnread]}>{n.title}</Text>
                        {n.unread && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.notifText}>{n.body}</Text>
                      <Text style={styles.notifTime}>{n.time}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        }}
      />
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
  markAllText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  groupLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginVertical: Spacing.md },
  notifCard: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  notifCardUnread: { backgroundColor: Colors.primaryLight, borderColor: 'rgba(11,143,129,0.2)' },
  notifIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifBody: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  notifTitle: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  notifTitleUnread: { fontWeight: FontWeight.bold },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  notifText: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  notifTime: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },
});

export default NotificationsScreen;
