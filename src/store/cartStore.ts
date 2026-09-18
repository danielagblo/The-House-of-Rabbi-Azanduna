import type { Product, ProductVariant, CartItem } from '../types';

type CartListener = () => void;
type QuickViewListener = (product: Product | null) => void;

class CartStore {
  private items: CartItem[] = [];
  private listeners: Set<CartListener> = new Set();
  private quickViewListeners: Set<QuickViewListener> = new Set();
  private isDrawerOpen: boolean = false;
  private activeQuickViewProduct: Product | null = null;
  private currency: string = 'GHS';
  private currencyRates: Record<string, { symbol: string; rate: number }> = {
    GHS: { symbol: 'GH₵', rate: 1.0 },
    USD: { symbol: '$', rate: 0.065 },
    GBP: { symbol: '£', rate: 0.051 },
    EUR: { symbol: '€', rate: 0.060 },
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('oud_attar_cart');
      if (saved) {
        try {
          this.items = JSON.parse(saved);
        } catch (e) {
          this.items = [];
        }
      }
      const savedCurrency = localStorage.getItem('oud_attar_currency');
      if (savedCurrency && this.currencyRates[savedCurrency]) {
        this.currency = savedCurrency;
      }
    }
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);
  }

  getCurrency(): string {
    return this.currency;
  }

  getCurrencySymbol(): string {
    return this.currencyRates[this.currency]?.symbol || 'GH₵';
  }

  formatPrice(amount: number): string {
    const rateInfo = this.currencyRates[this.currency] || this.currencyRates.GHS;
    const converted = amount * rateInfo.rate;
    return `${rateInfo.symbol}${converted.toFixed(2)}`;
  }

  setCurrency(curr: string) {
    if (this.currencyRates[curr]) {
      this.currency = curr;
      if (typeof window !== 'undefined') {
        localStorage.setItem('oud_attar_currency', curr);
      }
      this.notify();
    }
  }

  addItem(product: Product, variant?: ProductVariant, quantity: number = 1) {
    const selectedVariant = variant || product.variants[0] || {
      id: 0,
      size: 'Standard',
      price: product.price,
      inStock: true,
    };

    const existingIndex = this.items.findIndex(
      (item) => item.product.id === product.id && item.selectedVariant.size === selectedVariant.size
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        product,
        selectedVariant,
        quantity,
      });
    }

    this.save();
    this.openDrawer();
    this.notify();
  }

  updateQuantity(productId: number, variantSize: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId, variantSize);
      return;
    }

    const item = this.items.find(
      (i) => i.product.id === productId && i.selectedVariant.size === variantSize
    );
    if (item) {
      item.quantity = quantity;
      this.save();
      this.notify();
    }
  }

  removeItem(productId: number, variantSize: string) {
    this.items = this.items.filter(
      (i) => !(i.product.id === productId && i.selectedVariant.size === variantSize)
    );
    this.save();
    this.notify();
  }

  clearCart() {
    this.items = [];
    this.save();
    this.notify();
  }

  isCartDrawerOpen(): boolean {
    return this.isDrawerOpen;
  }

  openDrawer() {
    this.isDrawerOpen = true;
    this.notify();
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.notify();
  }

  openQuickView(product: Product) {
    this.activeQuickViewProduct = product;
    this.notifyQuickView();
  }

  closeQuickView() {
    this.activeQuickViewProduct = null;
    this.notifyQuickView();
  }

  getActiveQuickView(): Product | null {
    return this.activeQuickViewProduct;
  }

  subscribe(listener: CartListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeQuickView(listener: QuickViewListener): () => void {
    this.quickViewListeners.add(listener);
    return () => this.quickViewListeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private notifyQuickView() {
    this.quickViewListeners.forEach((l) => l(this.activeQuickViewProduct));
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('oud_attar_cart', JSON.stringify(this.items));
    }
  }
}

export const cartStore = new CartStore();
