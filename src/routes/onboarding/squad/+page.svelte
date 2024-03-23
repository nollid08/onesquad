<script lang="ts">
	import type { PageData } from './$types';
	import countries from '$lib/static/countries';
	import { onboarding } from '$lib/stores/onboarding';
	export let data: PageData;

	$onboarding.country = '';
	$onboarding.name = '';
	$onboarding.image = undefined;
	let files: FileList;
	$: {
		if (files) {
			const file: File = files.item(0)!;
			$onboarding.image = file;
		}
	}
</script>

<form class="form-control justify-center gap-4" action="/onboarding/manager" method="GET">
	<label class="input input-bordered flex items-center gap-2">
		<input
			type="text"
			class="grow"
			placeholder="Squad Name"
			name="name"
			bind:value={$onboarding.name}
			required
		/>
	</label>
	<input
		type="file"
		class="file-input file-input-bordered w-full max-w-xs"
		required
		accept="image/*"
		name="logo"
		bind:files
	/>

	<select
		class="select select-bordered w-full max-w-xs"
		required
		name="country"
		bind:value={$onboarding.country}
	>
		<option value="" disabled selected>Select Country</option>
		{#each Object.entries(countries) as country}
			<option value={country[0]}>{country[1].name}</option>
		{/each}
	</select>
	<button type="submit" class="btn btn-primary">Next</button>
</form>
