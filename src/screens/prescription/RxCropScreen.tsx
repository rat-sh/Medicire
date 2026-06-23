/**
 * RxCropScreen.tsx
 * Figma: "Image Crop" — dark full-screen preview with crop guides (corner markers),
 *        tool bar (Crop, Rotate, Enhance), Done button
 * Mock: Shows placeholder image, Done → RxProgress
 * Real API: Apply crop/rotate to actual image before upload
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { X, FileText } from 'lucide-react-native';
import { Crop, RotateCcw, Zap } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<VaultStackParamList>;

const RxCropScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  return (
    <View style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <X size={16} color={Colors.textInverse} />
        </TouchableOpacity>
        <Text style={styles.title}>Crop & Adjust</Text>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.navigate(Routes.RX_PROGRESS, { imageUri: '' })}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Image preview with crop overlay */}
      <View style={styles.imageArea}>
        <View style={styles.imagePlaceholder}>
          <FileText size={64} color={Colors.gray500} />
          <Text style={styles.imagePlaceholderText}>Prescription preview</Text>
        </View>
        {/* Crop guides */}
        <View style={styles.cropOverlay}>
          {/* Corner markers */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
      </View>

      {/* Tool bar */}
      <View style={styles.toolBar}>
        {[
          { icon: Crop, label: 'Crop' },
          { icon: RotateCcw, label: 'Rotate' },
          { icon: Zap, label: 'Enhance' },
        ].map(({ icon: Icon, label }) => (
          <TouchableOpacity key={label} style={styles.tool}>
            <View style={styles.toolIcon}>
              <Icon size={20} color={Colors.textInverse} />
            </View>
            <Text style={styles.toolLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const CORNER_SIZE = 20;
const BORDER_W = 2;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingTop: 48, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  title: { flex: 1, color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  doneBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg, paddingVertical: 6,
  },
  doneBtnText: { color: Colors.textInverse, fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  imageArea: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  imagePlaceholder: {
    width: '100%', aspectRatio: 3 / 4, backgroundColor: '#374151',
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
  },
  imagePlaceholderText: { color: Colors.gray500, fontSize: FontSize.xs, marginTop: Spacing.sm },
  cropOverlay: {
    position: 'absolute',
    top: Spacing.lg + 24, bottom: Spacing.lg + 24,
    left: Spacing.lg + 24, right: Spacing.lg + 24,
    borderWidth: BORDER_W, borderColor: Colors.textInverse, borderRadius: 4,
  },
  corner: { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE },
  cornerTL: { top: -BORDER_W, left: -BORDER_W, borderTopWidth: BORDER_W * 2, borderLeftWidth: BORDER_W * 2, borderColor: Colors.textInverse },
  cornerTR: { top: -BORDER_W, right: -BORDER_W, borderTopWidth: BORDER_W * 2, borderRightWidth: BORDER_W * 2, borderColor: Colors.textInverse },
  cornerBL: { bottom: -BORDER_W, left: -BORDER_W, borderBottomWidth: BORDER_W * 2, borderLeftWidth: BORDER_W * 2, borderColor: Colors.textInverse },
  cornerBR: { bottom: -BORDER_W, right: -BORDER_W, borderBottomWidth: BORDER_W * 2, borderRightWidth: BORDER_W * 2, borderColor: Colors.textInverse },
  toolBar: {
    flexDirection: 'row', justifyContent: 'center', gap: Spacing.xxxl,
    paddingBottom: 40, paddingTop: Spacing.md,
  },
  tool: { alignItems: 'center', gap: 6 },
  toolIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  toolLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
});

export default RxCropScreen;
