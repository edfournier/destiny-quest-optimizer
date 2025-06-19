"use client";

export default function Login() {
    function redirect() {
        window.location.href = "/api/auth/redirect/bungie";
    }

    return <button onClick={redirect}>Sign in with Bungie</button>;
}
