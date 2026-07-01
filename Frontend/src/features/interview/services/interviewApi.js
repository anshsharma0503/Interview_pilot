import apiClient from "../../../lib/apiClient";

export async function createInterviewReport({
    jobDescription,
    selfDescription,
    resume
}) {
    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resume);

    const response = await apiClient.post(
        "/api/interview",
        formData
    );

    return response.data.data.report;
}

export async function getInterviewReports() {
  const response = await apiClient.get("/api/interview");

  return response.data;
}

export async function getInterviewReportById(reportId) {
  const response = await apiClient.get(`/api/interview/${reportId}`);

  return response.data;
} 

export async function downloadTailoredResume(reportId) {
    const response = await apiClient.get(
        `/api/interview/${reportId}/resume`,
        {
            responseType: "blob"
        }
    );

    return response.data;
}