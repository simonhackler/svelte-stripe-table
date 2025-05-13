<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Stripe from 'stripe';
	import PricingOption from './pricing-option.svelte';

	interface Props {
		prices: Stripe.Price[];
		locale: string;
		activeSub?: Stripe.Subscription | null;
		currency?: string;
	}
	let { prices, activeSub, locale, currency }: Props = $props();

	let subProductId = activeSub?.items.data[0].plan.product as string | null;

	const oneTime = prices
		.filter((price) => {
			return price.recurring == null;
		})
		.sort((a, b) => {
			return a.unit_amount - b.unit_amount;
		});

	const recurring = prices
		.filter((price) => {
			return price.recurring != null;
		})
		.sort((a, b) => {
			return a.unit_amount - b.unit_amount;
		});

	const monthly = recurring.filter((price) => {
		return price.recurring!.interval == 'month';
	});

	const annually = recurring.filter((price) => {
		return price.recurring!.interval == 'year';
	});
</script>

<Tabs.Root value="monthly">
	<div class="flex w-full justify-center">
		<Tabs.List>
			{#if monthly.length > 0}
				<Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
			{/if}
			{#if annually.length > 0}
				<Tabs.Trigger value="annually">Annually</Tabs.Trigger>
			{/if}
			{#if oneTime.length > 0}
				<Tabs.Trigger value="one-time">One-time</Tabs.Trigger>
			{/if}
		</Tabs.List>
	</div>
	<Tabs.Content value="monthly">
		<div class="grid gap-2 md:grid-cols-3">
			{#each monthly as price}
				<PricingOption {price} {locale} {currency} activeSubProductId={subProductId} class="w-[400px]"/>
			{/each}
		</div>
	</Tabs.Content>
	<Tabs.Content value="annually">
		<div class="grid gap-2 md:grid-cols-3">
			{#each annually as price}
				<PricingOption {price} {locale} {currency} activeSubProductId={subProductId} />
			{/each}
		</div>
	</Tabs.Content>
	<Tabs.Content value="one-time">
		<div class="grid gap-2 md:grid-cols-3">
			{#each oneTime as price}
				<PricingOption {price} {locale} {currency} />
			{/each}
		</div>
	</Tabs.Content>
</Tabs.Root>
