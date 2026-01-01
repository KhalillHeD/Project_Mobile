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

import PrimaryButton from "../components/PrimaryButton";
import TextInputField from "../components/TextInputField";
import AuroraBackground from "../components/AuroraBackground";
import { useAppContext } from "../context/AppContext";
import { loginUser, fetchMe } from "../api/auth";

import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";

export const LoginScreen = () => {
  const router = useRouter();

  const { role: intendedRole, setRole, setUser, setAccessToken, setRefreshToken } =
    useAppContext() as any;

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleTitle = useMemo(
    () => (intendedRole === "recruiter" ? "Recruiter Login" : "Jobseeker Login"),
    [intendedRole]
  );

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser({ username: emailOrUsername.trim(), password });

      if (!data?.access || !data?.refresh) {
        setError("Login failed: missing access/refresh token.");
        return;
      }

      await setAccessToken(data.access);
      await setRefreshToken(data.refresh);

      const me = await fetchMe(data.access);
      const backendRole = me?.role;

      if (!backendRole) {
        setError("Login failed: role missing from /me.");
        return;
      }

      if (intendedRole && backendRole !== intendedRole) {
        await setAccessToken(null);
        await setRefreshToken(null);
        setError(`This account is a ${backendRole}, but you selected ${intendedRole}.`);
        return;
      }

      await setRole(backendRole);

      await setUser({
        id: String(me.id ?? ""),
        name: me.name ?? "", // ✅ correct
        email: me.email ?? "",
        role: backendRole,
        avatar: me.avatar ?? null,

        skills: me.skills ?? "",
        bio: me.bio ?? "",
        experience_years: me.experience_years ?? null,

        company_name: me.company_name ?? "",
        position_title: me.position_title ?? "",
      });

      router.replace("/matches");
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        (typeof e?.data === "string" ? e.data : null) ||
        "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => router.push("/signup");

  return (
    <AuroraBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.brand}>JobSwipe</Text>
              <Text style={styles.title}>{roleTitle}</Text>
              <Text style={styles.subtitle}>Welcome back! Sign in to continue</Text>
            </View>

            <View style={styles.card}>
              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.form}>
                <TextInputField
                  label="Username"
                  value={emailOrUsername}
                  onChangeText={setEmailOrUsername}
                  placeholder="your_username"
                  autoCapitalize="none"
                />

                <TextInputField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                />

                <PrimaryButton
                  title={loading ? "Logging in..." : "Login"}
                  onPress={handleLogin}
                  style={styles.loginButton}
                  disabled={loading}
                  variant="solid"
                />

                {loading && (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color={Colors.primary} />
                    <Text style={styles.loadingText}>Signing you in…</Text>
                  </View>
                )}

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <PrimaryButton title="Continue with Google" onPress={() => {}} variant="outline" />

                <TouchableOpacity onPress={handleSignup} style={styles.signupPrompt} activeOpacity={0.8}>
                  <Text style={styles.signupText}>
                    Don&apos;t have an account? <Text style={styles.signupLink}>Sign up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: Spacing.xl }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuroraBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    justifyContent: "center",
  },

  header: { alignItems: "center", marginBottom: Spacing.xl },
  brand: { fontSize: 34, fontWeight: "900", color: "#fff", letterSpacing: -0.6 },
  title: { marginTop: 10, fontSize: 22, fontWeight: "900", color: "#fff", letterSpacing: -0.3 },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    padding: Spacing.xl,
  },

  form: { gap: Spacing.lg },

  errorBox: {
    backgroundColor: "rgba(254,242,242,0.95)",
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
  },
  errorText: { color: "#991B1B", fontSize: 13, fontWeight: "700", lineHeight: 18 },

  loginButton: { marginTop: 4 },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 6,
  },
  loadingText: { color: "rgba(255,255,255,0.78)", fontSize: 13, fontWeight: "600" },

  divider: { flexDirection: "row", alignItems: "center", marginVertical: Spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.18)" },
  dividerText: { marginHorizontal: 14, color: "rgba(255,255,255,0.70)", fontSize: 13, fontWeight: "700" },

  signupPrompt: { marginTop: Spacing.sm, alignItems: "center" },
  signupText: { fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
  signupLink: { color: "#fff", fontWeight: "900" },
});
