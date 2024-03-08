import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { client } from "$lib/server/db";

const adapter = new PrismaAdapter(client.managerSession, client.manager);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: !dev
        }
    },
    getUserAttributes: (attributes) => {
        return {
            // we don't need to expose the hashed password!
            email: attributes.email
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseManagerAttributes;
    }
}

interface DatabaseManagerAttributes {
    email: string;
}

export function isValidEmail(email: string): boolean {
    return /.+@.+/.test(email);
}