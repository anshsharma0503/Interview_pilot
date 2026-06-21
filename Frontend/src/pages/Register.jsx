import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";

import { useAuth } from "../features/auth/hooks/useAuth";

function Register() {
  const navigate = useNavigate();
  const { register, authError, isAuthLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
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
      await register(formData);
      navigate("/");
    } catch (error) {
      // Error message already lives in authError.
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[440px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Start preparing
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Build a workspace for role-specific interview prep and resume tailoring.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  id="username"
                  name="username"
                  type="text"
                  placeholder="ansh"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
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
              {isAuthLoading ? "Creating account..." : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/login">
              Log in
            </Link>
          </p>
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            InterviewPilot
          </p>
          <h2 className="mt-4 max-w-xl text-5xl font-bold tracking-tight text-slate-950">
            Build interview prep around the role, not generic advice.
          </h2>
          <div className="mt-8 grid max-w-xl gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold">Resume-aware analysis</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Compare your background against a job description and find your strongest signals.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold">Targeted questions</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Prepare technical and behavioral answers for the exact role you want.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;