import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import ProductCard from '../components/ProductCard';
import { ApiError, api } from '../services/api';
import { colors, radius, spacing, typography } from '../theme';
import { ProductSummary, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

type LoadState = 'loading' | 'success' | 'error';

export default function MarketplaceListScreen() {
  const navigation = useNavigation<Nav>();

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch {
      // Non-critical - the listing still works without the filter chips.
    }
  }, []);

  const loadProducts = useCallback(
    async (opts?: { isRefresh?: boolean }) => {
      if (opts?.isRefresh) {
        setRefreshing(true);
      } else {
        setState('loading');
      }
      try {
        const data = await api.getProducts({
          category: selectedCategory ?? undefined,
          search: search.trim() || undefined,
        });
        setProducts(data);
        setState('success');
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Failed to load products.';
        setErrorMessage(message);
        setState('error');
      } finally {
        setRefreshing(false);
      }
    },
    [selectedCategory, search]
  );

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Debounce search input so we don't fire a request on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, search]);

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, brands..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <TouchableOpacity
              style={[styles.chip, selectedCategory === null && styles.chipActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === null && styles.chipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, selectedCategory === cat && styles.chipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategory === cat && styles.chipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {state === 'loading' && <LoadingState message="Loading marketplace..." />}

      {state === 'error' && (
        <ErrorState message={errorMessage} onRetry={() => loadProducts()} />
      )}

      {state === 'success' && products.length === 0 && <EmptyState />}

      {state === 'success' && products.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={handleProductPress} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadProducts({ isRefresh: true })}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipRow: {
    paddingBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.captionMedium,
  },
  chipTextActive: {
    color: colors.white,
  },
  list: {
    padding: spacing.sm,
  },
});
