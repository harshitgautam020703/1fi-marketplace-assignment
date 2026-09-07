import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MainTabs from './MainTabs';
import OrderReviewScreen from '../screens/OrderReviewScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { colors, typography } from '../theme';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { ...typography.h3 },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product details' }}
      />
      <Stack.Screen
        name="OrderReview"
        component={OrderReviewScreen}
        options={{ title: 'Review order' }}
      />
    </Stack.Navigator>
  );
}
