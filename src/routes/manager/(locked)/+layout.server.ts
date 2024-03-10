import { isAthlete, isManager } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const userIsManager = await isManager(locals);
    if (!userIsManager) {
        redirect(303, "/");
    }
    return {};
}) satisfies LayoutServerLoad;