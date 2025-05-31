import { useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { products, type ProductId } from '@/stripe-config';

export function useStripe() {
  const { user } = useAuth();

  const createCheckoutSession = useCallback(
    async (productId: ProductId) => {
      if (!user) {
        throw new Error('User must be logged in');
      }

      const product = products[productId];

      if (!product) {
        throw new Error('Invalid product');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          success_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/checkout/cancel`,
          mode: product.mode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('No checkout URL returned');
      }

      window.location.href = url;
    },
    [user],
  );

  return {
    createCheckoutSession,
  };
}