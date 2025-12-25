import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

import { useAppContext } from "../context/AppContext";
import { Job } from "../data/jobs";

import AuroraBackground from "../components/AuroraBackground";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";

const MatchesScreen = () => {
  const router = useRouter();

  // ✅ this is what swipe is filling
  const { likedJobs } = useAppContext();

  const handleJobPress = (job: Job) => {
    router.push({
      pathname: "/chat",
      params: { job: JSON.stringify(job) },
    });
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleJobPress(item)}
      activeOpacity={0.75}
    >
      <Image source={{ uri: item.companyLogo }} style={styles.logo} />

      <View style={styles.info}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.company}>{item.company}</Text>
        <Text style={styles.hint}>You liked this job</Text>
      </View>

      <ChevronRight size={22} color={"rgba(255,255,255,0.55)"} strokeWidth={2.2} />
    </TouchableOpacity>
  );

  return (
    <AuroraBackground>
      <SafeAreaView style={styles.container}>
        <Header
          title="Matches"
          subtitle={
            likedJobs.length > 0
              ? `${likedJobs.length} job${likedJobs.length > 1 ? "s" : ""} liked`
              : undefined
          }
        />

        {likedJobs.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptyText}>
              Swipe right on jobs you like to start conversations.
            </Text>
          </View>
        ) : (
          <FlatList
            data={likedJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </AuroraBackground>
  );
};

export default MatchesScreen;

/* ---------- Header Component ---------- */
const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
  </View>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  // ✅ transparent so Aurora shows (no white)
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
  },

  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,18,32,0.78)",
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow,
  },

  logo: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    marginRight: Spacing.md,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  info: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 22,
  },
});
