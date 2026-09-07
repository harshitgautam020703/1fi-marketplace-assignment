export interface Variant {
  id: string;
  label: string;
  price: number;
  mrp: number;
  stock: number;
}

export interface EmiPlan {
  id: string;
  tenureMonths: number;
  interestRatePct: number;
  processingFee: number;
}

export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  rating: number;
  ratingCount: number;
  minPrice: number;
  minMrp: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  rating: number;
  ratingCount: number;
  variants: Variant[];
  emiPlans: EmiPlan[];
}

export interface EmiQuote {
  planId: string;
  tenureMonths: number;
  interestRatePct: number;
  processingFee: number;
  principal: number;
  totalPayable: number;
  monthlyInstallment: number;
}

/**
 * Bottom tab bar, matching the real 1Fi app's 5-tab layout (Home, Shop,
 * EMI Dues, Limit, Profile). Home/EMI Dues/Limit/Profile are out of scope
 * for this assignment and rendered as simple placeholders, the same way
 * Top Brands and Nearby Stores are within the Shop tab.
 */
export type MainTabParamList = {
  Home: undefined;
  Shop: undefined;
  EMIDues: undefined;
  Limit: undefined;
  Profile: undefined;
};

/**
 * Root stack: the tab bar itself, plus screens that push on top of it and
 * hide the tab bar - matching the real app's behavior where a detail page
 * (e.g. the gift voucher / "Pay using 1Fi" screen) replaces the tab bar
 * with a back-arrow header rather than nesting inside it.
 */
export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { productId: string };
  OrderReview: {
    productId: string;
    variantId: string;
    planId: string;
  };
};

export type ShopSegment = 'topBrands' | 'nearbyStores' | 'marketplace';
