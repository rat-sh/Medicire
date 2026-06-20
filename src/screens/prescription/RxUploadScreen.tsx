/**
 * RxUploadScreen.tsx
 * Figma: "Upload Prescription" — Camera + Gallery buttons, tips box,
 *        horizontal scroll of recent prescription thumbnails
 * Mock: Recent prescriptions shown from MOCK data
 * Real API: GET /prescriptions (user vault)
 * MOCK_MARKER: Replace MOCK_PRESCRIPTIONS with real API call
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Camera, FileText, Info, ArrowRight } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RxStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<RxStackParamList>;

// ── MOCK_MARKER: Replace with real user prescriptions from API ─────────────────
const MOCK_RECENT_RX = [
  { date: '14 Jun', doc: 'Dr. S. Bose' },
  { date: '2 May', doc: 'Dr. R. Kumar' },
  { date: '18 Apr', doc: 'Dr. A. Das' },
];
// ─────────────────────────────────────────────────────────────────────────────

const RxUploadScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      {/* Back header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Prescription</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sub}>
          Upload a prescription and we'll find where to get all your medicines nearby.
        </Text>

        {/* Upload options */}
        <View style={styles.options}>
          {/* Camera — primary */}
          <TouchableOpacity
            style={styles.optionPrimary}
            onPress={() => navigation.navigate(Routes.RX_CROP, { imageUri: '' })}>
            <View style={styles.optionIconPrimary}>
              <Camera size={24} color={Colors.textInverse} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Take a photo</Text>
              <Text style={styles.optionSub}>Use your camera to capture prescription</Text>
            </View>
          </TouchableOpacity>

          {/* Gallery — secondary */}
          <TouchableOpacity
            style={styles.optionSecondary}
            onPress={() => navigation.navigate(Routes.RX_CROP, { imageUri: '' })}>
            <View style={styles.optionIconSecondary}>
              <FileText size={24} color={Colors.textSecondary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Upload from gallery</Text>
              <Text style={styles.optionSub}>Choose an image from your phone</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tips box */}
        <View style={styles.tipsBox}>
          <Info size={16} color="#d97706" />
          <Text style={styles.tipsText}>
            For best results, ensure the prescription is clearly lit, fully visible, and not blurry. Handwritten prescriptions are supported.
          </Text>
        </View>

        {/* Recent prescriptions */}
        <Text style={styles.sectionTitle}>My Prescriptions (4)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rxScroll}>
          {/* MOCK_MARKER: Replace with real prescription thumbnails from API */}
          {MOCK_RECENT_RX.map(({ date, doc }) => (
            <TouchableOpacity
              key={date}
              style={styles.rxThumb}
              onPress={() => navigation.navigate(Routes.RX_RESULTS, { prescriptionId: 'rx_001' })}>
              <View style={styles.rxThumbImg}>
                <FileText size={32} color={Colors.textMuted} />
              </View>
              <View style={styles.rxThumbInfo}>
                <Text style={styles.rxThumbDate}>{date}</Text>
                <Text style={styles.rxThumbDoc}>{doc}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {/* View all button */}
          <TouchableOpacity style={styles.rxViewAll}>
            <ArrowRight size={20} color={Colors.textMuted} />
            <Text style={styles.rxViewAllText}>View all</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  statusSpacer: { height: 44 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center' },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 20 },
  options: { gap: Spacing.md, marginBottom: Spacing.xl },
  optionPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    backgroundColor: Colors.primaryLight, borderWidth: 2, borderColor: Colors.primary,
    borderRadius: Radius.xl, padding: Spacing.xl,
  },
  optionIconPrimary: {
    width: 48, height: 48, backgroundColor: Colors.primary,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
  },
  optionSecondary: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    backgroundColor: Colors.gray50, borderWidth: 2, borderColor: Colors.border,
    borderRadius: Radius.xl, padding: Spacing.xl,
  },
  optionIconSecondary: {
    width: 48, height: 48, backgroundColor: Colors.gray200,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
  },
  optionText: { flex: 1 },
  optionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  optionSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  tipsBox: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: '#fffbeb',
    borderWidth: 1, borderColor: '#fde68a', borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.xl,
  },
  tipsText: { flex: 1, fontSize: FontSize.xs, color: '#92400e', lineHeight: 18 },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.md },
  rxScroll: { gap: Spacing.md, paddingRight: Spacing.xl },
  rxThumb: {
    width: 96, backgroundColor: Colors.gray100,
    borderRadius: Radius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
  },
  rxThumbImg: {
    height: 80, backgroundColor: Colors.gray200,
    alignItems: 'center', justifyContent: 'center',
  },
  rxThumbInfo: { padding: Spacing.sm },
  rxThumbDate: { fontSize: 10, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  rxThumbDoc: { fontSize: 9, color: Colors.textSecondary, marginTop: 2 },
  rxViewAll: {
    width: 96, height: 92, backgroundColor: Colors.gray50,
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  rxViewAllText: { fontSize: 9, color: Colors.textMuted, fontWeight: FontWeight.medium },
});

export default RxUploadScreen;
