/**
 * Subscription Service
 * Handles Stripe checkout and subscription management
 */

import api from './api';

export interface CurrentSubscription {
  tier: 'FREE' | 'PRO' | 'PREMIUM';
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PortalResponse {
  url: string;
}

const subscriptionService = {
  /**
   * Get the current user's subscription status
   */
  async getCurrentSubscription(): Promise<CurrentSubscription> {
    const response = await api.get<CurrentSubscription>('/subscriptions/current');
    return response.data;
  },

  /**
   * Create a Stripe Checkout session and redirect to Stripe
   * @param tier - 'PRO' or 'PREMIUM'
   */
  async createCheckoutSession(tier: 'PRO' | 'PREMIUM'): Promise<CheckoutSessionResponse> {
    const response = await api.post<CheckoutSessionResponse>('/subscriptions/create-checkout', {
      tier,
    });

    return response.data;
  },

  /**
   * Redirect user to Stripe Checkout for upgrading
   */
  async redirectToCheckout(tier: 'PRO' | 'PREMIUM'): Promise<void> {
    const session = await this.createCheckoutSession(tier);
    // Redirect to Stripe hosted checkout
    window.location.href = session.url;
  },

  /**
   * Get a link to the Stripe Customer Portal (manage billing/cancel)
   */
  async getPortalUrl(): Promise<string> {
    const response = await api.get<PortalResponse>('/subscriptions/portal');
    return response.data.url;
  },

  /**
   * Open the Stripe Customer Portal in the same tab
   */
  async redirectToPortal(): Promise<void> {
    const url = await this.getPortalUrl();
    window.location.href = url;
  },

  /**
   * Cancel subscription at end of period
   */
  async cancelSubscription(): Promise<{ message: string; cancelAt: string }> {
    const response = await api.post<{ message: string; cancelAt: string }>('/subscriptions/cancel');
    return response.data;
  },

  /**
   * Reactivate a subscription that was scheduled for cancellation
   */
  async reactivateSubscription(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/subscriptions/reactivate');
    return response.data;
  },

  /**
   * DEV ONLY: Manually change the user's tier in the DB
   */
  async changeTier(tier: 'FREE' | 'PRO' | 'PREMIUM'): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/subscriptions/change-tier', { tier });
    return response.data;
  },
};

export default subscriptionService;
