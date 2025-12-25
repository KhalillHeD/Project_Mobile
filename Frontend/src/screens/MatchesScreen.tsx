import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useAppContext } from "../context/AppContext";
import { Job } from "../data/jobs";
import { fetchMatches } from "../api/matches";
import { useRouter } from "expo-router";

import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";

const MatchesScreen = () => {
  const router = useRouter();
  const { token } = useAppContext();

  const [matches, setMatches] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setError(null);
        const data = await fetchMatches(token);

        const mapped: Job[] = data.map((m: any) => ({
          id: String(m.job),
          title: m.job_title,
          company: m.company_name,
          description: "",
          location: "",
          salaryRange: "",
          companyLogo: "https://via.placeholder.com/120",
        }));

        setMatches(mapped);
      } catch {
        setError("Failed to load matches.");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [token]);

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
        <Text style={styles.hint}>You matched with this job</Text>
      </View>

      <ChevronRight size={22} color={Colors.textMuted} strokeWidth={2.2} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Matches" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Matches" />
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!token || matches.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Matches" />
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyText}>
            Swipe right on jobs you like to start conversations.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Matches"
        subtitle={`${matches.length} job${matches.length > 1 ? "s" : ""}`}
      />

      <FlatList
        data={matches}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textMuted,
  },

  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow,
  },

  logo: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    marginRight: Spacing.md,
    backgroundColor: Colors.backgroundMuted,
  },

  info: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
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
    color: Colors.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
  error: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "700",
  },
});
