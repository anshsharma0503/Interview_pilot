import apiClient from "../../../lib/apiClient";

export async function registerUser({ username, email, password }) {
  const response = await apiClient.post("/api/auth/register", {
    username,
    email,
    password
  });

  return response.data;
}

export async function loginUser({ email, password }) {
  const response = await apiClient.post("/api/auth/login", {
    email,
    password
  });

  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get("/api/auth/me");

  return response.data;
}

export async function logoutUser() {
  const response = await apiClient.post("/api/auth/logout");

  return response.data;
}