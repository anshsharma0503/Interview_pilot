import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    FilePenLine,
    FileText,
    Lightbulb,
    ListChecks,
    Loader2,
    MessageSquareText
} from "lucide-react";

import { getInterviewReportById } from "../features/interview/services/interviewApi";

function InterviewReport() {
    const { reportId } = useParams();

    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState("");

    useEffect(() => {
        async function loadReport() {
            try {
                setIsLoading(true);
                setPageError("");

                const result = await getInterviewReportById(reportId);
                setReport(result.data.report);
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Unable to load interview report";

                setPageError(message);
            } finally {
                setIsLoading(false);
            }
        }

        loadReport();
    }, [reportId]);

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading report...
                </div>
            </main>
        );
    }

    if (pageError) {
        return (
            <main className="min-h-screen bg-slate-50 px-6 py-8">
                <div className="mx-auto max-w-6xl">
                    <Link
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
                        to="/"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </Link>

                    <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {pageError}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950">
            <section className="mx-auto max-w-6xl px-6 py-8">
                <Link
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                    to="/"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to dashboard
                </Link>

                <header className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                <FileText className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                    Interview report
                                </p>

                                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                                    {report.title}
                                </h1>

                                <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
                                    {report.summary}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 rounded-lg bg-emerald-50 px-5 py-3 text-center">
                            <p className="text-2xl font-bold text-emerald-700">
                                {report.matchScore}%
                            </p>
                            <p className="text-xs font-semibold text-emerald-700">
                                Job match
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-slate-200 pt-5 text-sm">
                        <p className="text-slate-500">
                            Report ID:{" "}
                            <span className="font-mono text-slate-700">
                                {report.id}
                            </span>
                        </p>

                        <p className="text-slate-500">
                            Created:{" "}
                            <span className="font-medium text-slate-700">
                                {report.createdAt
                                    ? new Date(
                                          report.createdAt
                                      ).toLocaleString()
                                    : "Not available"}
                            </span>
                        </p>
                    </div>
                </header>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <h2 className="text-lg font-bold">Strengths</h2>
                        </div>

                        <ul className="mt-5 space-y-3">
                            {report.strengths?.map((strength, index) => (
                                <li
                                    className="flex gap-3 text-sm leading-6 text-slate-600"
                                    key={`${strength}-${index}`}
                                >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            <h2 className="text-lg font-bold">Skill gaps</h2>
                        </div>

                        <ul className="mt-5 space-y-3">
                            {report.skillGaps?.map((gap, index) => (
                                <li
                                    className="flex gap-3 text-sm leading-6 text-slate-600"
                                    key={`${gap}-${index}`}
                                >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                    {gap}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <MessageSquareText className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-bold">
                            Interview questions
                        </h2>
                    </div>

                    <div className="mt-5 divide-y divide-slate-200">
                        {report.interviewQuestions?.map((item, index) => (
                            <article
                                className="py-5 first:pt-0 last:pb-0"
                                key={`${item.question}-${index}`}
                            >
                                <div className="flex gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                        {index + 1}
                                    </span>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {item.question}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            <span className="font-semibold text-slate-700">
                                                Why it matters:
                                            </span>{" "}
                                            {item.reason}
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-blue-700">
                                            <span className="font-semibold">
                                                Preparation:
                                            </span>{" "}
                                            {item.preparationTip}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <ListChecks className="h-5 w-5 text-violet-600" />
                            <h2 className="text-lg font-bold">
                                Preparation plan
                            </h2>
                        </div>

                        <ol className="mt-5 space-y-4">
                            {report.preparationPlan?.map((step, index) => (
                                <li
                                    className="flex gap-3 text-sm leading-6 text-slate-600"
                                    key={`${step}-${index}`}
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                                        {index + 1}
                                    </span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <FilePenLine className="h-5 w-5 text-cyan-600" />
                            <h2 className="text-lg font-bold">
                                Resume suggestions
                            </h2>
                        </div>

                        <ul className="mt-5 space-y-4">
                            {report.resumeSuggestions?.map(
                                (suggestion, index) => (
                                    <li
                                        className="flex gap-3 text-sm leading-6 text-slate-600"
                                        key={`${suggestion}-${index}`}
                                    >
                                        <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-cyan-600" />
                                        {suggestion}
                                    </li>
                                )
                            )}
                        </ul>
                    </section>
                </div>
            </section>
        </main>
    );
}

export default InterviewReport;