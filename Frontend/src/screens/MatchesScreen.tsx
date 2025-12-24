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
      } catch (e: any) {
        setError("Failed to load matches.");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [token]);

  const handleJobPress = (job: Job) => {
    // Only do this if you have app/chat.tsx (or similar)
    // Passing objects via params is usually done by serializing:
    router.push({
      pathname: "/chat",
      params: { job: JSON.stringify(job) },
    });
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobItem}
      onPress={() => handleJobPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.companyLogo }} style={styles.logo} />
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.company}>{item.company}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <ChevronRight size={24} color="#999" strokeWidth={2} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
        </View>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!token || matches.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Matches Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start swiping to find jobs you're interested in!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Matches</Text>
        <Text style={styles.subtitle}>{matches.length} jobs you liked</Text>
      </View>

      <FlatList
        data={matches}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MatchesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  jobItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  company: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
