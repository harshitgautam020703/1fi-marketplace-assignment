import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, minTouchTarget, radius, spacing, typography } from '../theme';

interface Segment {
  key: string;
  label: string;
}

interface Props {
  segments: Segment[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

/**
 * Matches the pill selector on 1Fi's Shop page: a lavender rounded-full
 * track, with the active segment shown as a white capsule plus a small
 * underline accent beneath its label.
 */
export default function SegmentedTabs({ segments, selectedKey, onSelect }: Props) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {segments.map((segment) => {
        const selected = segment.key === selectedKey;
        return (
          <TouchableOpacity
            key={segment.key}
            style={[styles.segment, selected && styles.segmentActive]}
            onPress={() => onSelect(segment.key)}
            activeOpacity={0.85}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.label, selected && styles.labelActive]} numberOfLines={1}>
              {segment.label}
            </Text>
            {selected && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    padding: 4,
  },
  segment: {
    flex: 1,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
  },
  segmentActive: {
    backgroundColor: colors.surface,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.primary,
    opacity: 0.55,
  },
  labelActive: {
    opacity: 1,
  },
  indicator: {
    marginTop: 3,
    width: 18,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
