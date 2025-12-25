import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "../src/theme/colors";
import { Spacing } from "../src/theme/spacing";

export default function ChatScreen() {
  const { job } = useLocalSearchParams<{ job?: string }>();

  const parsedJob = job ? JSON.parse(job) : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Chat</Text>

        {parsedJob && (
          <Text style={styles.subtitle}>
            {parsedJob.title} at {parsedJob.company}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textMuted,
    textAlign: "center",
  },
});
