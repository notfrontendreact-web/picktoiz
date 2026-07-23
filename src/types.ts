export type AgeGroup = '0-2' | '3-5' | '6-8' | '9+';

export type Category = 
  | 'lego-puzzle' 
  | 'educational' 
  | 'wooden' 
  | 'dolls-figures' 
  | 'rc-cars' 
  | 'baby-toys';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  name: string;
  englishTitle?: string;
  category: Category;
  categoryName: string;
  ageGroup: AgeGroup;
  ageLabel: string;
  price: number; // In Toman
  originalPrice?: number; // In Toman (if discounted)
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  isSpecialDeal?: boolean;
  images: string[];
  description: string;
  features: string[];
  specifications: {
    material: string;
    dimensions: string;
    weight: string;
    brand: string;
    country: string;
  };
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  notes?: string;
  paymentMethod: 'online' | 'cod';
}

export interface Order {
  id: string;
  trackingCode: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  details: OrderDetails;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface FilterState {
  searchQuery: string;
  category: Category | 'all';
  ageGroup: AgeGroup | 'all';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'discount';
  minPrice: number;
  maxPrice: number;
  onlyInStock: boolean;
  onlyDiscounted: boolean;
}

export interface AIGiftFinderRequest {
  childAge: string;
  childGender: string;
  interests: string[];
  budget: string;
  goal: string;
}

export interface AIGiftFinderResult {
  recommendationReason: string;
  recommendedProductIds: string[];
  tipsForParents: string[];
}
