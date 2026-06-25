import apiClient from "../../../lib/apiClient";

export async function createInterviewReport({ jobDescription, selfDescription }) {
  const response = await apiClient.post("/api/interview", {
    jobDescription,
    selfDescription
  });

  return response.data;
}

export async function getInterviewReports() {
  const response = await apiClient.get("/api/interview");

  return response.data;
}

export async function getInterviewReportById(reportId) {
  const response = await apiClient.get(`/api/interview/${reportId}`);

  return response.data;
}