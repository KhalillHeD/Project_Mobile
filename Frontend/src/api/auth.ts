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
    avatar?: string | null; // URI for file upload
  }
) {
  // Check if we have a file to upload
  if (payload.avatar && payload.avatar.startsWith('file://')) {
    // Handle file upload with FormData
    const formData = new FormData();

    // Add text fields
    if (payload.name !== undefined) formData.append('name', payload.name);
    if (payload.email !== undefined) formData.append('email', payload.email);
    if (payload.skills !== undefined) formData.append('skills', payload.skills);
    if (payload.bio !== undefined) formData.append('bio', payload.bio);
    if (payload.experience_years !== undefined) formData.append('experience_years', payload.experience_years?.toString() || '');
    if (payload.company_name !== undefined) formData.append('company_name', payload.company_name);
    if (payload.position_title !== undefined) formData.append('position_title', payload.position_title);

    // Add avatar file
    const filename = payload.avatar.split('/').pop() || 'avatar.jpg';
    const fileType = filename.split('.').pop()?.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';

    formData.append('avatar', {
      uri: payload.avatar,
      name: filename,
      type: fileType,
    } as any);

    return apiRequest(
      "/api/auth/me/",
      {
        method: "PATCH",
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, let the browser set it with boundary
        }
      },
      accessToken
    );
  } else {
    // Handle regular JSON update (including avatar URL removal)
    const jsonPayload = { ...payload };
    if (payload.avatar !== undefined) {
      jsonPayload.avatar = payload.avatar; // null or URL string
    }

    return apiRequest(
      "/api/auth/me/",
      { method: "PATCH", body: JSON.stringify(jsonPayload) },
      accessToken
    );
  }
}
