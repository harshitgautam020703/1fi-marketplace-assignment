import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Variant } from '../types';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  variants: Variant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
}

export default function VariantSelector({ variants, selectedVariantId, onSelect }: Props) {
  return (
    <View>
      <Text style={styles.label}>Select an option</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {variants.map((variant) => {
          const selected = variant.id === selectedVariantId;
          const disabled = variant.stock === 0;
          return (
            <TouchableOpacity
              key={variant.id}
              disabled={disabled}
              onPress={() => onSelect(variant.id)}
              style={[
                styles.chip,
                selected && styles.chipSelected,
                disabled && styles.chipDisabled,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled }}
            >
              <Text
                style={[
                  styles.chipText,
                  selected && styles.chipTextSelected,
                  disabled && styles.chipTextDisabled,
                ]}
              >
                {variant.label}
              </Text>
              {disabled && <Text style={styles.soldOut}>Sold out</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.captionMedium,
    marginBottom: spacing.sm,
  },
  row: {
    paddingBottom: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  chipDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.divider,
  },
  chipText: {
    ...typography.bodyMedium,
    fontSize: 13,
  },
  chipTextSelected: {
    color: colors.primary,
  },
  chipTextDisabled: {
    color: colors.textMuted,
  },
  soldOut: {
    ...typography.caption,
    color: colors.danger,
    fontSize: 10,
    marginTop: 2,
  },
});
