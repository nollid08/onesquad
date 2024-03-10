import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { client } from "$lib/server/db";
import type { Athlete, Manager } from "@prisma/client";


const adapter = new PrismaAdapter(client.session, client.user);
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
            email: attributes.email,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    email: string;
    athlete: Athlete;
    manager: Manager;
}

export function isValidEmail(email: string): boolean {
    return /.+@.+/.test(email);
}

export async function isAthlete(locals: App.Locals): Promise<boolean> {
    const count = await client.athlete.count({
        where: {
            userId: locals.user?.id
        }
    });
    if (count > 0) {
        return true;
    } else {
        return false;
    }
}

export async function isManager(locals: App.Locals): Promise<boolean> {
    const count = await client.manager.count({
        where: {
            userId: locals.user?.id
        }
    });
    if (count > 0) {
        return true;
    } else {
        return false;
    }
}

export async function authCheck({ locals, ifIsManager, ifIsAthlete, ifIsboth, }:
    { locals: App.Locals, ifIsManager: Function, ifIsAthlete: Function, ifIsboth?: Function, }):
    Promise<undefined> {
    const userIsManager = await isManager(locals);
    const userIsAthlete = await isAthlete(locals);
    if (userIsManager && userIsAthlete) {
        if (!!ifIsboth) {
            ifIsboth();
        } else {
            return;
        }
    } if (userIsManager) {
        ifIsManager();
    } else if (userIsAthlete) {
        ifIsAthlete();
    }
}
