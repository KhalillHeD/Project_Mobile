import { apiRequest } from "./client";

export async function loginUser(payload: { username: string; password: string }) {
  return apiRequest("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchMe(token: string) {
  return apiRequest("/api/auth/me/", { method: "GET" }, token);
}

export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
  role: "jobseeker" | "recruiter";
}) {
  return apiRequest("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}