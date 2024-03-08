<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid place-items-center h-full m-2">
	<div class="p-10 bg-black/25 rounded-xl prose">
		<h1 class="mx-auto w-max">Manager Registration</h1>
		<form class="form-control justify-center min-h-40" method="post">
			<div class="h-full flex flex-row justify-around items-center">
				<label class="input input-bordered flex items-center gap-2 m-2">
					<input type="text" class="grow" placeholder="First name" name="firstName" required />
				</label>
				<label class="input input-bordered flex items-center gap-2 m-2">
					<input type="text" class="grow" placeholder="Last Name" name="lastName" required />
				</label>
			</div>

			<label class="input input-bordered flex items-center gap-2 my-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="w-4 h-4 opacity-70"
					><path
						d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
					/><path
						d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
					/></svg
				>
				<input type="email" class="grow" placeholder="Email" name="email" />
			</label>

			<label class="input input-bordered flex items-center gap-2 my-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="w-4 h-4 opacity-70"
					><path
						fill-rule="evenodd"
						d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
						clip-rule="evenodd"
					/></svg
				>
				<input type="password" class="grow" placeholder="Password" name="password" />
			</label>
			<button type="submit" class="btn btn-primary btn-wide my-7 mx-auto">Register</button>
		</form>
	</div>
</div>
