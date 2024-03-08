import { client } from '$lib/server/db';
import { Argon2id } from 'oslo/password';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    if (locals.user) {
        redirect(303, "/manager/dashboard");
    }
    return {};
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request, cookies }) => {


        const formData = await request.formData();
        const email = formData.get("email");
        if (!email || typeof email !== "string") {
            return new Response("Invalid email", {
                status: 400
            });
        }
        const password = formData.get("password");
        if (!password || typeof password !== "string") {
            return fail(400, {
                message: "Invalid Submission"
            });
        }

        let user;

        try {
            user = await client.manager.findUniqueOrThrow({
                where: {
                    email: email
                }
            });
        } catch (err) {
            return fail(400, {
                message: "Invalid email or password"
            });
        }

        if (!user) {
            return fail(400, {
                message: "Invalid email or password"
            });
        }

        const validPassword = await new Argon2id().verify(user.hashedPassword, password);
        if (!validPassword) {
            return fail(400, {
                message: "Invalid email or password"
            });
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });


        redirect(303, "/manager/dashboard");
    },
} satisfies Actions;