import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PlaceholderScreen from '../components/PlaceholderScreen';
import SegmentedTabs from '../components/SegmentedTabs';
import ShopHeroBanner from '../components/ShopHeroBanner';
import MarketplaceListScreen from './MarketplaceListScreen';
import { colors, spacing } from '../theme';
import { ShopSegment } from '../types';

const SEGMENTS: { key: ShopSegment; label: string }[] = [
  { key: 'topBrands', label: 'Top Brands' },
  { key: 'nearbyStores', label: 'Nearby Stores' },
  { key: 'marketplace', label: '1Fi Marketplace' },
];

export default function ShopScreen() {
  const [selected, setSelected] = useState<ShopSegment>('marketplace');

  return (
    <View style={styles.screen}>
      <ShopHeroBanner />
      <View style={styles.tabsWrap}>
        <SegmentedTabs
          segments={SEGMENTS}
          selectedKey={selected}
          onSelect={(key) => setSelected(key as ShopSegment)}
        />
      </View>

      <View style={styles.content}>
        {selected === 'topBrands' && (
          <PlaceholderScreen title="Top Brands" subtitle="Not part of this assignment" />
        )}
        {selected === 'nearbyStores' && (
          <PlaceholderScreen title="Nearby Stores" subtitle="Not part of this assignment" />
        )}
        {selected === 'marketplace' && <MarketplaceListScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  content: {
    flex: 1,
  },
});
