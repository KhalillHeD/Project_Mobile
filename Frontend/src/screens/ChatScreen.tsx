import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ArrowLeft, Send } from "lucide-react-native";

import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";

export const ChatScreen = ({ navigation, route }: any) => {
  const { job } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={Colors.text} strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {job.company}
          </Text>
        </View>
      </View>

      {/* Chat canvas */}
      <View style={styles.chatArea}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>Chat coming soon</Text>
          <Text style={styles.placeholderText}>
            Once messaging is enabled, you’ll be able to chat directly with the recruiter here.
          </Text>
        </View>
      </View>

      {/* Input */}
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Type a message…"
          placeholderTextColor={Colors.textMuted}
          editable={false}
        />
        <TouchableOpacity style={styles.sendBtn} disabled>
          <Send size={20} color={Colors.textMuted} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
    marginTop: 2,
  },

  /* Chat */
  chatArea: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    alignItems: "center",
    maxWidth: 300,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  placeholderText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },

  /* Input */
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.backgroundMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
  },
});
