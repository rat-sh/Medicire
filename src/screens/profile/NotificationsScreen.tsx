/**
 * NotificationsScreen.tsx — Figma: "Notifications"
 * List of notifications with unread indicators and type-specific icons.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Package, Bell, XCircle, CheckCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

const NOTIFICATIONS = [
  { id: '1', icon: Package, color: Colors.success, bg: Colors.successLight, title: "Reservation Confirmed", body: "Apollo Pharmacy confirmed your Metformin 500mg reservation.", time: "2 min ago", unread: true },
  { id: '2', icon: Bell, color: Colors.primary, bg: Colors.primaryLight, title: "Medicine Back in Stock", body: "Paracetamol 650mg is now available at MedPlus, Sector V.", time: "1 hr ago", unread: true },
  { id: '3', icon: XCircle, color: Colors.error, bg: Colors.errorLight, title: "Reservation Cancelled", body: "Frank Ross cancelled your Atorvastatin order. View alternatives.", time: "3 hrs ago", unread: false },
  { id: '4', icon: Package, color: Colors.primary, bg: Colors.primaryLight, title: "Ready for Pickup", body: "Your Vitamin D3 60K is ready at Guardian Pharmacy.", time: "Yesterday", unread: false },
  { id: '5', icon: CheckCircle, color: Colors.textMuted, bg: Colors.gray100, title: "Pickup Completed", body: "You picked up Amlodipine 5mg from Apollo Pharmacy.", time: "2 days ago", unread: false },
];

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map(notif => {
          const Icon = notif.icon;
          return (
            <TouchableOpacity
              key={notif.id}
              style={[styles.item, notif.unread && styles.itemUnread]}>
              <View style={[styles.iconBox, { backgroundColor: notif.bg }]}>
                <Icon size={18} color={notif.color} />
              </View>
              <View style={styles.content}>
                <View style={styles.itemTop}>
                  <Text style={styles.itemTitle}>{notif.title}</Text>
                  {notif.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.itemBody}>{notif.body}</Text>
                <Text style={styles.itemTime}>{notif.time}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  markRead: { fontSize: 12, fontWeight: FontWeight.semibold, color: Colors.primary },
  body: { flex: 1 },
  item: {
    flexDirection: 'row', gap: Spacing.md, padding: Spacing.lg,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.gray50,
  },
  itemUnread: { backgroundColor: Colors.primaryLight + '10' },
  iconBox: {
    width: 40, height: 40, borderRadius: Radius.xl,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  content: { flex: 1 },
  itemTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 2 },
  itemBody: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  itemTime: { fontSize: 10, color: Colors.textMuted, marginTop: 6, fontWeight: FontWeight.medium },
});

export default NotificationsScreen;
