/**
 * PickupWindowSelector.tsx
 * List of time-slot option rows with emoji, label, and radio indicator.
 * Controlled — parent owns selectedIndex state.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

interface PickupWindow {
  label: string;
  icon: string;
}

interface Props {
  windows: PickupWindow[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const PickupWindowSelector: React.FC<Props> = ({ windows, selectedIndex, onChange }) => (
  <View style={styles.col}>
    {windows.map((window, i) => {
      const isSelected = selectedIndex === i;
      return (
        <TouchableOpacity
          key={window.label}
          style={[styles.btn, isSelected && styles.btnActive]}
          onPress={() => onChange(i)}>
          <Text style={styles.emoji}>{window.icon}</Text>
          <Text style={[styles.label, isSelected && styles.labelActive]}>
            {window.label}
          </Text>
          <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  col: { gap: Spacing.sm },

  btn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: 12, paddingHorizontal: Spacing.md,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.gray200,
    backgroundColor: Colors.surface,
  },
  btnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },

  emoji: { fontSize: 16 },

  label: {
    flex: 1, fontSize: FontSize.sm,
    fontWeight: FontWeight.medium, color: Colors.textSecondary,
  },
  labelActive: { color: Colors.primary, fontWeight: FontWeight.semibold },

  radioOuter: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 2,
    borderColor: Colors.gray300, alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: Colors.primary },

  radioInner: {
    width: 9, height: 9, borderRadius: 4.5, backgroundColor: Colors.primary,
  },
});
