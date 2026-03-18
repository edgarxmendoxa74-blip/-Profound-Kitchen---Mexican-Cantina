export interface Variation {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock?: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  image?: string;
  popular?: boolean;
  available?: boolean;
  variations?: Variation[];
  addOns?: AddOn[];
  // Discount pricing fields
  discountPrice?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  discountActive?: boolean;
  // Computed effective price (calculated in the app)
  effectivePrice?: number;
  isOnDiscount?: boolean;
  // Multi-variation support
  maxVariations?: number; // How many variations customer can pick (parsed from description)
  weight?: number;
  // Multi-image support
  images?: string[];
  stock?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedVariation?: Variation;
  selectedVariations?: Variation[]; // Support multiple variations
  selectedAddOns?: AddOn[];
  totalPrice: number;
}

export interface OrderData {
  items: CartItem[];
  customerName: string;
  contactNumber: string;
  serviceType: 'regular' | 'cod';
  address: string;
  location: 'LUZON' | 'VISAYAS' | 'MINDANAO' | 'ISLANDER' | '';
  landmark?: string;
  paymentMethod: 'gcash' | 'cod';
  referenceNumber?: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  discountTotal: number;
  couponCode?: string;
  notes?: string;
}

export interface ShippingRates {
  [location: string]: {
    [weight: string]: number;
  };
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  active: boolean;
  expiresAt?: string;
  created_at?: string;
  updated_at?: string;
}

export type PaymentMethod = 'gcash' | 'cod';
export type ServiceType = 'regular' | 'cod';

export interface EventPolicy {
  title: string;
  desc: string;
}

// Site Settings Types
export interface SiteSetting {
  id: string;
  value: string;
  type: 'text' | 'image' | 'boolean' | 'number';
  description?: string;
  updated_at: string;
}

export interface StoreHoursEntry {
  label: string;
  hours: string;
}

export interface SiteSettings {
  site_name: string;
  site_logo: string;
  site_description: string;
  currency: string;
  currency_code: string;
  store_hours?: StoreHoursEntry[];
  store_hours_summary?: string;
  hero_subtitle?: string;
  hero_images?: string[];
  shipping_rates?: ShippingRates;
  events_title?: string;
  events_subtitle?: string;
  events_description?: string;
  events_policies?: EventPolicy[];
  events_feature1_title?: string;
  events_feature1_desc?: string;
  events_feature2_title?: string;
  events_feature2_desc?: string;
  events_button_text?: string;
  events_button_url?: string;
  events_quote?: string;
  events_form_title?: string;
  events_form_link_text?: string;
  location_subtitle?: string;
  location_title?: string;
  location_address?: string;
  location_phone?: string;
  location_map_title?: string;
  location_map_desc?: string;
  location_button_text?: string;
  location_button_url?: string;
}