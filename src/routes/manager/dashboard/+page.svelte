<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid place-items-center h-full">
	<div class="text-center">
		<h1>Logged In As Manager</h1>
		<br />
		<form action="?/logout" method="POST">
			<button type="submit" class="btn btn-accent">Logout</button>
		</form>
	</div>
</div>
