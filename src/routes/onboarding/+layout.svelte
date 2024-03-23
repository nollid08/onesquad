<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex align-center flex-col min-h-full p-16">
	<ul class="steps">
		<li class="step step-primary">Squad Details</li>
		<li class="step step-primary" class:step-primary={$page.route.id?.includes('manager')}>
			Manager Details
		</li>
		<li class="step">Athelte Onboarding</li>
	</ul>
	<div
		class="grid place-items-center min-h-[66%] max-h-fit h-fit bg-black/25 rounded-lg p-7 m-10"
		class:step-primary={$page.route.id?.includes('athletes')}
	>
		<slot><!-- optional fallback --></slot>
	</div>
</div>
