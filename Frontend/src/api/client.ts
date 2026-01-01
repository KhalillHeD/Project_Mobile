const API_BASE_URL = "http://localhost:8000";

export async function apiRequest(
  path: string,
  options: RequestInit = {},
  token?: string | null
) {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data;
}
