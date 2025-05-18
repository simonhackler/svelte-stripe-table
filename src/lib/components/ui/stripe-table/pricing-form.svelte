<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	interface Props {
		priceId: string;
		mode: 'subscription' | 'payment';
		buttonText: string;
	}
	let { priceId, mode, buttonText }: Props = $props();
</script>

<form action="?/checkout" method="POST" class="w-full">
	<input type="hidden" name="price" value={priceId} />
	<input type="hidden" name="mode" value={mode} />
	<Button variant="default" class="w-full" type="submit">{buttonText}</Button>
</form>
