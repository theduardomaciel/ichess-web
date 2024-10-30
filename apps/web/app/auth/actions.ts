'use server'

import { signIn } from "@ichess/auth"

export async function login(callbackUrl?: string) {
    await signIn("google", {
        callbackUrl: callbackUrl || "/auth",
    });
}