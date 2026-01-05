import React from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import AuroraBackground from "./AuroraBackground";

export default function LoadingScreen() {
  return (
    <AuroraBackground>
      <View style={styles.center}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>to our app</Text>

        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={styles.spinner}
        />
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  subtitle: {
    marginTop: 4,
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    fontWeight: "600",
  },

  spinner: {
    marginTop: 22,
    opacity: 0.95,
  },
});
