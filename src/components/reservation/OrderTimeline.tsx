/**
 * OrderTimeline.tsx
 * Amazon-style step progress tracker.
 * Renders a vertical list of steps with connecting lines, status dots,
 * step labels, and timestamps.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { getStepState } from '@/utils/reservationUtils';
import { formatTimestamp } from '@/utils/formatters';
import type { ReservationStatus, TrackingStep } from '@/types/reservation';

interface Props {
  steps: TrackingStep[];
  status: ReservationStatus;
  flow: ReservationStatus[];
  /** Color of the active step label / "In progress…" text */
  activeColor: string;
}

export const OrderTimeline: React.FC<Props> = ({ steps, status, flow, activeColor }) => (
  <View style={styles.timeline}>
    {steps.map((step, idx) => {
      const stepStatus = getStepState(step.key as ReservationStatus, status, flow);
      const isDone     = stepStatus === 'done';
      const isActive   = stepStatus === 'active';

      return (
        <View key={step.key} style={styles.item}>
          {/* Connecting line above each step (except the first) */}
          {idx > 0 && (
            <View style={[
              styles.line,
              isDone || isActive ? styles.lineDone : styles.lineUpcoming,
            ]} />
          )}

          {/* Step dot */}
          <View style={[
            styles.dot,
            isDone   && styles.dotDone,
            isActive && styles.dotActive,
            !isDone && !isActive && styles.dotUpcoming,
          ]}>
            {isDone   && <CheckCircle size={14} color={Colors.textInverse} />}
            {isActive && <View style={styles.dotPulse} />}
          </View>

          {/* Label + timestamp */}
          <View style={styles.labelWrap}>
            <Text style={[
              styles.stepLabel,
              (isDone || isActive) && styles.stepLabelActive,
            ]}>
              {step.label}
            </Text>
            {step.timestamp ? (
              <Text style={styles.ts}>{formatTimestamp(step.timestamp)}</Text>
            ) : isActive ? (
              <Text style={[styles.ts, { color: activeColor }]}>In progress…</Text>
            ) : null}
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  timeline: { gap: 0 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    paddingVertical: 6, position: 'relative',
  },
  line: {
    position: 'absolute', left: 13, top: -6, width: 2, height: 14, zIndex: 0,
  },
  lineDone:     { backgroundColor: Colors.success },
  lineUpcoming: { backgroundColor: Colors.gray200 },
  dot: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  dotDone:     { backgroundColor: Colors.success },
  dotActive:   { backgroundColor: Colors.primary, borderWidth: 3, borderColor: Colors.primaryLight },
  dotUpcoming: { backgroundColor: Colors.gray200 },
  dotPulse: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.textInverse,
  },
  labelWrap: { flex: 1, paddingTop: 4 },
  stepLabel: {
    fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textMuted,
  },
  stepLabelActive: { color: Colors.textPrimary, fontWeight: FontWeight.semibold },
  ts: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
});
