import React, { useState } from "react";
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

import PrimaryButton from "../components/PrimaryButton";
import TextInputField from "../components/TextInputField";
import AuroraBackground from "../components/AuroraBackground";
import { useAppContext } from "../context/AppContext";

import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";

export const ProfileScreen = () => {
  const { role, user, setUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSaveProfile = () => {
    if (editedUser) setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <AuroraBackground>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.editBtn}
            activeOpacity={0.75}
          >
            <Edit2 size={18} color="#fff" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Card */}
          <View style={styles.hero}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </View>

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>

            <View style={styles.pills}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>
                  {role === "jobseeker" ? "Jobseeker" : "Recruiter"}
                </Text>
              </View>

              {role === "jobseeker" && (
                <View style={[styles.pill, styles.pillAccent]}>
                  <Text style={[styles.pillText, styles.pillAccentText]}>
                    {user.yearsOfExperience ? `${user.yearsOfExperience} yrs` : "Experience"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.card}>
            {role === "jobseeker" ? (
              <>
                <InfoRow label="Skills" value={user.skills || "Not specified"} />
                <Divider />
                <InfoRow
                  label="Experience"
                  value={user.yearsOfExperience ? `${user.yearsOfExperience} years` : "Not specified"}
                />
                <Divider />
                <InfoRow label="Bio" value={user.bio || "Not specified"} />
              </>
            ) : (
              <>
                <InfoRow label="Company" value={user.company || "Not specified"} />
                <Divider />
                <InfoRow label="Role" value={user.role || "Not specified"} />
              </>
            )}
          </View>
        </ScrollView>

        {/* Edit Modal */}
        <Modal visible={isEditing} animationType="slide" presentationStyle="pageSheet">
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
                    <TextInputField
                      label="Name"
                      value={editedUser?.name || ""}
                      onChangeText={(text) =>
                        setEditedUser((prev) => (prev ? { ...prev, name: text } : prev))
                      }
                      placeholder="Your full name"
                    />

                    <TextInputField
                      label="Email"
                      value={editedUser?.email || ""}
                      onChangeText={(text) =>
                        setEditedUser((prev) => (prev ? { ...prev, email: text } : prev))
                      }
                      keyboardType="email-address"
                      placeholder="you@example.com"
                    />

                    {role === "jobseeker" ? (
                      <>
                        <TextInputField
                          label="Skills"
                          value={editedUser?.skills || ""}
                          onChangeText={(text) =>
                            setEditedUser((prev) => (prev ? { ...prev, skills: text } : prev))
                          }
                          placeholder="e.g. React Native, TypeScript, Node.js"
                        />

                        <TextInputField
                          label="Years of Experience"
                          value={editedUser?.yearsOfExperience?.toString() || ""}
                          onChangeText={(text) =>
                            setEditedUser((prev) =>
                              prev ? { ...prev, yearsOfExperience: parseInt(text) || 0 } : prev
                            )
                          }
                          keyboardType="numeric"
                          placeholder="e.g. 3"
                        />

                        <TextInputField
                          label="Bio"
                          value={editedUser?.bio || ""}
                          onChangeText={(text) =>
                            setEditedUser((prev) => (prev ? { ...prev, bio: text } : prev))
                          }
                          placeholder="Tell recruiters what you’re great at, what you want, and what you’re looking for."
                          multiline
                          style={styles.textArea}
                        />
                      </>
                    ) : (
                      <>
                        <TextInputField
                          label="Company"
                          value={editedUser?.company || ""}
                          onChangeText={(text) =>
                            setEditedUser((prev) => (prev ? { ...prev, company: text } : prev))
                          }
                          placeholder="e.g. Acme Corp"
                        />

                        <TextInputField
                          label="Role"
                          value={editedUser?.role || ""}
                          onChangeText={(text) =>
                            setEditedUser((prev) => (prev ? { ...prev, role: text } : prev))
                          }
                          placeholder="e.g. Talent Acquisition"
                        />
                      </>
                    )}

                    <PrimaryButton title="Save Changes" onPress={handleSaveProfile} />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </AuroraBackground>
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

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.6,
  },
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

  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

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
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.backgroundMuted,
  },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    marginBottom: Spacing.md,
  },

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
  pillAccent: {
    backgroundColor: "rgba(255, 68, 88, 0.22)",
    borderColor: "rgba(255, 68, 88, 0.35)",
  },
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
  value: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 6,
  },

  /* Modal */
  modalSafe: {
    flex: 1,
    backgroundColor: "transparent",
  },
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
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fff",
  },
  modalContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  modalCard: {
    backgroundColor: "rgba(28,31,46,0.90)",
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: Spacing.lg,
    ...Shadow,
  },
  textArea: {
    height: 140,
  },
});
