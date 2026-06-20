import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Radius } from '@/constants/theme';

export type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'gray';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const getVariantStyle = (variant: BadgeVariant) => {
  switch (variant) {
    case 'green':
      return { bg: Colors.successLight, text: Colors.success, border: Colors.successBorder };
    case 'amber':
      return { bg: Colors.warningLight, text: Colors.warning, border: Colors.warningBorder };
    case 'red':
      return { bg: Colors.errorLight, text: Colors.error, border: Colors.errorBorder };
    case 'blue':
      return { bg: Colors.infoLight, text: Colors.info, border: Colors.infoBorder };
    case 'gray':
    default:
      return { bg: Colors.gray100, text: Colors.gray500, border: Colors.borderLight };
  }
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'gray' }) => {
  const vStyle = getVariantStyle(variant);

  return (
    <View style={[styles.container, { backgroundColor: vStyle.bg, borderColor: vStyle.border }]}>
      <Text style={[styles.text, { color: vStyle.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FontSize.xs - 2, // text-[10px]
    fontWeight: FontWeight.semibold,
  },
});
