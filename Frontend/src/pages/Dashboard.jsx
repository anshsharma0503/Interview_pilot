import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BriefcaseBusiness,
    FileText,
    Loader2,
    LogOut,
    Sparkles,
    UserRound
} from "lucide-react";

import { useAuth } from "../features/auth/hooks/useAuth";
import { createInterviewReport } from "../features/interview/services/interviewApi";

function Dashboard() {
    const { user, logout, isAuthLoading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        jobDescription: "",
        selfDescription: ""
    });

    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [generatedReport, setGeneratedReport] = useState(null);
    const [recentReports, setRecentReports] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            // Error state is handled in auth context.
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));

        setFormError("");
        setFormSuccess("");
        setGeneratedReport(null);
    }

    async function handleGenerateReport(event) {
        event.preventDefault();

        setFormError("");
        setFormSuccess("");

        if (formData.jobDescription.trim().length < 50) {
            setFormError("Paste a job description with at least 50 characters.");
            return;
        }

        if (formData.selfDescription.trim().length < 30) {
            setFormError("Write a self description with at least 30 characters.");
            return;
        }

        try {
            setIsGenerating(true);

            const result = await createInterviewReport({
                jobDescription: formData.jobDescription,
                selfDescription: formData.selfDescription
            });

            const report = result.data.report;

            setGeneratedReport(report);
            setRecentReports((currentReports) => [report, ...currentReports]);
            setFormData({
                jobDescription: "",
                selfDescription: ""
            });
            setFormSuccess("Mock interview report created successfully.");
            navigate(`/interview/${report.id}`);
        } catch (error) {
            const message =
                error.response?.data?.message || "Unable to create interview report";

            setFormError(message);
        } finally {
            setIsGenerating(false);
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
                                    Paste a role description and summarize your background. InterviewPilot will turn both into a focused preparation plan.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                                <Sparkles className="h-6 w-6" />
                            </div>
                        </div>

                        <form className="mt-6 space-y-5" onSubmit={handleGenerateReport}>
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label
                                        className="flex items-center gap-2 text-sm font-medium text-slate-700"
                                        htmlFor="jobDescription"
                                    >
                                        <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                                        Target job description
                                    </label>
                                    <span className="text-xs text-slate-400">
                                        {formData.jobDescription.length} characters
                                    </span>
                                </div>
                                <textarea
                                    className="min-h-44 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    id="jobDescription"
                                    name="jobDescription"
                                    placeholder="Paste the full job description here..."
                                    value={formData.jobDescription}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label
                                        className="flex items-center gap-2 text-sm font-medium text-slate-700"
                                        htmlFor="selfDescription"
                                    >
                                        <UserRound className="h-4 w-4 text-slate-400" />
                                        Your background
                                    </label>
                                    <span className="text-xs text-slate-400">
                                        {formData.selfDescription.length} characters
                                    </span>
                                </div>
                                <textarea
                                    className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    id="selfDescription"
                                    name="selfDescription"
                                    placeholder="Summarize your skills, projects, experience, and target role context..."
                                    value={formData.selfDescription}
                                    onChange={handleChange}
                                />
                            </div>

                            {formError ? (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {formError}
                                </div>
                            ) : null}

                            {formSuccess ? (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {formSuccess}
                                </div>
                            ) : null}

                            {generatedReport ? (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-500">
                                                Generated preview
                                            </p>
                                            <h3 className="mt-1 text-lg font-bold text-slate-950">
                                                {generatedReport.title}
                                            </h3>
                                        </div>
                                        <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                                            {generatedReport.matchScore}% match
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {generatedReport.summary}
                                    </p>
                                </div>
                            ) : null}

                            <button
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto sm:px-5"
                                type="submit"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Preparing...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="h-4 w-4" />
                                        Generate mock report
                                    </>
                                )}
                            </button>
                        </form>
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

                        <div className="mt-8 border-t border-slate-200 pt-6">
                            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Recent mock reports
                            </p>

                            {recentReports.length === 0 ? (
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Generated reports will appear here during this session.
                                </p>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {recentReports.map((report, index) => (
                                        <div
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                            key={`${report.id}-${index}`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-950">
                                                        {report.title}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {report.createdAt
                                                            ? new Date(report.createdAt).toLocaleString()
                                                            : "Temporary session report"}
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                                    {report.matchScore}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

export default Dashboard;