import React, { useMemo, useState } from "react";
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
import { useRouter } from "expo-router";

import  AuroraBackground  from "../components/AuroraBackground";
import PrimaryButton from "../components/PrimaryButton";
import TextInputField from "../components/TextInputField";

import { useAppContext } from "../context/AppContext";
import { registerUser, loginUser, fetchMe } from "../api/auth";

import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Colors } from "../theme/colors";
console.log("AuroraBackground:", AuroraBackground);
console.log("PrimaryButton:", PrimaryButton);
console.log("TextInputField:", TextInputField);


const SignupScreen = () => {
  const router = useRouter();
  const { role: intendedRole, setRole, setUser, setAccessToken, setRefreshToken } = useAppContext();
  // Core fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Recruiter extras (keep if your backend expects them; if not, they are harmless)
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(
    () => (intendedRole === "recruiter" ? "Recruiter Signup" : "Jobseeker Signup"),
    [intendedRole]
  );
  
const handleSignup = async () => {
  setLoading(true);
  setError(null);

  try {
    await registerUser({
      username: username.trim(),
      email: email.trim(),
      password,
      role: intendedRole || "jobseeker",
      company_name: company.trim(),
      position_title: position.trim(),
    });

    const login = await loginUser({ username: username.trim(), password });

    const access = login?.access as string | undefined;
    const refresh = login?.refresh as string | undefined;

    if (!access || !refresh) {
      setError("Signup succeeded but login failed (missing tokens). Please try logging in.");
      return;
    }

    await setAccessToken(access);
    await setRefreshToken(refresh);

    // 3) fetch profile
    const me = await fetchMe(access);
    const backendRole = me?.role;

    if (!backendRole) {
      setError("Signup/login worked but role missing from profile.");
      return;
    }

    // enforce role selected
    if (intendedRole && backendRole !== intendedRole) {
      await setAccessToken(null);
      await setRefreshToken(null);
      setError(`This account is a ${backendRole}, but you selected ${intendedRole}.`);
      return;
    }

    await setRole(backendRole);

    // MeSerializer returns { id, name, email, role, ... }
    await setUser({
      id: String(me.id ?? ""),
      name: me.name ?? "",                 // ✅ use me.name (not me.username)
      email: me.email ?? "",
      role: backendRole,
      avatar: me.avatar ?? null,

      company: me.company_name ?? "",
      bio: me.bio ?? "",
      skills: me.skills ?? "",
      yearsOfExperience: me.experience_years ?? 0,  // ✅ backend is experience_years
    } as any);

    router.replace("/matches");
  } catch (e: any) {
    console.log("Signup error:", e);
    // your apiRequest throws {status, data}
    const msg =
      e?.data?.detail ||
      (typeof e?.data === "string" ? e.data : null) ||
      "Signup failed. Please check your inputs.";
    setError(msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <AuroraBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header (same tone as login) */}
            <View style={styles.header}>
              <Text style={styles.brand}>JobSwipe</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>Create your account to get started</Text>
            </View>

            {/* Solid dark card (NOT transparent) */}
            <View style={styles.card}>
              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.form}>
                <TextInputField
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="your_username"
                />

                <TextInputField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                />

                <TextInputField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a strong password"
                  secureTextEntry
                />

                {intendedRole === "recruiter" && (
                  <>
                    <TextInputField
                      label="Company Name"
                      value={company}
                      onChangeText={setCompany}
                      placeholder="Acme Corp"
                    />
                    <TextInputField
                      label="Position"
                      value={position}
                      onChangeText={setPosition}
                      placeholder="Talent Acquisition"
                    />
                  </>
                )}

                <PrimaryButton
                  title={loading ? "Creating account..." : "Sign up"}
                  onPress={handleSignup}
                  disabled={loading}
                  variant="solid"
                />

                {loading && (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color={Colors.primary} />
                    <Text style={styles.loadingText}>Setting things up…</Text>
                  </View>
                )}

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <PrimaryButton
                  title="Continue with Google"
                  onPress={() => {}}
                  variant="outline"
                />

                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  style={styles.bottomLink}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bottomText}>
                    Already have an account?{" "}
                    <Text style={styles.bottomTextStrong}>Log in</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: 28 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuroraBackground>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: "center",
  },

  header: { alignItems: "center", marginBottom: 22 },
  brand: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.6,
  },
  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
  },

  // Key change: solid dark card
  card: {
    backgroundColor: "#1C1F2E",
    borderRadius: Radius.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  form: { gap: 16 },

  errorBox: {
    backgroundColor: "rgba(254,242,242,0.95)",
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  errorText: { color: "#991B1B", fontSize: 13, fontWeight: "700", lineHeight: 18 },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 6,
  },
  loadingText: { color: "rgba(255,255,255,0.78)", fontSize: 13, fontWeight: "600" },

  divider: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.14)" },
  dividerText: {
    marginHorizontal: 14,
    color: "rgba(255,255,255,0.68)",
    fontSize: 13,
    fontWeight: "700",
  },

  bottomLink: { marginTop: 4, alignItems: "center" },
  bottomText: { fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
  bottomTextStrong: { color: "#fff", fontWeight: "900" },
});
