# Svelte Stripe Table Components

This repository contains Svelte components for easily displaying a Stripe pricing table in your Svelte application.

## Components

### `PricingTable`

![hero](/static/screenshot.jpg)

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

For a reference implementation with stripe checkout see src/routes/pricing-table

## Stripe Dashboard first
The idea is to configure everything inside of stripe. 

To display a pill above a product add a `pill` metadata entry to the product.

To display the feature list add the `marketing_features`.

## Setup

## Install with jsrepo

**Initialize jsrepo**:

```bash
jsrepo init @https://github.com/simonhackler/svelte-stripe-table
```

**Install components**:

```bash
jsrepo add 
```