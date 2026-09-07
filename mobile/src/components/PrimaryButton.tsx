import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, minTouchTarget, radius, spacing, typography } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Full-width pill CTA with a trailing arrow, matching "Continue ->" and
 * "Check eligibility ->" buttons in the reference screenshots.
 */
export default function PrimaryButton({ label, onPress, disabled, loading }: Props) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={styles.row}>
          <Text style={styles.text}>{label}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} style={styles.icon} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    minHeight: minTouchTarget + 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    ...typography.bodyMedium,
    color: colors.white,
    fontSize: 15,
  },
  icon: {
    marginLeft: spacing.sm,
  },
});
