import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

/** Decorative map preview matching Figma MockMap — used on Home screen. */
export const MapPreview: React.FC = () => (
  <View style={styles.root}>
    <View style={styles.roadH1} />
    <View style={styles.roadH2} />
    <View style={styles.roadV} />
    <View style={styles.userWrap}>
      <View style={styles.userPulse} />
      <View style={styles.userDot} />
    </View>
    <View style={[styles.pin, { top: '30%', left: '22%' }]}>
      <View style={[styles.pinDot, { backgroundColor: Colors.pinInStock }]} />
    </View>
    <View style={[styles.pin, { top: '25%', left: '60%' }]}>
      <View style={[styles.pinDot, { backgroundColor: Colors.pinLowStock }]} />
    </View>
    <View style={[styles.pin, { top: '55%', left: '72%' }]}>
      <View style={[styles.pinDot, { backgroundColor: Colors.pinInStock }]} />
    </View>
    <View style={[styles.pin, { top: '72%', left: '33%' }]}>
      <MapPin size={14} color={Colors.pinClosed} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e8efe4', position: 'relative' },
  roadH1: { position: 'absolute', top: '38%', left: 0, right: 0, height: 14, backgroundColor: 'rgba(255,255,255,0.8)' },
  roadH2: { position: 'absolute', top: '62%', left: 0, right: 0, height: 8, backgroundColor: 'rgba(255,255,255,0.6)' },
  roadV: { position: 'absolute', left: '28%', top: 0, bottom: 0, width: 12, backgroundColor: 'rgba(255,255,255,0.7)' },
  userWrap: { position: 'absolute', top: '46%', left: '46%', alignItems: 'center', justifyContent: 'center' },
  userPulse: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#3b82f6', opacity: 0.3 },
  userDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3b82f6', borderWidth: 2, borderColor: Colors.surface },
  pin: { position: 'absolute', alignItems: 'center' },
  pinDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.surface },
});
