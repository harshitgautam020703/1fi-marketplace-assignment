import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
}

/**
 * Used for anything explicitly out of scope for this assignment: Top
 * Brands, Nearby Stores, and the Home/EMI Dues/Limit/Profile tabs. Kept as
 * one reusable component (rather than a near-duplicate screen file per
 * tab) since they're all the same "not implemented yet" shape.
 */
export default function PlaceholderScreen({ title, subtitle = 'Coming soon' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
