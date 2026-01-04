import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

import AuroraBackground from "../components/AuroraBackground";
import { useAppContext, API_BASE } from "../context/AppContext";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";
import { Colors } from "../theme/colors";

type ApiMatch = {
  id: number;
  job: number;
  job_title: string;
  company_name: string;
  jobseeker_name: string;
  created_at: string;
  status: "accepted"; // jobseeker endpoint returns accepted only
};

export default function JobseekerMatchesScreen() {
  const router = useRouter();
  const { role, fetchWithAuth } = useAppContext() as any;

  const [matches, setMatches] = useState<ApiMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await fetchWithAuth(`${API_BASE}/api/matches/`);
    if (!res.ok) {
      const txt = await res.text();
      setLoading(false);
      throw new Error(`GET /api/matches/ failed (${res.status}): ${txt}`);
    }

    const data = await res.json();
    setMatches(data);
    setLoading(false);
  }, [fetchWithAuth]);

  useEffect(() => {
    if (role === "jobseeker") load().catch((e) => setError(e.message));
  }, [role, load]);

  const handleMatchPress = (m: ApiMatch) => {
    router.push({
      pathname: "/chat",
      params: { matchId: String(m.id), jobId: String(m.job) },
    });
  };

  if (role !== "jobseeker") return null;

  return (
    <AuroraBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md }}>
          <Text style={{ fontSize: 34, fontWeight: "900", color: "#fff" }}>Matches</Text>
          {matches.length > 0 && (
            <Text style={{ marginTop: 4, fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.75)" }}>
              {matches.length} match{matches.length > 1 ? "es" : ""}
            </Text>
          )}
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontWeight: "700" }}>{error}</Text>
          </View>
        ) : matches.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}>
            <Text style={{ fontSize: 26, fontWeight: "900", color: "#fff", marginBottom: 10 }}>No matches yet</Text>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "rgba(255,255,255,0.75)", textAlign: "center" }}>
              When a recruiter accepts you, it will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(15,18,32,0.78)",
                  borderRadius: Radius.xl,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.12)",
                  padding: Spacing.lg,
                  marginBottom: Spacing.md,
                  ...Shadow,
                }}
                onPress={() => handleMatchPress(item)}
                activeOpacity={0.75}
              >
                {/* optional placeholder image */}
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: Radius.md,
                    marginRight: Spacing.md,
                    backgroundColor: "rgba(255,255,255,0.08)",
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff", marginBottom: 4 }}>
                    {item.job_title}
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: Colors.primary, marginBottom: 6 }}>
                    {item.company_name}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.7)" }}>
                    Recruiter accepted you
                  </Text>
                </View>
                <ChevronRight size={22} color={"rgba(255,255,255,0.55)"} strokeWidth={2.2} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </AuroraBackground>
  );
}
