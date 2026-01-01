import { apiRequest } from "./client";

export async function loginUser(payload: { username: string; password: string }) {
  return apiRequest("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<{ access: string; refresh: string }>;
}

export async function fetchMe(accessToken: string) {
  return apiRequest("/api/auth/me/", { method: "GET" }, accessToken);
}

export async function refreshAccess(refreshToken: string) {
  return apiRequest("/api/auth/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh: refreshToken }),
  }) as Promise<{ access: string }>;
}

export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
  role: "jobseeker" | "recruiter";
  company_name?: string;
  position_title?: string;
  skills?: string;
  bio?: string;
  experience_years?: number | null;
}) {
  return apiRequest("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMe(
  accessToken: string,
  payload: {
    name?: string;
    email?: string;
    skills?: string;
    bio?: string;
    experience_years?: number | null;
    company_name?: string;
    position_title?: string;
  }
) {
  return apiRequest(
    "/api/auth/me/",
    { method: "PATCH", body: JSON.stringify(payload) },
    accessToken
  );
}
