"use client";

import { useState } from "react";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        window.location.href = "/api/auth/redirect";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
            {/* Grid background pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

            {/* Main content container */}
            <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Header section */}
                    <div className="text-center">
                        {/* Logo/Icon placeholder */}
                        <div className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/20">
                            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Destiny Quest Optimizer</h1>
                        <p className="text-lg text-gray-400 mb-8">Optimize your Guardian's journey</p>
                    </div>

                    {/* Login card */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/20 p-8">
                        <div className="space-y-6">
                            {/* Welcome message */}
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-white mb-2">Welcome, Guardian!</h2>
                                <p className="text-gray-400">Sign in with your Bungie account to begin</p>
                            </div>

                            {/* Login button */}
                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-600/25 hover:shadow-xl hover:shadow-slate-500/30 transform hover:-translate-y-0.5"
                            >
                                {/* Bungie logo/icon */}
                                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </span>

                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Connecting...
                                    </div>
                                ) : (
                                    "Sign in with Bungie"
                                )}
                            </button>

                            {/* Disclaimer */}
                            <div className="text-center pt-4">
                                <p className="text-xs text-gray-500">
                                    By signing in, you agree to share your Destiny 2 character data with this
                                    application
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Powered by the Bungie API • Not affiliated with Bungie</p>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
            <div
                className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                style={{ animationDelay: "2s" }}
            />
        </div>
    );
}
