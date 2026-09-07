import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PrimaryButton from '../components/PrimaryButton';
import { ApiError, api } from '../services/api';
import { colors, radius, spacing, typography } from '../theme';
import { EmiQuote, Product, RootStackParamList, Variant } from '../types';

type Route = RouteProp<RootStackParamList, 'OrderReview'>;

type LoadState = 'loading' | 'success' | 'error';

function formatInr(value: number): string {
  return `\u20B9${value.toLocaleString('en-IN')}`;
}

export default function OrderReviewScreen() {
  const { productId, variantId, planId } = useRoute<Route>().params;

  const [product, setProduct] = useState<Product | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [quote, setQuote] = useState<EmiQuote | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setState('loading');
    try {
      const [productData, quoteData] = await Promise.all([
        api.getProduct(productId),
        api.getEmiQuote(productId, variantId, planId),
      ]);
      setProduct(productData);
      setVariant(productData.variants.find((v) => v.id === variantId) ?? null);
      setQuote(quoteData);
      setState('success');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to load order details.';
      setErrorMessage(message);
      setState('error');
    }
  }, [productId, variantId, planId]);

  useEffect(() => {
    load();
  }, [load]);

  if (state === 'loading') {
    return <LoadingState message="Preparing your order..." />;
  }

  if (state === 'error' || !product || !variant || !quote) {
    return <ErrorState message={errorMessage} onRetry={load} />;
  }

  const handleConfirm = () => {
    setSubmitting(true);
    // Order placement isn't part of this assignment's scope - simulate the
    // final network round trip so the loading/disabled state on the CTA is
    // demonstrably wired up end to end.
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Order confirmed',
        `Your ${product.name} on the ${quote.tenureMonths}-month plan is on its way.`
      );
    }, 900);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Order summary</Text>
        <View style={styles.productRow}>
          <Image source={{ uri: product.images[0] }} style={styles.thumb} />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.variantLabel}>{variant.label}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>EMI plan</Text>
          <Row label="Tenure" value={`${quote.tenureMonths} months`} />
          <Row label="Principal" value={formatInr(quote.principal)} />
          <Row label="Interest rate" value={`${quote.interestRatePct}%`} />
          <Row label="Processing fee" value={formatInr(quote.processingFee)} />
          <View style={styles.divider} />
          <Row label="Total payable" value={formatInr(quote.totalPayable)} emphasis />
          <Row
            label="Monthly installment"
            value={`${formatInr(quote.monthlyInstallment)}/mo`}
            emphasis
          />
        </View>

        <Text style={styles.disclaimer}>
          This is a computed estimate from the mock EMI engine for
          demonstration purposes and does not represent a real loan offer.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Confirm and proceed"
          onPress={handleConfirm}
          loading={submitting}
        />
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, emphasis && styles.rowValueEmphasis]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.divider,
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    ...typography.bodyMedium,
    marginBottom: spacing.xs,
  },
  variantLabel: {
    ...typography.caption,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.bodyMedium,
  },
  rowValueEmphasis: {
    color: colors.primary,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  disclaimer: {
    ...typography.caption,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
