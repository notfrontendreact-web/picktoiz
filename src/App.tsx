import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, AgeGroup, Category } from './types';

// Components
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { HeroSlider } from './components/HeroSlider';
import { AgeFilterPills } from './components/AgeFilterPills';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AIGiftFinderModal } from './components/AIGiftFinderModal';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SpecialDeals } from './components/SpecialDeals';
import { TrustBadges } from './components/TrustBadges';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  Smile, 
  Check, 
  RotateCcw,
  Boxes
} from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular' | 'discount'>('newest');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  // Cart, Wishlist, Compare States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAIFinderOpen, setIsAIFinderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  // Fetch products from server API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedAgeGroup !== 'all') params.append('ageGroup', selectedAgeGroup);
        if (sortBy) params.append('sortBy', sortBy);
        if (onlyInStock) params.append('onlyInStock', 'true');
        if (onlyDiscounted) params.append('onlyDiscounted', 'true');

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error('Error fetching products:', e);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, selectedAgeGroup, sortBy, onlyInStock, onlyDiscounted]);

  // Cart Calculations
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cartItems]);

  // Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.name}" به سبد خرید اضافه شد.`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`"${product.name}" از علاقه‌مندی‌ها حذف شد.`);
        return prev.filter((p) => p.id !== product.id);
      }
      showToast(`"${product.name}" به علاقه‌مندی‌ها اضافه شد.`);
      return [...prev, product];
    });
  };

  const handleToggleCompare = (product: Product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        showToast('حداکثر ۴ اسباب‌بازی را می‌توانید همزمان مقایسه کنید.');
        return prev;
      }
      showToast(`"${product.name}" به جدول مقایسه اضافه شد.`);
      return [...prev, product];
    });
  };

  const handleCheckoutTrigger = (discount: number, _code: string) => {
    setAppliedDiscount(discount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
  };

  const cartProductIds = useMemo(() => cartItems.map((i) => i.product.id), [cartItems]);
  const wishlistProductIds = useMemo(() => wishlistProducts.map((p) => p.id), [wishlistProducts]);
  const compareProductIds = useMemo(() => compareProducts.map((p) => p.id), [compareProducts]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col dir-rtl">
      
      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlistProducts.length}
        compareCount={compareProducts.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenAIFinder={() => setIsAIFinderOpen(true)}
        allProducts={PRODUCTS}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Category Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Hero Banner */}
      <HeroSlider
        onOpenAIFinder={() => setIsAIFinderOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Age Filter Bar */}
      <AgeFilterPills
        selectedAgeGroup={selectedAgeGroup}
        onSelectAgeGroup={(age) => setSelectedAgeGroup(age)}
      />

      {/* Special Deals Countdown Section */}
      <SpecialDeals
        products={PRODUCTS}
        wishlistIds={wishlistProductIds}
        compareIds={compareProductIds}
        cartIds={cartProductIds}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Main Catalog Grid & Filters */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        
        {/* Catalog Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Boxes size={22} className="text-amber-500" />
              <span>فهرست اسباب‌بازی‌ها</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              نمایش {products.length} محصول باکیفیت و استاندارد
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            
            {/* Sorting */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span className="text-slate-400">مرتب‌سازی:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-xl py-1.5 px-3 focus:outline-none focus:border-amber-500 font-bold"
              >
                <option value="newest">جدیدترین و پرفروش‌ترین</option>
                <option value="popular">محبوب‌ترین خریداران</option>
                <option value="discount">بیشترین تخفیف٪</option>
                <option value="price-asc">ارزان‌ترین به گران‌ترین</option>
                <option value="price-desc">گران‌ترین به ارزان‌ترین</option>
              </select>
            </div>

            {/* Checkbox Toggles */}
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-xl">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>فقط موجودی انبار</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-xl">
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>فقط تخفیف‌دارها</span>
            </label>

          </div>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Smile size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-extrabold text-slate-700 mb-1">هیچ اسباب‌بازی با این مشخصات یافت نشد</h3>
            <p className="text-xs text-slate-400 mb-4">لطفا فیلترهای سنی یا عبارت جستجو را تغییر دهید.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedAgeGroup('all');
                setOnlyInStock(false);
                setOnlyDiscounted(false);
              }}
              className="bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
            >
              پاک کردن تمامی فیلترها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistProductIds.includes(product.id)}
                isInCompare={compareProductIds.includes(product.id)}
                isInCart={cartProductIds.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onToggleCompare={handleToggleCompare}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Trust Guarantees */}
      <TrustBadges />

      {/* Footer */}
      <Footer />

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isInWishlist={quickViewProduct ? wishlistProductIds.includes(quickViewProduct.id) : false}
        isInCompare={quickViewProduct ? compareProductIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutTrigger}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onQuickView={(p) => {
          setIsWishlistOpen(false);
          setQuickViewProduct(p);
        }}
      />

      {/* Comparison Modal */}
      <ProductComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProducts={compareProducts}
        onRemoveFromCompare={(id) => setCompareProducts((prev) => prev.filter((p) => p.id !== id))}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* AI Gift Finder Modal */}
      <AIGiftFinderModal
        isOpen={isAIFinderOpen}
        onClose={() => setIsAIFinderOpen(false)}
        allProducts={PRODUCTS}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onQuickView={(p) => {
          setIsAIFinderOpen(false);
          setQuickViewProduct(p);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountAmount={appliedDiscount}
        onOrderCompleted={handleOrderCompleted}
      />

    </div>
  );
}
