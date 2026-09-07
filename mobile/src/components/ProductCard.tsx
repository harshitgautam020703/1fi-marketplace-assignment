import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductSummary } from '../types';
import { colors, radius, shadow, spacing, typography } from '../theme';
import PriceTag from './PriceTag';
import RatingBadge from './RatingBadge';

interface Props {
  product: ProductSummary;
  onPress: (productId: string) => void;
}

export default function ProductCard({ product, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress(product.id)}
      accessibilityRole="button"
      accessibilityLabel={`View ${product.name}`}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        {!product.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of stock</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <RatingBadge rating={product.rating} ratingCount={product.ratingCount} compact />
        <PriceTag price={product.minPrice} mrp={product.minMrp} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    margin: spacing.sm,
    overflow: 'hidden',
    ...shadow.card,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.divider,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  outOfStockText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  info: {
    padding: spacing.md,
  },
  brand: {
    ...typography.caption,
    marginBottom: 2,
  },
  name: {
    ...typography.bodyMedium,
    marginBottom: spacing.xs,
    minHeight: 34,
  },
});
