<script lang="ts">
	import Stripe from 'stripe';
	import * as Card from '$lib/components/ui/card/index.js';
	import PricingForm from './pricing-form.svelte';
	import FeatureList from './feature-list.svelte';
	import PricingOption from './pricing-option.svelte';
	import { type PricingOptionProps } from './types';

	let props: PricingOptionProps = $props();
</script>

<PricingOption {...props}>
	{#snippet content(
		product: Stripe.Product,
		price: Stripe.Price,
		buttonText: string,
		formattedPrice: string
	)}
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
			<FeatureList features={product.marketing_features} />
		</Card.Content>
		<Card.Footer class="flex flex-col justify-between w-full">
			<div class="w-full">
				<span class="text-2xl font-bold">
					{formattedPrice}
				</span>
				{#if price.recurring}
					<span class="text-sm text-slate-400">/{price.recurring?.interval}</span>
				{/if}
			</div>
			<PricingForm
				priceId={price.id}
				mode={price.recurring ? 'subscription' : 'payment'}
				{buttonText}
			/>
		</Card.Footer>
	{/snippet}
</PricingOption>
