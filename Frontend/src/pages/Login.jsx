import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../features/auth/hooks/useAuth";

function Login() {
    const navigate = useNavigate();
    const { login, authError, isAuthLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await login(formData);
            navigate("/");
        } catch {
            // Error message already lives in authError.
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950">
            <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_440px]">
                <div className="hidden lg:block">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        InterviewPilot
                    </p>
                    <h1 className="mt-4 max-w-xl text-5xl font-bold tracking-tight text-slate-950">
                        Turn every job post into a focused interview plan.
                    </h1>
                    <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
                        Analyze your resume, compare it with a role, and prepare with targeted questions, gaps, and a practical roadmap.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            Welcome back
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
                            Log in to your account
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Continue building your interview preparation workspace.
                        </p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit} autoComplete="off">
                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-slate-700"
                                htmlFor="email"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-slate-700"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {authError ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {authError}
                            </div>
                        ) : null}

                        <button
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                            type="submit"
                            disabled={isAuthLoading}
                        >
                            {isAuthLoading ? "Logging in..." : "Log in"}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        New to InterviewPilot?{" "}
                        <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/register">
                            Create an account
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Login;