<script lang="ts">
	import type { PageData } from './$types';
	import { onboarding } from '$lib/stores/onboarding';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { PutObjectCommand } from '@aws-sdk/client-s3';
	export let data: PageData;

	let emblem: HTMLImageElement;
	let imageResult: string | ArrayBuffer | null = null;
	onMount(() => {
		const reader = new FileReader();
		reader.addEventListener('load', function () {
			imageResult = reader.result;
			emblem.setAttribute('src', imageResult as string);
		});
		undefined;
		if ($onboarding.image && $onboarding.image.type != undefined) {
			console.log($onboarding.image.type);
			reader.readAsDataURL($onboarding.image);
		}
	});
</script>

<div class="bg-white/25 rounded-lg p-5 w-5/6">
	<div class="flex flex-row h-12 prose justify-between min-w-full">
		<img bind:this={emblem} class="aspect-square h-ful block m-0 p-0" src="" alt="" />
		<div class="flex flex-row justify-between items-center">
			<div class="flex flex-row">
				<h1 class="m-0 p-1">{$onboarding.name}</h1>
				<img
					src="https://flagcdn.com/h60/{$onboarding.country?.toLowerCase()}.png"
					srcset="https://flagcdn.com/h120/{$onboarding.country?.toLowerCase()}.png 2x"
					alt="Country Flag"
					class="h-10 border border-black/25 m-1"
				/>
			</div>
		</div>
	</div>
</div>
<div class="w-5/6 h-full flex justify-center mt-10">
	<div class="prose max-w-fit">
		<h1 class="">Enter Manager Details</h1>
		<form
			method="POST"
			class="form-control"
			use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
				// `formElement` is this `<form>` element
				// `formData` is its `FormData` object that's about to be submitted
				// `action` is the URL to which the form is posted
				// calling `cancel()` will prevent the submission
				// `submitter` is the `HTMLElement` that caused the form to be submitted
				if (!imageResult) {
					cancel();
				}
				const imageData = $onboarding.image;

				if (imageData) {
					const getPresignedUrlResponse = await fetch('/api/upload', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							fileName: imageData.name,
							fileType: imageData.type
						})
					});

					if (!getPresignedUrlResponse.ok) {
						console.error('Failed to get presigned URL');
					}

					const { presignedUrl, objectKey } = await getPresignedUrlResponse.json();

					const uploadToR2Response = await fetch(presignedUrl, {
						method: 'PUT',
						headers: {
							'Content-Type': imageData.type
						},
						body: imageData
					});

					if (!uploadToR2Response.ok) {
						console.error('Failed to upload file to R2');
					}
					formData.append('emblem', uploadToR2Response.url);
				}
			}}
		>
			<div class="flex flex-row gap-5">
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">First Name</span>
					</div>
					<input
						name="firstName"
						type="text"
						placeholder=""
						class="input input-bordered w-full max-w-xs"
					/>
				</label>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Last Name</span>
					</div>
					<input
						name="lastName"
						type="text"
						placeholder=""
						class="input input-bordered w-full max-w-xs"
					/>
				</label>
			</div>
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Email</span>
				</div>
				<input name="email" type="tel" required class="input input-bordered w-full max-w-xs" />
			</label>
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Phone Number</span>
				</div>
				<input
					name="phoneNumber"
					type="tel"
					required
					class="input input-bordered w-full max-w-xs"
				/>
			</label>
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Password</span>
				</div>
				<input
					name="password"
					type="password"
					placeholder=""
					class="input input-bordered w-full max-w-xs"
				/>
			</label>
			<input type="hidden" name="squadName" value={$onboarding.name} />
			<input type="hidden" name="country" value={$onboarding.country} />
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Submit</span>
				</div>
				<button type="submit" class="btn btn-primary max-w-full"> Submit </button>
			</label>
		</form>
	</div>
</div>
