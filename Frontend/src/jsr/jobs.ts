import { apiRequest } from "../api/client";

export interface CreateJobPayload {
  title: string;
  company_name: string;
  category: string;
  governorate: string;
  location?: string;
  salary_range?: string;
  min_experience_years?: number | null;
  max_experience_years?: number | null;
  skills?: string;
  short_description: string;
  description: string;
  tags?: string;
  image_url?: string;            // NEW
}


export async function fetchJobsForSeeker(accessToken: string) {
  return apiRequest("/api/jobs/", { method: "GET" }, accessToken);
}

export async function likeOrDislikeJob(
  accessToken: string,
  jobId: number,
  action: "like" | "dislike"
) {
  return apiRequest(
    `/api/jobs/${jobId}/like/`,
    { method: "POST", body: JSON.stringify({ action }) },
    accessToken
  );
}

export async function createJob(accessToken: string, payload: CreateJobPayload) {
  return apiRequest(
    "/api/my-jobs/",
    { method: "POST", body: JSON.stringify(payload) },
    accessToken
  );
}

export async function fetchMyJobs(accessToken: string) {
  return apiRequest("/api/my-jobs/", { method: "GET" }, accessToken);
}

// ----- NEW: update & delete helpers -----

export async function updateJob(
  accessToken: string,
  jobId: number,
  payload: Partial<CreateJobPayload>
) {
  return apiRequest(
    `/api/jobs/${jobId}/`,
    { method: "PUT", body: JSON.stringify(payload) },
    accessToken
  );
}

export async function deleteJob(accessToken: string, jobId: number) {
  return apiRequest(
    `/api/jobs/${jobId}/`,
    { method: "DELETE" },
    accessToken
  );
}
