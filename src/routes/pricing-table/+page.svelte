<script lang="ts">
	import PricingTable from '$lib/components/ui/stripe-table/pricing-table.svelte';

    let { data } = $props();
</script>

<main class="flex w-full justify-center p-8">
  <PricingTable {...data} currency="eur"/>
</main>
