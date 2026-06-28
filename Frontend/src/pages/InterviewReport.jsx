import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

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
          error.response?.data?.message || "Unable to load interview report";

        setPageError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [reportId]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-5xl px-6 py-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          to="/"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {isLoading ? (
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading report...
            </div>
          ) : pageError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {pageError}
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                      Interview report
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                      {report.title}
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {report.summary}
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                  {report.matchScore}% match
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Report ID</p>
                  <p className="mt-1 break-all font-mono text-sm text-slate-800">
                    {report.id}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Created</p>
                  <p className="mt-1 text-sm text-slate-800">
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default InterviewReport;