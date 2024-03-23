<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="flex flex-col h-full">
	<div class="navbar bg-base-100">
		<div class="flex-1">
			<a class="btn btn-ghost text-xl" href="/">OneSquad Manager Dashboard</a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/onboarding/squad">Add Athletes</a></li>
			</ul>
		</div>
	</div>
	<slot />
</div>
