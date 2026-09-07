import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Props {
  price: number;
  mrp?: number;
  size?: 'sm' | 'lg';
}

function formatInr(value: number): string {
  return `\u20B9${value.toLocaleString('en-IN')}`;
}

export default function PriceTag({ price, mrp, size = 'sm' }: Props) {
  const hasDiscount = !!mrp && mrp > price;
  const discountPct = hasDiscount ? Math.round((1 - price / (mrp as number)) * 100) : 0;

  return (
    <View style={styles.row}>
      <Text style={[styles.price, size === 'lg' && styles.priceLg]}>{formatInr(price)}</Text>
      {hasDiscount && (
        <>
          <Text style={styles.mrp}>{formatInr(mrp as number)}</Text>
          <Text style={styles.discount}>{discountPct}% off</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  price: {
    ...typography.bodyMedium,
    fontSize: 15,
    marginRight: spacing.sm,
  },
  priceLg: {
    fontSize: 20,
    fontWeight: '700',
  },
  mrp: {
    ...typography.caption,
    textDecorationLine: 'line-through',
    marginRight: spacing.sm,
  },
  discount: {
    ...typography.captionMedium,
    color: colors.success,
  },
});
