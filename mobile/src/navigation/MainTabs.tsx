import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';
import EMIDuesScreen from '../screens/EMIDuesScreen';
import HomeScreen from '../screens/HomeScreen';
import LimitScreen from '../screens/LimitScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ShopScreen from '../screens/ShopScreen';
import { colors, radius, shadow, typography } from '../theme';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Shop: { active: 'storefront', inactive: 'storefront-outline' },
  EMIDues: { active: 'receipt', inactive: 'receipt-outline' },
  Limit: { active: 'trending-up', inactive: 'trending-up-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

/**
 * Floating rounded pill nav bar matching the reference screenshots: white
 * background, purple active icon/label, positioned above the safe area
 * rather than flush with the bottom edge.
 */
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { ...typography.captionMedium, fontWeight: '600' },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Platform.select({ ios: 24, android: 16, default: 16 }),
          height: 68,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          paddingTop: 8,
          ...shadow.floating,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const set = ICONS[route.name as keyof MainTabParamList];
          const name = focused ? set.active : set.inactive;
          return <Ionicons name={name} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="EMIDues" component={EMIDuesScreen} options={{ title: 'EMI Dues' }} />
      <Tab.Screen name="Limit" component={LimitScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
