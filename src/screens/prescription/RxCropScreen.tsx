/**
 * RxCropScreen.tsx — Figma: "Image Crop"
 * Dark full-screen preview with crop guides and tool bar.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { X, Crop, RotateCcw, Zap } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<VaultStackParamList>;
type RouteProps = RouteProp<VaultStackParamList, typeof Routes.RX_CROP>;

const RxCropScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { imageUri } = route.params;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <X size={16} color={Colors.textInverse} />
        </TouchableOpacity>
        <Text style={styles.title}>Crop & Adjust</Text>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.navigate(Routes.RX_PROGRESS, { imageUri })}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Image preview area */}
      <View style={styles.imageArea}>
        <View style={styles.imagePlaceholder}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
        ) : (
          <View style={styles.previewContent}>
            <Text style={styles.previewLabel}>No image selected</Text>
          </View>
        )}
        </View>

        {/* Crop guides / Corner markers */}
        <View style={styles.cropOverlay}>
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

const CORNER_SIZE = 24;
const BORDER_W = 2;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingTop: 48, paddingHorizontal: 20, paddingBottom: 12,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  title: { flex: 1, color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: 14, textAlign: 'center' },
  doneBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  doneBtnText: { color: Colors.textInverse, fontSize: 12, fontWeight: FontWeight.semibold },
  imageArea: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imagePlaceholder: {
    width: '100%', aspectRatio: 3 / 4, backgroundColor: '#111827',
    borderRadius: Radius.xl, overflow: 'hidden',
  },
  previewContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  previewImage: { width: '100%', height: '100%' },
  previewLabel: { color: '#4b5563', fontSize: 12, marginTop: 12 },
  cropOverlay: {
    position: 'absolute',
    top: 60, bottom: 60,
    left: 40, right: 40,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 8,
  },
  corner: { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE },
  cornerTL: { top: -2, left: -2, borderTopWidth: BORDER_W * 2, borderLeftWidth: BORDER_W * 2, borderColor: Colors.textInverse, borderTopLeftRadius: 4 },
  cornerTR: { top: -2, right: -2, borderTopWidth: BORDER_W * 2, borderRightWidth: BORDER_W * 2, borderColor: Colors.textInverse, borderTopRightRadius: 4 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: BORDER_W * 2, borderLeftWidth: BORDER_W * 2, borderColor: Colors.textInverse, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: BORDER_W * 2, borderRightWidth: BORDER_W * 2, borderColor: Colors.textInverse, borderBottomRightRadius: 4 },
  toolBar: {
    flexDirection: 'row', justifyContent: 'center', gap: 40,
    paddingBottom: 48, paddingTop: 12,
  },
  tool: { alignItems: 'center', gap: 8 },
  toolIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  toolLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: FontWeight.medium },
});

export default RxCropScreen;
