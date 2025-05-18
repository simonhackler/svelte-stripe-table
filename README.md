# Svelte Stripe Table Components

This repository contains Svelte components for easily displaying Stripe pricing tables in your Svelte applications.

## Features

*   Display one-time, monthly, and annually recurring prices from Stripe.
*   Automatic tabbed navigation for different billing intervals (Monthly, Annually, One-time).
*   Customizable locale and currency display.
*   Highlights active subscriptions.
*   Integrates with Stripe product metadata for additional display options (e.g., "pill" text).

## Components

### `PricingTable`

This is the main component to render the entire pricing table.

**Props:**

*   `prices`: An array of `Stripe.Price` objects.
*   `locale`: (Optional) The locale string for formatting currency (e.g., 'en-US', 'de-DE'). Defaults to 'en-US'.
*   `activeSub`: (Optional) A `Stripe.Subscription` object representing the currently active subscription. This helps in highlighting the active plan.
*   `currency`: (Optional) A string to force a specific currency display if available in `price.currency_options`.

**Example Usage:**

```svelte
<script lang="ts">
  import { PricingTable } from '$lib/components/ui/stripe-table'; // Adjust path as needed
  import type { Stripe } from 'stripe';

  // Fetch your Stripe prices
  let prices: Stripe.Price[] = [];
  let activeSubscription: Stripe.Subscription | null = null;

  // onMount or data loading logic to fetch prices and activeSub
</script>

<PricingTable prices={prices} activeSub={activeSubscription} locale="en-GB" currency="GBP" />
```

### `PricingOption` / `PricingOptionButtonMiddle` / `PricingOptionButtonDown`

These components are used internally by `PricingTable` to render individual pricing plans. You can also use `PricingOption` for more custom layouts.

**`PricingOption` Props:**

*   `price`: A `Stripe.Price` object.
*   `content`: A Svelte snippet for custom rendering of the content within the pricing card. It receives `product`, `price`, `buttonText`, and `formattedPrice` as parameters.
*   `class`: (Optional) CSS classes to apply to the card.
*   `locale`: (Optional) Locale for currency formatting.
*   `activeSubProductId`: (Optional) The ID of the product associated with the active subscription.
*   `currency`: (Optional) Specific currency to display.

### `FeatureList`

Displays marketing features associated with a Stripe Product.

**Props:**

*   `features`: An array of `Stripe.Product.marketing_features`.

## Setup

1.  Install the necessary dependencies (ensure you have Stripe's JS library if you're interacting with Stripe.js).
2.  Import the components into your Svelte files.
3.  Fetch your Stripe Price objects (which should include Product data expanded) from your backend.
4.  Pass the data to the `PricingTable` component.

Make sure your Stripe Products have `marketing_features` set if you want to display a list of features for each plan. You can also add a `pill` entry in the product's `metadata` to display a small badge above a pricing option (e.g., "Most Popular").
