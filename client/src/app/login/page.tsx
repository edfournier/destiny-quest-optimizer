"use client";

export default function Login() {
    return <button onClick={() => (window.location.href = "/api/auth/redirect")}>Sign in with Bungie</button>;
}
