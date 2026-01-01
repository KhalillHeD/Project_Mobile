import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Edit2, X } from "lucide-react-native";
import { useRouter } from "expo-router";

import PrimaryButton from "../components/PrimaryButton";
import TextInputField from "../components/TextInputField";
import AuroraBackground from "../components/AuroraBackground";
import { useAppContext } from "../context/AppContext";

import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";

import { updateMe } from "../api/auth";

type Role = "jobseeker" | "recruiter";

type AppUser = {
  name: string;
  email: string;
  avatar?: string | null;

  skills?: string | null;
  bio?: string | null;
  experience_years?: number | null;

  company_name?: string | null;
  position_title?: string | null;
};

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=User";

const API_BASE = "http://localhost:8000";
const LOGIN_ROUTE = "/login";

export const ProfileScreen = () => {
  const router = useRouter();

  const { role, user, setUser, logout, isReady, accessToken } = useAppContext() as {
    isReady: boolean;
    role: Role;
    user: AppUser | null;
    setUser: (u: AppUser | null) => Promise<void>;
    logout: () => Promise<void>;
    accessToken: string | null;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<AppUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) setEditedUser(user ? { ...user } : null);
  }, [isEditing, user]);

  const avatarUri = useMemo(() => {
    const uri = user?.avatar?.trim();
    return uri && uri.length > 0 ? uri : DEFAULT_AVATAR;
  }, [user?.avatar]);

  const handleOpenEdit = () => {
    if (!user) return;
    setErrorText(null);
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setErrorText(null);
    setEditedUser(user ? { ...user } : null);
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user || !editedUser) return;

    setSaving(true);
    setErrorText(null);

    // IMPORTANT: do not send `avatar` as URL string; backend avatar is ImageField (file upload)
    const payload: Partial<AppUser> = {
      name: editedUser.name,
      email: editedUser.email,

      skills: editedUser.skills ?? "",
      bio: editedUser.bio ?? "",
      experience_years: editedUser.experience_years ?? null,

      company_name: editedUser.company_name ?? "",
      position_title: editedUser.position_title ?? "",
    };

    try {
      if (!accessToken) throw new Error("Missing access token. Please log in again.");

      const updated = (await updateMe(accessToken, payload)) as AppUser;
      await setUser(updated);
      setIsEditing(false);
    } catch (e: any) {
      setErrorText(e?.data ? JSON.stringify(e.data) : e?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace(LOGIN_ROUTE);
  };

  if (!isReady) {
    return (
      <AuroraBackground>
        <SafeAreaView style={styles.safeFallback}>
          <Text style={styles.fallbackText}>Loading...</Text>
        </SafeAreaView>
      </AuroraBackground>
    );
  }

  if (!user) {
    return (
      <AuroraBackground>
        <SafeAreaView style={styles.safeFallback}>
          <Text style={styles.fallbackText}>No user loaded</Text>

          <View style={{ marginTop: 16, width: "100%", paddingHorizontal: 24 }}>
            <PrimaryButton title="Go to Login" onPress={() => router.replace(LOGIN_ROUTE)} />
          </View>

          <View style={{ marginTop: 10, width: "100%", paddingHorizontal: 24 }}>
            <PrimaryButton title="Log out" onPress={handleLogout} />
          </View>
        </SafeAreaView>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleOpenEdit} style={styles.editBtn} activeOpacity={0.75}>
            <Edit2 size={18} color="#fff" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            </View>

            <Text style={styles.name}>{user.name || "Unnamed"}</Text>
            <Text style={styles.email}>{user.email || "No email"}</Text>

            <View style={styles.pills}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{role === "jobseeker" ? "Jobseeker" : "Recruiter"}</Text>
              </View>

              {role === "jobseeker" && (
                <View style={[styles.pill, styles.pillAccent]}>
                  <Text style={[styles.pillText, styles.pillAccentText]}>
                    {user.experience_years != null && user.experience_years > 0
                      ? `${user.experience_years} yrs`
                      : "Experience"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.card}>
            {role === "jobseeker" ? (
              <>
                <InfoRow label="Skills" value={user.skills?.trim() ? user.skills : "Not specified"} />
                <Divider />
                <InfoRow
                  label="Experience"
                  value={user.experience_years != null ? `${user.experience_years} years` : "Not specified"}
                />
                <Divider />
                <InfoRow label="Bio" value={user.bio?.trim() ? user.bio : "Not specified"} />
              </>
            ) : (
              <>
                <InfoRow label="Company" value={user.company_name?.trim() ? user.company_name : "Not specified"} />
                <Divider />
                <InfoRow label="Role" value={user.position_title?.trim() ? user.position_title : "Not specified"} />
              </>
            )}
          </View>

          <View style={{ marginTop: Spacing.lg }}>
            <PrimaryButton title="Log out" onPress={handleLogout} />
          </View>
        </ScrollView>

        <Modal
          visible={isEditing}
          animationType="slide"
          transparent={false}
          presentationStyle="fullScreen"
          onRequestClose={handleCancelEdit}
        >
          <View style={{ flex: 1, backgroundColor: "#0F1220" }}>
            <AuroraBackground>
              <SafeAreaView style={styles.modalSafe}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleCancelEdit} style={styles.modalIconBtn}>
                    <X size={22} color="#FFFFFF" strokeWidth={2.2} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Edit Profile</Text>
                  <View style={{ width: 36 }} />
                </View>

                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1 }}
                >
                  <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.modalCard}>
                      {!!errorText && (
                        <Text style={{ color: "#ffb4b4", fontWeight: "700" }}>{errorText}</Text>
                      )}

                      <TextInputField
                        label="Name"
                        value={editedUser?.name ?? ""}
                        onChangeText={(text) => {
                          const base = editedUser ?? user;
                          setEditedUser({ ...base, name: text });
                        }}
                        placeholder="Your name"
                      />

                      <TextInputField
                        label="Email"
                        value={editedUser?.email ?? ""}
                        onChangeText={(text) => {
                          const base = editedUser ?? user;
                          setEditedUser({ ...base, email: text });
                        }}
                        keyboardType="email-address"
                        placeholder="you@example.com"
                      />

                      {/* Keep this input if you want, but it won't persist to ImageField backend */}
                      <TextInputField
                        label="Avatar URL (not saved yet)"
                        value={editedUser?.avatar ?? ""}
                        onChangeText={(text) => {
                          const base = editedUser ?? user;
                          setEditedUser({ ...base, avatar: text });
                        }}
                        placeholder="https://..."
                      />

                      {role === "jobseeker" ? (
                        <>
                          <TextInputField
                            label="Skills"
                            value={editedUser?.skills ?? ""}
                            onChangeText={(text) => {
                              const base = editedUser ?? user;
                              setEditedUser({ ...base, skills: text });
                            }}
                            placeholder="e.g. React Native, TypeScript, Node.js"
                          />

                          <TextInputField
                            label="Years of Experience"
                            value={editedUser?.experience_years != null ? String(editedUser.experience_years) : ""}
                            onChangeText={(text) => {
                              const base = editedUser ?? user;
                              const t = text.trim();
                              setEditedUser({
                                ...base,
                                experience_years: t.length === 0 ? null : Number(t) || 0,
                              });
                            }}
                            keyboardType="numeric"
                            placeholder="e.g. 3"
                          />

                          <TextInputField
                            label="Bio"
                            value={editedUser?.bio ?? ""}
                            onChangeText={(text) => {
                              const base = editedUser ?? user;
                              setEditedUser({ ...base, bio: text });
                            }}
                            placeholder="Tell recruiters about you."
                            multiline
                            style={styles.textArea}
                          />
                        </>
                      ) : (
                        <>
                          <TextInputField
                            label="Company"
                            value={editedUser?.company_name ?? ""}
                            onChangeText={(text) => {
                              const base = editedUser ?? user;
                              setEditedUser({ ...base, company_name: text });
                            }}
                            placeholder="e.g. Acme Corp"
                          />

                          <TextInputField
                            label="Position Title"
                            value={editedUser?.position_title ?? ""}
                            onChangeText={(text) => {
                              const base = editedUser ?? user;
                              setEditedUser({ ...base, position_title: text });
                            }}
                            placeholder="e.g. Talent Acquisition"
                          />
                        </>
                      )}

                      <PrimaryButton
                        title={saving ? "Saving..." : "Save Changes"}
                        onPress={handleSaveProfile}
                        disabled={saving}
                      />
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              </SafeAreaView>
            </AuroraBackground>
          </View>
        </Modal>
      </SafeAreaView>
    </AuroraBackground>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={{ paddingVertical: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  safe: { flex: 1 },

  safeFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  fallbackText: { color: "#fff", fontWeight: "800" },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 34, fontWeight: "900", color: "#fff", letterSpacing: -0.6 },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },

  hero: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    ...Shadow,
  },

  avatarRing: {
    padding: 4,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginBottom: Spacing.md,
  },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: Colors.backgroundMuted },
  name: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 4 },
  email: { fontSize: 13, fontWeight: "600", color: "rgba(255,255,255,0.75)", marginBottom: Spacing.md },

  pills: { flexDirection: "row", gap: 10 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  pillText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  pillAccent: { backgroundColor: "rgba(255, 68, 88, 0.22)", borderColor: "rgba(255, 68, 88, 0.35)" },
  pillAccentText: { color: "#fff" },

  card: {
    marginTop: Spacing.lg,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  label: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  value: { color: "#fff", fontSize: 15, fontWeight: "600", lineHeight: 22 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 6 },

  modalSafe: { flex: 1, backgroundColor: "transparent" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(15,18,32,0.55)",
  },
  modalIconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  modalTitle: { fontSize: 16, fontWeight: "900", color: "#fff" },
  modalContent: { padding: Spacing.xl, paddingBottom: Spacing.xl },
  modalCard: {
    backgroundColor: "rgba(28,31,46,0.90)",
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: Spacing.lg,
    ...Shadow,
  },
  textArea: { height: 140 },
});
