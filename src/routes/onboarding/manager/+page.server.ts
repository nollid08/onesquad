import { isManager, isValidEmail, lucia } from '$lib/server/auth';
import { Argon2id } from 'oslo/password';
import type { Actions, PageServerLoad } from './$types';
import { generateId } from 'lucia';
import { client } from '$lib/server/db';
import type { Manager, User } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    // if (locals.user) {
    //     const userIsManager = await isManager(locals);
    //     if (userIsManager) {
    //         redirect(303, "/manager/dashboard");
    //     }
    // }
    return {};
}) satisfies PageServerLoad;


export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get("email");
        const password = formData.get("password");
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const squadName = formData.get("squadName");
        const phoneNumber = formData.get("phoneNumber");
        const country = formData.get("country");
        const emblem = formData.get("emblem")?.toString();
        console.table({ email, password, firstName, lastName, squadName, country, phoneNumber })

        if (!email || typeof email !== "string" || !isValidEmail(email)) {
            return fail(400, {
                message: "Invalid email"
            });
        }
        if (!password || typeof password !== "string" || password.length < 6) {
            return fail(400, {
                message: "Invalid password"
            });
        }

        if (!firstName || typeof firstName !== "string") {
            return fail(400, {
                message: "Invalid first name"
            });
        }
        if (!lastName || typeof lastName !== "string") {
            return fail(400, {
                message: "Invalid last name"
            });
        }
        if (!squadName || typeof squadName !== "string") {
            return fail(400, {
                message: "Invalid squad name"
            });
        }
        if (!phoneNumber || typeof phoneNumber !== "string") {
            return fail(400, {
                message: "Invalid phone number"
            });
        }
        if (!country || typeof country !== "string") {
            return fail(400, {
                message: "Invalid country"
            });
        }




        const hashedPassword = await new Argon2id().hash(password);

        try {
            const user: User = await client.user.create({
                data: {
                    email,
                    hashedPassword: hashedPassword,
                    firstName,
                    lastName,
                    Squad: {
                        create: {
                            name: squadName,
                            country,
                            emblem: emblem ?? 'DEFAULTSQUADEMBLEM'
                        }
                    },
                    manager: {
                        create: {
                            mobileNumber: phoneNumber,
                        }
                    }

                }
            });
            const userId = user.id;


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
        console.log('Redirecting...')
        redirect(307, "/manager/dashboard");
    },
} satisfies Actions;