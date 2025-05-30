export const products = {
  team: {
    priceId: 'price_1RUarLFAl7xvsiHDpKrABz5I',
    name: 'Team',
    description: 'For teams collaborating on prompt engineering projects.',
    mode: 'subscription' as const,
  },
  pro: {
    priceId: 'price_1RUapoFAl7xvsiHDgA6GAx1x',
    name: 'Pro',
    description: 'For professionals who need advanced prompt engineering tools.',
    mode: 'subscription' as const,
  },
} as const;

export type ProductId = keyof typeof products;