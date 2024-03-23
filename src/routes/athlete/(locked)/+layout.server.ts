import { isAthlete } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load = (async ({ locals }) => {
    const userIsAthlete = await isAthlete(locals);
    if (!userIsAthlete) {
        redirect(303, "/");
    }
    return {};
}) satisfies LayoutServerLoad;