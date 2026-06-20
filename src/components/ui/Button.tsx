import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import type { LucideIcon } from 'lucide-react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon: Icon,
  fullWidth = false,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          btn: styles.secondaryBtn,
          text: styles.secondaryText,
          iconColor: Colors.textPrimary,
        };
      case 'outline':
        return {
          btn: styles.outlineBtn,
          text: styles.outlineText,
          iconColor: Colors.textSecondary,
        };
      case 'ghost':
        return {
          btn: styles.ghostBtn,
          text: styles.ghostText,
          iconColor: Colors.textSecondary,
        };
      case 'primary':
      default:
        return {
          btn: styles.primaryBtn,
          text: styles.primaryText,
          iconColor: Colors.textInverse,
        };
    }
  };

  const currentStyles = getStyles();

  return (
    <TouchableOpacity
      style={[
        styles.base,
        currentStyles.btn,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={currentStyles.iconColor} />
      ) : (
        <View style={styles.content}>
          {Icon && <Icon size={18} color={currentStyles.iconColor} />}
          <Text style={[styles.text, currentStyles.text, disabled && styles.textDisabled]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg, // rounded-xl in Tailwind
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  textDisabled: {
    color: Colors.textMuted,
  },
  
  primaryBtn: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.textInverse,
  },

  secondaryBtn: {
    backgroundColor: Colors.primaryLight,
  },
  secondaryText: {
    color: Colors.primaryDark,
  },

  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outlineText: {
    color: Colors.textSecondary,
  },

  ghostBtn: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.textSecondary,
  },
});
