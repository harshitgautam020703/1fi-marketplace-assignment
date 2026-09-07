import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Props {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = 'No products found',
  message = 'Try adjusting your search or filters.',
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
