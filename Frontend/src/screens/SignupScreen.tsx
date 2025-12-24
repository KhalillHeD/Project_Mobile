import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { TextInputField } from "../components/TextInputField";
import { useAppContext } from "../context/AppContext";
import { registerUser } from "../api/auth";
import { useRouter } from "expo-router";

export const SignupScreen = () => {
  const { role } = useAppContext();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // extra fields per role
  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [bio, setBio] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [positionTitle, setPositionTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!role) {
      setError("Please choose Jobseeker or Recruiter first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        username: name.trim() || email.trim(),
        email: email.trim(),
        password,
        role,

        // extra profile fields
        skills,
        experience_years: experienceYears ? Number(experienceYears) : null,
        bio,
        company_name: companyName,
        position_title: positionTitle,
      };

      console.log("Signup payload:", payload);

      await registerUser(payload);

      // ✅ after signup, go to login (keep same role in context)
      router.replace("/login");
    } catch (e: any) {
      console.log("Signup error:", e);
      const msg =
        e?.data?.username?.[0] ||
        e?.data?.email?.[0] ||
        e?.data?.password?.[0] ||
        e?.data?.role?.[0] ||
        e?.data?.detail ||
        "Signup failed. Please check your details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login"); // requires app/login.tsx
  };

  const roleTitle = role === "recruiter" ? "Recruiter Signup" : "Jobseeker Signup";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{roleTitle}</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>
          </View>

          <View style={styles.form}>
            {error && <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>}

            <TextInputField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
            />

            <TextInputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a strong password"
              secureTextEntry
            />

            {role === "jobseeker" && (
              <>
                <TextInputField
                  label="Skills"
                  value={skills}
                  onChangeText={setSkills}
                  placeholder="React, Node, SQL"
                />
                <TextInputField
                  label="Years of experience"
                  value={experienceYears}
                  onChangeText={setExperienceYears}
                  keyboardType="numeric"
                  placeholder="3"
                />
                <TextInputField
                  label="Short Bio"
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell recruiters about you"
                />
              </>
            )}

            {role === "recruiter" && (
              <>
                <TextInputField
                  label="Company Name"
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder="Acme Corp"
                />
                <TextInputField
                  label="Position"
                  value={positionTitle}
                  onChangeText={setPositionTitle}
                  placeholder="Talent Acquisition"
                />
              </>
            )}

            <PrimaryButton
              title={loading ? "Signing up..." : "Sign up"}
              onPress={handleSignup}
              style={styles.signupButton}
              disabled={loading}
            />

            {loading && <ActivityIndicator style={{ marginTop: 8 }} color="#007AFF" />}

            <TouchableOpacity onPress={handleLogin} style={styles.loginPrompt}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: "800", color: "#1A1A1A", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666" },
  form: { flex: 1 },
  signupButton: { marginTop: 8, marginBottom: 24 },
  loginPrompt: { marginTop: 16, alignItems: "center" },
  loginText: { fontSize: 15, color: "#666" },
  loginLink: { color: "#007AFF", fontWeight: "600" },
});
