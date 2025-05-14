<script lang="ts">
	import Stripe from 'stripe';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
	import Check from '@lucide/svelte/icons/check';
	import { cn } from '$lib/utils/utils';

	interface Props {
		price: Stripe.Price;
		class?: string;
		locale?: string;
		activeSubProductId?: string | null;
		currency?: string;
	}
	let { price, class: className, locale = 'en-US', activeSubProductId, currency }: Props = $props();

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

<Card.Root class={cn(className, 'relative flex flex-col justify-between gap-4')}>
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
		{#if recurring}
			<span class="text-sm text-slate-400">/{price.recurring?.interval}</span>
		{/if}
		<form action="?/checkout" method="POST">
			<input type="hidden" name="price" value={price.id} />
			<input type="hidden" name="mode" value={recurring ? 'subscription' : 'payment'} />
			<Button variant="default" class="w-full" type="submit">{buttonText}</Button>
		</form>
	</Card.Content>
	<Card.Footer class="flex-grow">
		<ul class="text-sm">
			{#each product.marketing_features as feature}
				<li class="flex items-center gap-2">
					<Check class="size-3" />
					<p>{feature.name}</p>
				</li>
			{/each}
		</ul>
	</Card.Footer>
</Card.Root>
