<script lang="ts">
	import Stripe from 'stripe';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils/utils';
	import PricingForm from './pricing-form.svelte';
	import FeatureList from './feature-list.svelte'; // Added import for FeatureList
	import type { Snippet } from 'svelte';

	interface Props {
		price: Stripe.Price;
        content: Snippet<[Stripe.Product, Stripe.Price, string, string]>;
		class?: string;
		locale?: string;
		activeSubProductId?: string | null;
		currency?: string;
	}
	let { price, content, class: className, locale = 'en-US', activeSubProductId, currency }: Props = $props();

	const recurring = price.recurring != null;
	const product = price.product as Stripe.Product;
	const isSub = activeSubProductId === product.id;
	const buttonText = isSub ? 'Manage' : recurring ? 'Subscribe' : 'Buy';

	let unitAmount = price.unit_amount || 0 / 100;
	let currencyFormat = price.currency;
	if (currency && price?.currency_options?.[currency] != null) {
		unitAmount = price.currency_options[currency]?.unit_amount || 0 / 100;
		currencyFormat = currency;
	}

	// This could be moved outside the component
	const formattedPrice = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currencyFormat.toUpperCase(),
		currencyDisplay: 'narrowSymbol',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(unitAmount / 100);
</script>

{#snippet mainContent(product: Stripe.Product, price: Stripe.Price, buttonText: string)}
	<!-- Add the pill metadata to a stripe product to display a pill above the pricing option -->
	{#if product.metadata?.pill && product.metadata.pill != ''}
		<span
			class="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5"
			>{product.metadata.pill}</span
		>
	{/if}
	<Card.Header>
		<Card.Title>{product.name}</Card.Title>
		<Card.Description>{product.description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<span class="text-2xl font-bold">
			{formattedPrice}
		</span>
		{#if price.recurring}
			<span class="text-sm text-slate-400">/{price.recurring?.interval}</span>
		{/if}
		<PricingForm priceId={price.id} mode={recurring ? 'subscription' : 'payment'} {buttonText} />
	</Card.Content>
	<Card.Footer>
		<FeatureList features={product.marketing_features} />
	</Card.Footer>
{/snippet}

<Card.Root class={cn(className, 'relative')}>
    {@render content(product, price, buttonText, formattedPrice)}
</Card.Root>
