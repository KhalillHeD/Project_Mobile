import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import AuroraBackground from "../components/AuroraBackground";
import { useAppContext } from "../context/AppContext";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";

import { Job, fetchMyJobs } from "../jsr/jobs";

type Role = "jobseeker" | "recruiter";

export default function RrecruiterJobScreen() {
  const router = useRouter();
  const { role, accessToken } = useAppContext() as {
    role: Role;
    accessToken: string | null;
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setErrorText(null);

    try {
      const data = (await fetchMyJobs(accessToken)) as Job[];
      setJobs(data);
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        (typeof e?.data === "string" ? e.data : JSON.stringify(e?.data)) ||
        e?.message ||
        "Failed to load your job offers.";
      setErrorText(msg);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (role !== "recruiter" || !accessToken) return;
    load();
  }, [role, accessToken, load]);

  if (role !== "recruiter") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.error}>Only recruiters can see this screen.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <AuroraBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>My Job Offers</Text>
            <Text style={styles.subtitle}>{jobs.length} job(s)</Text>
          </View>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push("/add-job")}
            activeOpacity={0.85}
          >
            <Text style={styles.createText}>Create new job</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : errorText ? (
          <View style={styles.center}>
            <Text style={styles.error}>{errorText}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={load} activeOpacity={0.85}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : jobs.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.muted}>No job offers yet. Tap “Create new job”.</Text>
          </View>
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(j: any) => String(j.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }: { item: any }) => (
              <View style={styles.card}>
                <Text style={styles.jobTitle}>{item.title}</Text>

                {!!item.company_name && <Text style={styles.meta}>{item.company_name}</Text>}

                <View style={styles.metaRow}>
                  {!!item.category && <Text style={styles.metaChip}>{item.category}</Text>}
                  {!!item.governorate && <Text style={styles.metaChip}>{item.governorate}</Text>}
                </View>

                {!!item.short_description && (
                  <Text style={styles.desc} numberOfLines={2}>
                    {item.short_description}
                  </Text>
                )}
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => router.push("/my-jobs")}
            activeOpacity={0.85}
          >
            <Text style={styles.outlineText}>View my job offers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineBtn} onPress={load} activeOpacity={0.85}>
            <Text style={styles.outlineText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },

  headerRow: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 32, fontWeight: "900", color: Colors.text, letterSpacing: -0.6 },
  subtitle: { marginTop: 4, fontSize: 14, fontWeight: "700", color: Colors.textMuted },

  createBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    ...Shadow,
  },
  createText: { color: "#fff", fontWeight: "900" },

  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg, gap: Spacing.md },

  card: {
    backgroundColor: "rgba(15,18,32,0.78)",
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: Spacing.lg,
    ...Shadow,
  },
  jobTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  meta: { marginTop: 6, color: "rgba(255,255,255,0.78)", fontWeight: "700" },

  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  metaChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
    overflow: "hidden",
  },

  desc: { marginTop: 10, color: "rgba(255,255,255,0.72)", fontWeight: "600", lineHeight: 20 },

  bottomRow: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg, flexDirection: "row", gap: 10 },
  outlineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: { color: "#fff", fontWeight: "900" },

  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  muted: { color: Colors.textMuted, fontWeight: "700", textAlign: "center" },
  error: { color: "#f87171", fontWeight: "700", textAlign: "center" },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  retryText: { color: "#fff", fontWeight: "900" },
});
