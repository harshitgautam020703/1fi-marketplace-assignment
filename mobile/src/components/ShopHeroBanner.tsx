import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

/**
 * Matches the Shop page's hero banner ("NO-COST EMIs" badge, "Shop today,
 * Pay later using Mutual funds." headline). Rendered as a solid deep-violet
 * block rather than the original's illustrated gradient artwork - adding
 * expo-linear-gradient plus a matching illustration was judged not worth
 * the added dependency and asset-sourcing time for a static banner that
 * isn't part of the Marketplace flow being evaluated, but the copy, badge,
 * and color are kept faithful to the reference screens.
 */
export default function ShopHeroBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>NO-COST EMIs</Text>
      </View>
      <Text style={styles.headline}>
        Shop today,{'\n'}
        <Text style={styles.headlineItalic}>Pay later using</Text>
        {'\n'}Mutual funds.
      </Text>
      <Text style={styles.subtext}>
        No credit score required. No interest. Backed by your investments.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.heroStart,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  badgeText: {
    ...typography.captionMedium,
    color: colors.white,
    letterSpacing: 0.5,
  },
  headline: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headlineItalic: {
    fontStyle: 'italic',
    fontWeight: '400',
  },
  subtext: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
  },
});
