<script lang="ts">
	import Stripe from 'stripe';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';

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

<Card.Root class={className}>
	<Card.Header>
		<Card.Title>{product.name}</Card.Title>
		<Card.Description>{product.description}</Card.Description>
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
	</Card.Header>
</Card.Root>
