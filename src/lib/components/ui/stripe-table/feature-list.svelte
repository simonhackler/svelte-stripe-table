<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import type Stripe from 'stripe';

	interface Props {
		features: Stripe.Product.MarketingFeature[];
	}
	let { features }: Props = $props();
</script>

<ul class="text-sm">
	{#each features as feature}
		<li class="flex items-center gap-2">
			<div>
				<Check class="h-3 w-3" />
			</div>
			<p>{feature.name}</p>
		</li>
	{/each}
</ul>