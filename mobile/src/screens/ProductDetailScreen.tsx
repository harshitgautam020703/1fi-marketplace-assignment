import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EmiPlanCard from '../components/EmiPlanCard';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PriceTag from '../components/PriceTag';
import PrimaryButton from '../components/PrimaryButton';
import RatingBadge from '../components/RatingBadge';
import VariantSelector from '../components/VariantSelector';
import { ApiError, api } from '../services/api';
import { colors, spacing, typography } from '../theme';
import { Product, RootStackParamList } from '../types';

type Route = RouteProp<RootStackParamList, 'ProductDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;

const { width } = Dimensions.get('window');

type LoadState = 'loading' | 'success' | 'error';

export default function ProductDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    setState('loading');
    try {
      const data = await api.getProduct(productId);
      setProduct(data);
      const firstInStock = data.variants.find((v) => v.stock > 0) ?? data.variants[0];
      setSelectedVariantId(firstInStock?.id ?? null);
      setSelectedPlanId(data.emiPlans[0]?.id ?? null);
      setState('success');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to load this product.';
      setErrorMessage(message);
      setState('error');
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const selectedVariant = useMemo(
    () => product?.variants.find((v) => v.id === selectedVariantId) ?? null,
    [product, selectedVariantId]
  );

  if (state === 'loading') {
    return <LoadingState message="Loading product..." />;
  }

  if (state === 'error' || !product) {
    return <ErrorState message={errorMessage} onRetry={loadProduct} />;
  }

  const canProceed = !!selectedVariant && selectedVariant.stock > 0 && !!selectedPlanId;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {product.images.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.image} resizeMode="cover" />
          ))}
        </ScrollView>

        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <RatingBadge rating={product.rating} ratingCount={product.ratingCount} />

          <View style={styles.priceBlock}>
            {selectedVariant && (
              <PriceTag price={selectedVariant.price} mrp={selectedVariant.mrp} size="lg" />
            )}
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.section}>
            <VariantSelector
              variants={product.variants}
              selectedVariantId={selectedVariantId}
              onSelect={setSelectedVariantId}
            />
          </View>

          {product.emiPlans.length > 0 && selectedVariant && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EMI options</Text>
              {product.emiPlans.map((plan) => (
                <EmiPlanCard
                  key={plan.id}
                  plan={plan}
                  principal={selectedVariant.price}
                  selected={plan.id === selectedPlanId}
                  onSelect={setSelectedPlanId}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={
            selectedVariant && selectedVariant.stock === 0
              ? 'Sold out'
              : 'Proceed with selected plan'
          }
          disabled={!canProceed}
          onPress={() => {
            if (!selectedVariant || !selectedPlanId) return;
            navigation.navigate('OrderReview', {
              productId: product.id,
              variantId: selectedVariant.id,
              planId: selectedPlanId,
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  image: {
    width,
    height: width,
    backgroundColor: colors.divider,
  },
  content: {
    padding: spacing.lg,
  },
  brand: {
    ...typography.caption,
    marginBottom: 2,
  },
  name: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  priceBlock: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
