import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

export interface ScreenLayoutProps {
  children: React.ReactNode;
  scroll?: boolean;
  keyboardAvoid?: boolean;
  backgroundColor?: string;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'bottom')[];
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  scroll = false,
  keyboardAvoid = false,
  backgroundColor = Colors.surface,
  contentStyle,
  edges = ['top'],
}) => {
  const insets = useSafeAreaInsets();
  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  const content = (
    <View style={[styles.root, { backgroundColor, paddingTop, paddingBottom }]}>
      {body}
    </View>
  );

  if (keyboardAvoid) {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
