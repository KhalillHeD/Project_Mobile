import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert, // NEW: for confirm dialog
} from "react-native";
import { useRouter } from "expo-router";

import AuroraBackground from "../components/AuroraBackground";
import PrimaryButton from "../components/PrimaryButton";
import { useAppContext } from "../context/AppContext";
import { fetchMyJobs, deleteJob } from "../jsr/jobs";
import { Job } from "../data/jobs";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";
import JobOfferCard from "../components/JobOfferCard";

const RecruiterJobsScreen = () => {
  const router = useRouter();
  const { role, accessToken } = useAppContext() as any;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!accessToken || role !== "recruiter") return;

      setLoading(true);
      setError(null);

      try {
        const data = (await fetchMyJobs(accessToken)) as Job[];
        setJobs(data);
      } catch (e: any) {
        const msg =
          e?.data?.detail ||
          (typeof e?.data === "string" ? e.data : JSON.stringify(e?.data)) ||
          e?.message ||
          "Failed to load jobs.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [accessToken, role]);

  // hide for jobseekers
  if (role !== "recruiter") return null;

  // NEW: show a confirm dialog before actually deleting
  const handleDeleteJob = (id: number) => {
    if (!accessToken) return;

    Alert.alert(
      "Delete job",
      "Are you sure you want to delete this job offer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setError(null);
              await deleteJob(accessToken, id);
              setJobs((prev) => prev.filter((job) => job.id !== id));
            } catch (e: any) {
              const msg =
                e?.data?.detail ||
                (typeof e?.data === "string" ? e.data : JSON.stringify(e?.data)) ||
                e?.message ||
                "Failed to delete job.";
              setError(msg);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // NEW: Edit passes the full job as JSON to AddJobScreen; Delete calls the confirm handler
  const renderItem = ({ item }: { item: Job }) => (
    <View style={styles.cardWrapper}>
      <JobOfferCard job={item} />
      <View style={styles.cardActionsRow}>
        <PrimaryButton
          title="Edit"
          variant="outline"
          onPress={() =>
            router.push({
              pathname: "/add-job",
              params: { job: JSON.stringify(item) }, // NEW: send full job for prefill
            })
          }
        />

        <PrimaryButton
          title="Delete"
          variant="ghost"
          onPress={() => handleDeleteJob(item.id)}
        />
      </View>
    </View>
  );

  return (
    <AuroraBackground>
      <View style={styles.safe}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My job offers</Text>
        </View>

        <View style={styles.actionsRow}>
          <PrimaryButton
            title="Create new job"
            onPress={() => router.push("/add-job")}
            variant="solid"
          />
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {!loading && error && (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={jobs}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>
                You have not created any job offers yet.
              </Text>
            }
          />
        )}
      </View>
    </AuroraBackground>
  );
};

export default RecruiterJobsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  headerRow: {
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
  },
  actionsRow: {
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  cardWrapper: {
    gap: Spacing.xs,
  },
  card: {
    backgroundColor: "rgba(28,31,46,0.9)",
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    ...Shadow,
  },
  cardActionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  jobMeta: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  jobShort: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#f87171",
    fontWeight: "700",
  },
  empty: {
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    marginTop: Spacing.lg,
  },
});















































// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   FlatList,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import { Plus, MapPin, Users } from 'lucide-react-native';
// import { useAppContext } from '../context/AppContext';
// import { Job } from '../data/jobs';

// export const RecruiterJobsScreen = ({ navigation }: any) => {
//   const { jobs } = useAppContext();

//   const handleAddJob = () => {
//     navigation.navigate('AddJob');
//   };

//   const renderJobItem = ({ item }: { item: Job }) => (
//     <View style={styles.jobItem}>
//       <Image source={{ uri: item.companyLogo }} style={styles.logo} />
//       <View style={styles.jobInfo}>
//         <Text style={styles.jobTitle}>{item.title}</Text>
//         <View style={styles.locationRow}>
//           <MapPin size={16} color="#666" strokeWidth={2} />
//           <Text style={styles.location}>{item.location}</Text>
//         </View>
//         <View style={styles.interestedRow}>
//           <Users size={16} color="#34C759" strokeWidth={2} />
//           <Text style={styles.interestedText}>
//             {item.interestedCount || 0} interested
//           </Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>My Jobs</Text>
//         <Text style={styles.subtitle}>{jobs.length} active postings</Text>
//       </View>

//       <FlatList
//         data={jobs}
//         renderItem={renderJobItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//       />

//       <TouchableOpacity style={styles.fab} onPress={handleAddJob}>
//         <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   header: {
//     paddingHorizontal: 24,
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E5E5',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#1A1A1A',
//   },
//   subtitle: {
//     fontSize: 15,
//     color: '#666',
//     marginTop: 4,
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   jobItem: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   logo: {
//     width: 70,
//     height: 70,
//     borderRadius: 14,
//     marginRight: 16,
//   },
//   jobInfo: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   jobTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1A1A1A',
//     marginBottom: 8,
//   },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginBottom: 6,
//   },
//   location: {
//     fontSize: 14,
//     color: '#666',
//   },
//   interestedRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   interestedText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#34C759',
//   },
//   fab: {
//     position: 'absolute',
//     right: 24,
//     bottom: 24,
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
// });
