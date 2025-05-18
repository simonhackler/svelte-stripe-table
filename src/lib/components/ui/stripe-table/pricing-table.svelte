<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Stripe from 'stripe';
	import PricingOptionButtonDown from './pricing-option-button-down.svelte';
	import PricingOptionButtonMiddle from './pricing-option-button-middle.svelte';

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
	<div class="mb-4 flex w-full justify-center">
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
	{#snippet pricingList(prices: Stripe.Price[], type: 'monthly' | 'annually' | 'one-time')}
		<Tabs.Content value={type}>
			<div class="grid gap-4 md:grid-cols-3 md:grid-rows-[repeat(3,auto)] md:gap-y-0 xl:w-[1200px]">
				{#each prices as price}
					<PricingOptionButtonMiddle
						{price}
						{locale}
						{currency}
						activeSubProductId={subProductId}
						class="row-span-3 grid grid-cols-subgrid grid-rows-subgrid"
					/>
				{/each}
			</div>
		</Tabs.Content>
	{/snippet}
	{@render pricingList(monthly, 'monthly')}
	{@render pricingList(annually, 'annually')}
	{@render pricingList(oneTime, 'one-time')}
</Tabs.Root>
