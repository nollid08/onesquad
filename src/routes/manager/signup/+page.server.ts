import { isManager, isValidEmail, lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';
import type { Actions, PageServerLoad } from './$types';
import { generateId } from 'lucia';
import { client } from '$lib/server/db';
import type { Manager } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    if (locals.user) {
        const userIsManager = await isManager(locals);
        if (userIsManager) {
            redirect(303, "/manager/dashboard");
        }
    }
    return {};
}) satisfies PageServerLoad;


export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get("email");
        if (!email || typeof email !== "string" || !isValidEmail(email)) {
            return fail(400, {
                message: "Invalid email"
            });
        }
        const password = formData.get("password");
        if (!password || typeof password !== "string" || password.length < 6) {
            return fail(400, {
                message: "Invalid password"
            });
        }
        const firstName = formData.get("firstName");

        if (!firstName || typeof firstName !== "string") {
            return fail(400, {
                message: "Invalid first name"
            });
        }
        const lastName = formData.get("lastName");
        if (!lastName || typeof lastName !== "string") {
            return fail(400, {
                message: "Invalid last name"
            });
        }


        const hashedPassword = await new Argon2id().hash(password);

        try {
            const userId = (await client.user.create({
                data: {
                    email: email,
                    hashedPassword: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    manager: {
                        create: {
                            firstName: firstName,
                            lastName: lastName,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }
                    }
                }
            })).id;


            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });


        } catch (err: any) {
            console.error(err);
            error(403, {
                message: err.message || "An error occurred. Please try again."
            });

        }
        redirect(303, "/manager/dashboard");
    },
} satisfies Actions;