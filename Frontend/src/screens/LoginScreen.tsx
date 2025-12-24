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
import { loginUser, fetchMe } from "../api/auth";
import { useRouter } from "expo-router";

export const LoginScreen = () => {
  const { role: intendedRole, setRole, setUser, setToken } = useAppContext();
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        username: emailOrUsername.trim(),
        password,
      };

      const data = await loginUser(payload);
      const accessToken = data?.access as string;

      if (!accessToken) {
        setError("Login failed: no access token returned.");
        return;
      }

      setToken(accessToken);

      const me = await fetchMe(accessToken);
      const backendRole = me?.role;

      if (!backendRole) {
        setError("Login failed: role missing from /me response.");
        return;
      }

      // Enforce role chosen on RoleSelectionScreen
      if (intendedRole && backendRole !== intendedRole) {
        setToken("");
        setError(
          `This account is a ${backendRole}, but you selected ${intendedRole}.`
        );
        return;
      }

      setRole(backendRole);

      setUser({
        id: String(me.id ?? me.username ?? ""),
        name: me.username ?? "",
        email: me.email ?? "",
        role: backendRole,
      });

      // ✅ MAIN PAGE AFTER LOGIN
      router.replace("/matches"); // requires app/matches.tsx
    } catch (e: any) {
      console.log("Login error:", e);
      setError(e?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    // ✅ SIGNUP PAGE
    router.push("/signup"); // requires app/signup.tsx
  };

  const roleTitle =
    intendedRole === "recruiter" ? "Recruiter Login" : "Jobseeker Login";

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
            <Text style={styles.subtitle}>Welcome back! Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            {error && (
              <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
            )}

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
            />

            {loading && (
              <ActivityIndicator style={{ marginTop: 8 }} color="#007AFF" />
            )}

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

            <TouchableOpacity onPress={handleSignup} style={styles.signupPrompt}>
              <Text style={styles.signupText}>
                Don't have an account?{" "}
                <Text style={styles.signupLink}>Sign up</Text>
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
  loginButton: { marginTop: 8, marginBottom: 24 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#DDD" },
  dividerText: { marginHorizontal: 16, color: "#999", fontSize: 14 },
  signupPrompt: { marginTop: 32, alignItems: "center" },
  signupText: { fontSize: 15, color: "#666" },
  signupLink: { color: "#007AFF", fontWeight: "600" },
});
