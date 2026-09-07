import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  rating: number;
  ratingCount?: number;
  compact?: boolean;
}

export default function RatingBadge({ rating, ratingCount, compact }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{rating.toFixed(1)} ★</Text>
      </View>
      {!compact && ratingCount !== undefined && (
        <Text style={styles.count}>({ratingCount.toLocaleString('en-IN')})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    ...typography.captionMedium,
    color: colors.success,
  },
  count: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
});
