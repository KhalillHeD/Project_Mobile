import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Briefcase, UserCircle } from "lucide-react-native";
import PrimaryButton from "../components/PrimaryButton";
import AuroraBackground from "../components/AuroraBackground";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "expo-router";

const RoleSelectionScreen = () => {
  const { setRole } = useAppContext();
  const router = useRouter();

  const handleRoleSelection = (role: "recruiter" | "jobseeker") => {
    setRole(role);
    router.push("/login");
  };

  return (
    <AuroraBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brand}>JobSwipe</Text>
            <Text style={styles.tagline}>Find your perfect match</Text>
          </View>

          {/* Recruiter Card */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleRoleSelection("recruiter")}
          >
            <View style={[styles.iconWrap, styles.iconRecruiter]}>
              <Briefcase size={26} color="#FF4D5A" strokeWidth={2.2} />
            </View>

            <Text style={styles.cardTitle}>I’m hiring</Text>
            <Text style={styles.cardSubtitle}>
              Post jobs and find talented candidates
            </Text>

            <PrimaryButton
              title="Continue as Recruiter"
              onPress={() => handleRoleSelection("recruiter")}
              variant="solid"
            />
          </Pressable>

          {/* Jobseeker Card */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleRoleSelection("jobseeker")}
          >
            <View style={[styles.iconWrap, styles.iconJobseeker]}>
              <UserCircle size={26} color="#34D399" strokeWidth={2.2} />
            </View>

            <Text style={styles.cardTitle}>Looking for work</Text>
            <Text style={styles.cardSubtitle}>
              Discover exciting job opportunities
            </Text>

          <PrimaryButton
              title="Continue as Jobseeker"
              onPress={() => handleRoleSelection("jobseeker")}
              variant="outline"
              style={{
                backgroundColor: "#2A2F45",   // solid, readable
                borderColor: "rgba(255,255,255,0.22)",
                borderWidth: 1,
              }}
              textStyle={{
                color: "#FFFFFF",             // 🔥 readable
                fontWeight: "800",
              }}
          />

            


            
          </Pressable>

          <Text style={styles.footer}>
            Tip: you can switch roles later from Profile.
          </Text>
        </View>
      </SafeAreaView>
    </AuroraBackground>
  );
};

export default RoleSelectionScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  /* Header */
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  brand: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.8,
  },
  tagline: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
  },

  /* Cards */
  card: {
    backgroundColor: "#1C1F2E", // 🔥 solid, readable
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  iconRecruiter: {
    backgroundColor: "rgba(255,77,90,0.15)",
  },
  iconJobseeker: {
    backgroundColor: "rgba(52,211,153,0.15)",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.70)",
    lineHeight: 20,
    marginBottom: 16,
  },

  footer: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
  },
});
