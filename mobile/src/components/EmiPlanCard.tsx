import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EmiPlan } from '../types';
import { colors, minTouchTarget, radius, spacing, typography } from '../theme';

interface Props {
  plan: EmiPlan;
  principal: number;
  selected: boolean;
  onSelect: (planId: string) => void;
}

function formatInr(value: number): string {
  return `\u20B9${Math.round(value).toLocaleString('en-IN')}`;
}

/**
 * Client-side estimate only, used for instant feedback while the user
 * browses plans. The authoritative figure comes from the backend's
 * /emi-quote endpoint once a plan is actually selected and confirmed
 * (see OrderReviewScreen) - we never let a client-computed number be the
 * one that's actually charged.
 */
function estimateMonthly(principal: number, plan: EmiPlan): number {
  const totalPayable = principal + principal * (plan.interestRatePct / 100) + plan.processingFee;
  return totalPayable / plan.tenureMonths;
}

/**
 * Flat row style matching 1Fi's EMI plan list (tenure + rate on the left,
 * monthly figure on the right, thin divider between rows) rather than a
 * card-with-radio-button pattern.
 */
export default function EmiPlanCard({ plan, principal, selected, onSelect }: Props) {
  const monthly = estimateMonthly(principal, plan);
  const isNoCost = plan.interestRatePct === 0 && plan.processingFee === 0;

  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={() => onSelect(plan.id)}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={styles.left}>
        <View style={styles.tenureRow}>
          <Text style={styles.tenure}>{plan.tenureMonths} months</Text>
          {isNoCost && (
            <View style={styles.noCostBadge}>
              <Text style={styles.noCostText}>No cost</Text>
            </View>
          )}
        </View>
        <Text style={styles.fine}>
          {plan.interestRatePct}% p.a. · {formatInr(plan.processingFee)} fee
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.monthly, selected && styles.monthlySelected]}>
          {formatInr(monthly)}
          <Text style={styles.perMo}>/mo</Text>
        </Text>
        {selected && (
          <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={styles.check} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: minTouchTarget + 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowSelected: {
    backgroundColor: colors.primarySoft,
    borderBottomColor: colors.primarySoft,
  },
  left: {
    flex: 1,
  },
  tenureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  tenure: {
    ...typography.bodyMedium,
    marginRight: spacing.sm,
  },
  noCostBadge: {
    backgroundColor: colors.successSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  noCostText: {
    ...typography.captionMedium,
    color: colors.success,
    fontSize: 10,
  },
  fine: {
    ...typography.caption,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthly: {
    ...typography.bodyMedium,
    fontSize: 15,
  },
  monthlySelected: {
    color: colors.primary,
  },
  perMo: {
    ...typography.caption,
    fontSize: 12,
  },
  check: {
    marginLeft: spacing.sm,
  },
});
