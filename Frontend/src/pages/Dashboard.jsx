import { LogOut, Sparkles, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";

function Dashboard() {
    const { user, logout, isAuthLoading } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            // Error state is handled in auth context.
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            InterviewPilot
                        </p>
                        <h1 className="text-xl font-bold tracking-tight">
                            Interview workspace
                        </h1>
                    </div>

                    <button
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        onClick={handleLogout}
                        disabled={isAuthLoading}
                    >
                        <LogOut className="h-4 w-4" />
                        {isAuthLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </header>

            <section className="mx-auto max-w-6xl px-6 py-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Signed in as</p>
                    <h2 className="mt-1 text-2xl font-bold">
                        {user?.username || "User"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                    New analysis
                                </p>
                                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                                    Create an interview plan
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                    Soon you will paste a job description, upload your resume, and generate a role-specific preparation plan.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                                <Sparkles className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                            <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
                            <h3 className="mt-3 font-semibold">Report form coming next</h3>
                            <p className="mt-1 text-sm text-slate-500">
                                This is where Day 4 will add resume upload and job description inputs.
                            </p>
                        </div>
                    </section>

                    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Progress
                        </p>
                        <div className="mt-5 space-y-4">
                            <div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Backend foundation</span>
                                    <span className="text-emerald-600">Done</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-full rounded-full bg-emerald-500" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Authentication</span>
                                    <span className="text-emerald-600">Done</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-full rounded-full bg-emerald-500" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Interview reports</span>
                                    <span className="text-slate-500">Next</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-1/4 rounded-full bg-blue-500" />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

export default Dashboard;