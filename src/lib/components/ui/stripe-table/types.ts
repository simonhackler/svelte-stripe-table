import type Stripe from "stripe";

export interface PricingOptionProps {
    price: Stripe.Price;
    class?: string;
    locale?: string;
    activeSubProductId?: string | null;
    currency?: string;
}
