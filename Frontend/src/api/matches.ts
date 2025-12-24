import { apiRequest } from "./client";

export async function fetchMatches(token: string) {
  return apiRequest("/api/matches/", {}, token);
}
