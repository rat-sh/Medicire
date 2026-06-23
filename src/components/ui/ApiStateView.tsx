import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { Button } from './Button';
import type { LucideIcon } from 'lucide-react-native';

export interface ApiStateViewProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  loadingText?: string;
  errorMessage?: string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptySubtitle: string;
  emptyAction?: string;
  onRetry?: () => void;
  onEmptyAction?: () => void;
  children?: React.ReactNode;
}

export const ApiStateView: React.FC<ApiStateViewProps> = ({
  isLoading,
  isError,
  isEmpty,
  loadingText = 'Loading...',
  errorMessage = 'Something went wrong. Please try again.',
  emptyIcon,
  emptyTitle,
  emptySubtitle,
  emptyAction,
  onRetry,
  onEmptyAction,
  children,
}) => {
  if (isLoading) {
    return <LoadingSpinner fullScreen text={loadingText} />;
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <AlertCircle size={28} color={Colors.error} />
        </View>
        <Text style={styles.errorTitle}>Unable to load</Text>
        <Text style={styles.errorSubtitle}>{errorMessage}</Text>
        {onRetry && (
          <Button
            title="Try again"
            onPress={onRetry}
            icon={RefreshCw}
            variant="primary"
          />
        )}
      </View>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        subtitle={emptySubtitle}
        action={emptyAction}
        onAction={onEmptyAction}
      />
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
    gap: Spacing.md,
  },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  errorTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
});
