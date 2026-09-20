import { API_BASE_URL } from '../config/api';

type DiscountListener = (hasDiscounts: boolean) => void;

class DiscountStore {
  private hasDiscounts: boolean | null = null;
  private listeners: Set<DiscountListener> = new Set();
  private fetchPromise: Promise<boolean> | null = null;

  getHasDiscounts(): boolean | null {
    return this.hasDiscounts;
  }

  subscribe(listener: DiscountListener): () => void {
    this.listeners.add(listener);
    if (this.hasDiscounts !== null) {
      listener(this.hasDiscounts);
    }
    return () => this.listeners.delete(listener);
  }

  async checkDiscounts(): Promise<boolean> {
    if (this.hasDiscounts !== null) {
      return this.hasDiscounts;
    }
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (res.ok) {
          const products = await res.json();
          const hasAny = Array.isArray(products) && products.some(
            (p: any) => p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price)
          );
          this.hasDiscounts = hasAny;
        } else {
          this.hasDiscounts = false;
        }
      } catch (err) {
        this.hasDiscounts = false;
      }
      this.notify();
      return this.hasDiscounts;
    })();

    return this.fetchPromise;
  }

  setHasDiscounts(val: boolean) {
    this.hasDiscounts = val;
    this.notify();
  }

  private notify() {
    if (this.hasDiscounts !== null) {
      this.listeners.forEach((fn) => fn(this.hasDiscounts!));
    }
  }
}

export const discountStore = new DiscountStore();
