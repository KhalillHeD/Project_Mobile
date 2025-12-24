
import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Briefcase, UserCircle } from "lucide-react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "expo-router";

const RoleSelectionScreen = () => {
  const { setRole } = useAppContext();
  const router = useRouter();

  // login for selected role
  const handleRoleSelection = (selectedRole: "recruiter" | "jobseeker") => {
    setRole(selectedRole);
    router.push("/login");
  };

  // signup for selected role (use these if you add signup buttons)
  const goToRecruiterSignup = () => {
    setRole("recruiter");
    router.push("/signup");
  };

  const goToJobseekerSignup = () => {
    setRole("jobseeker");
    router.push("/signup");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appName}>JobSwipe</Text>
          <Text style={styles.tagline}>Find Your Perfect Match</Text>
        </View>

        <View style={styles.buttonContainer}>
          <View className="role-card" style={styles.roleCard}>
            <View style={styles.iconContainer}>
              <Briefcase size={48} color="#007AFF" strokeWidth={2} />
            </View>
            <Text style={styles.roleTitle}>I'm Hiring</Text>
            <Text style={styles.roleDescription}>
              Post jobs and find talented candidates
            </Text>
            <PrimaryButton
              title="Continue as Recruiter"
              onPress={() => handleRoleSelection("recruiter")}
              style={styles.button}
            />
            {/* Example extra signup button:
            <PrimaryButton
              title="Sign up as Recruiter"
              onPress={goToRecruiterSignup}
              style={styles.button}
              variant="outline"
            /> */}
          </View>

          <View style={styles.roleCard}>
            <View style={styles.iconContainer}>
              <UserCircle size={48} color="#34C759" strokeWidth={2} />
            </View>
            <Text style={styles.roleTitle}>Looking for Work</Text>
            <Text style={styles.roleDescription}>
              Discover exciting job opportunities
            </Text>
            <PrimaryButton
              title="Continue as Jobseeker"
              onPress={() => handleRoleSelection("jobseeker")}
              style={styles.button}
              variant="secondary"
            />
            {/* Example extra signup button:
            <PrimaryButton
              title="Sign up as Jobseeker"
              onPress={goToJobseekerSignup}
              style={styles.button}
              variant="outline"
            /> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
  buttonContainer: {
    gap: 24,
  },
  roleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    width: "100%",
  },
});
