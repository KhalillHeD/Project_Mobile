import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";

import AuroraBackground from "../components/AuroraBackground";
import { useAppContext } from "../context/AppContext";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";

type RecruiterLike = {
  id: number;
  jobTitle: string;
  jobseekerName: string;
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
};

const API_BASE =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

export default function RecruiterMatchesScreen() {
  const { role, accessToken } = useAppContext() as any;
  const [tab, setTab] = useState<"matches" | "likes">("likes");
  const [items, setItems] = useState<RecruiterLike[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);

    const res = await fetch(`${API_BASE}/api/matches/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      setLoading(false);
      throw new Error(`GET /api/matches/ failed (${res.status}): ${txt}`);
    }

    const data = await res.json();

    // Requires backend MatchSerializer to return:
    // id, job_title, jobseeker_name, created_at, status
    const mapped: RecruiterLike[] = data.map((m: any) => ({
      id: m.id,
      jobTitle: m.job_title,
      jobseekerName: m.jobseeker_name,
      createdAt: m.created_at,
      status: m.status,
    }));

    setItems(mapped);
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    if (role === "recruiter") {
      load().catch((e) => setError(e.message));
    }
  }, [role, load]);

  const pending = useMemo(() => items.filter((x) => x.status === "pending"), [items]);
  const accepted = useMemo(() => items.filter((x) => x.status === "accepted"), [items]);

  const updateStatus = async (id: number, status: "accepted" | "rejected") => {
    if (!accessToken) return;

    const res = await fetch(`${API_BASE}/api/matches/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`PATCH /api/matches/${id}/ failed (${res.status}): ${txt}`);
    }

    await load();
  };

  if (role !== "recruiter") return null;

  const pendingCount = pending.length;

  return (
    <AuroraBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
          <Text style={styles.subtitle}>
            {pendingCount} incoming like{pendingCount === 1 ? "" : "s"}
          </Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "matches" && styles.tabActive]}
            onPress={() => setTab("matches")}
            activeOpacity={0.8}
          >
            <Text style={styles.tabText}>Matches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === "likes" && styles.tabActive]}
            onPress={() => setTab("likes")}
            activeOpacity={0.8}
          >
            <Text style={styles.tabText}>Likes</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.muted}>{error}</Text>
          </View>
        ) : tab === "matches" ? (
          accepted.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.muted}>No matches yet.</Text>
              <Text style={styles.muted}>Accept a like to create a match.</Text>
            </View>
          ) : (
            <FlatList
              data={accepted}
              keyExtractor={(i) => String(i.id)}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                  <Text style={styles.sub}>Matched with: {item.jobseekerName}</Text>
                  <Text style={styles.sub}>Date: {item.createdAt}</Text>
                  <Text style={styles.sub}>Status: {item.status}</Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
              showsVerticalScrollIndicator={false}
            />
          )
        ) : (
          <FlatList
            data={pending}
            keyExtractor={(i) => String(i.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                <Text style={styles.sub}>From: {item.jobseekerName}</Text>
                <Text style={styles.sub}>Date: {item.createdAt}</Text>
                <Text style={styles.sub}>Status: {item.status}</Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => updateStatus(item.id, "accepted").catch((e) => setError(e.message))}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => updateStatus(item.id, "rejected").catch((e) => setError(e.message))}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { color: "#fff", fontSize: 34, fontWeight: "900", letterSpacing: -0.6 },
  subtitle: { marginTop: 4, color: "rgba(255,255,255,0.75)", fontWeight: "700" },
  tabs: { flexDirection: "row", gap: 10, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  tabActive: { backgroundColor: "rgba(255,255,255,0.12)" },
  tabText: { color: "#fff", fontWeight: "900" },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  card: {
    backgroundColor: "rgba(15,18,32,0.78)",
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: Spacing.lg,
    ...Shadow,
  },
  jobTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.75)", fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10, marginTop: Spacing.md },
  acceptBtn: { flex: 1, padding: 10, borderRadius: Radius.md, backgroundColor: "rgba(34,197,94,0.25)" },
  rejectBtn: { flex: 1, padding: 10, borderRadius: Radius.md, backgroundColor: "rgba(239,68,68,0.25)" },
  actionText: { color: "#fff", textAlign: "center", fontWeight: "900" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: "rgba(255,255,255,0.7)", fontWeight: "700" },
});
