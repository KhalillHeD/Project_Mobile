import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { JobseekerSwipeScreen } from "../src/screens/JobseekerSwipeScreen";
import AuroraBackground from "../src/components/AuroraBackground";

export default function Home() {
  return (
    <AuroraBackground>
      <SafeAreaView style={styles.safe}>
        <JobseekerSwipeScreen />
      </SafeAreaView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
});
