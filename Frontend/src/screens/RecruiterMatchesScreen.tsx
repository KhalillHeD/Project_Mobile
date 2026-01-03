import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
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
  createdAt: string; // simple string for now
  status: "pending" | "accepted" | "rejected";
};

export default function RecruiterMatchesScreen() {
  const { role } = useAppContext() as any;
  const [tab, setTab] = useState<"matches" | "likes">("likes");

  // TEMP dummy data: replace with API later
  const [likes, setLikes] = useState<RecruiterLike[]>([
    {
      id: 1,
      jobTitle: "Backend Engineer",
      jobseekerName: "Mahdi",
      createdAt: "2026-01-03",
      status: "pending",
    },
    {
      id: 2,
      jobTitle: "Frontend Engineer",
      jobseekerName: "Sarra",
      createdAt: "2026-01-03",
      status: "pending",
    },
  ]);

  if (role !== "recruiter") return null;

  const pendingCount = useMemo(
    () => likes.filter((l) => l.status === "pending").length,
    [likes]
  );
  const accepted = useMemo(
    () => likes.filter((l) => l.status === "accepted"),
    [likes]
    );
  const accept = (id: number) =>
    setLikes((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "accepted" } : x))
    );

  const reject = (id: number) =>
    setLikes((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "rejected" } : x))
    );

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

        {tab === "matches" ? (
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
    data={likes}
    keyExtractor={(i) => String(i.id)}
    contentContainerStyle={styles.list}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        <Text style={styles.sub}>From: {item.jobseekerName}</Text>
        <Text style={styles.sub}>Date: {item.createdAt}</Text>
        <Text style={styles.sub}>Status: {item.status}</Text>

        {item.status === "pending" && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => accept(item.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => reject(item.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.actionText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
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
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { color: "#fff", fontSize: 34, fontWeight: "900", letterSpacing: -0.6 },
  subtitle: { marginTop: 4, color: "rgba(255,255,255,0.75)", fontWeight: "700" },

  tabs: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  tabActive: { backgroundColor: "rgba(255,255,255,0.12)" },
  tabText: { color: "#fff", fontWeight: "900" },

  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
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
  acceptBtn: {
    flex: 1,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: "rgba(34,197,94,0.25)",
  },
  rejectBtn: {
    flex: 1,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: "rgba(239,68,68,0.25)",
  },
  actionText: { color: "#fff", textAlign: "center", fontWeight: "900" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: "rgba(255,255,255,0.7)", fontWeight: "700" },
});
