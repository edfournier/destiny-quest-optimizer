"use client";

import { signIn } from "next-auth/react";

export default function Login() {
    return <button onClick={() => signIn("bungie", { callbackUrl: "/dashboard" })}>Sign in with Bungie</button>;
}
