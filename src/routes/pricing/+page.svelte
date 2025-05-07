<script lang="ts">
	import PricingTable from '$lib/components/ui/stripe-table/pricing-table.svelte';


  let { data, form } = $props();
</script>

<main class="flex w-full justify-center">
  <PricingTable {...data} />
</main>
