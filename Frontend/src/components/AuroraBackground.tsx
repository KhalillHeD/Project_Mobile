import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

type Props = {
  children: React.ReactNode;
};

export default function AuroraBackground({ children }: Props) {
  const glow = useRef(new Animated.Value(0)).current;
  const secondaryGlow = useRef(new Animated.Value(0)).current;
  const tertiaryGlow = useRef(new Animated.Value(0)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const particleAnim3 = useRef(new Animated.Value(0)).current;
  const particleAnim4 = useRef(new Animated.Value(0)).current;
  const particleAnim5 = useRef(new Animated.Value(0)).current;
  const particleAnim6 = useRef(new Animated.Value(0)).current;
  const particleAnim7 = useRef(new Animated.Value(0)).current;
  const particleAnim8 = useRef(new Animated.Value(0)).current;
  const particleAnim9 = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;
  const nebulaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Primary aurora animation
    const primaryLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 4200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 4200, useNativeDriver: true }),
      ])
    );
    primaryLoop.start();

    // Secondary aurora animation (slower, different direction)
    const secondaryLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(secondaryGlow, { toValue: 1, duration: 6800, useNativeDriver: true }),
        Animated.timing(secondaryGlow, { toValue: 0, duration: 6800, useNativeDriver: true }),
      ])
    );
    secondaryLoop.start();

    // Floating particles
    const particleLoop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim1, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(particleAnim1, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    );
    particleLoop1.start();

    const particleLoop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim2, { toValue: 1, duration: 12000, useNativeDriver: true }),
        Animated.timing(particleAnim2, { toValue: 0, duration: 12000, useNativeDriver: true }),
      ])
    );
    particleLoop2.start();

    // Tertiary aurora animation (even slower, opposite direction)
    const tertiaryLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tertiaryGlow, { toValue: 1, duration: 9200, useNativeDriver: true }),
        Animated.timing(tertiaryGlow, { toValue: 0, duration: 9200, useNativeDriver: true }),
      ])
    );
    tertiaryLoop.start();

    // Third floating particle
    const particleLoop3 = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim3, { toValue: 1, duration: 15000, useNativeDriver: true }),
        Animated.timing(particleAnim3, { toValue: 0, duration: 15000, useNativeDriver: true }),
      ])
    );
    particleLoop3.start();

    // Additional floating particles
    const particleLoop4 = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim4, { toValue: 1, duration: 10000, useNativeDriver: true }),
        Animated.timing(particleAnim4, { toValue: 0, duration: 10000, useNativeDriver: true }),
      ])
    );
    particleLoop4.start();

    const particleLoop5 = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim5, { toValue: 1, duration: 18000, useNativeDriver: true }),
        Animated.timing(particleAnim5, { toValue: 0, duration: 18000, useNativeDriver: true }),
      ])
    );
    particleLoop5.start();

    const particleLoop6 = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim6, { toValue: 1, duration: 13000, useNativeDriver: true }),
        Animated.timing(particleAnim6, { toValue: 0, duration: 13000, useNativeDriver: true }),
      ])
    );
    particleLoop6.start();

    const particleLoop7 = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim7, { toValue: 1, duration: 20000, useNativeDriver: true }),
        Animated.timing(particleAnim7, { toValue: 0, duration: 20000, useNativeDriver: true }),
      ])
    );
    particleLoop7.start();

    const particleLoop8 = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim8, { toValue: 1, duration: 16000, useNativeDriver: true }),
        Animated.timing(particleAnim8, { toValue: 0, duration: 16000, useNativeDriver: true }),
      ])
    );
    particleLoop8.start();

    const particleLoop9 = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim9, { toValue: 1, duration: 22000, useNativeDriver: true }),
        Animated.timing(particleAnim9, { toValue: 0, duration: 22000, useNativeDriver: true }),
      ])
    );
    particleLoop9.start();

    // Twinkling stars
    const starLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(starAnim, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    );
    starLoop.start();

    // Nebula-like pulsing effect
    const nebulaLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(nebulaAnim, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(nebulaAnim, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ])
    );
    nebulaLoop.start();

    return () => {
      primaryLoop.stop();
      secondaryLoop.stop();
      tertiaryLoop.stop();
      particleLoop1.stop();
      particleLoop2.stop();
      particleLoop3.stop();
      particleLoop4.stop();
      particleLoop5.stop();
      particleLoop6.stop();
      particleLoop7.stop();
      particleLoop8.stop();
      particleLoop9.stop();
      starLoop.stop();
      nebulaLoop.stop();
    };
  }, [glow, secondaryGlow, tertiaryGlow, particleAnim1, particleAnim2, particleAnim3, particleAnim4, particleAnim5, particleAnim6, particleAnim7, particleAnim8, particleAnim9, starAnim, nebulaAnim]);

  const translate = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 18],
  });

  const scale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1.02, 1.08],
  });

  const secondaryTranslateX = secondaryGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [15, -15],
  });

  const secondaryTranslateY = secondaryGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  const particle1TranslateX = particleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.1, width * 0.9],
  });

  const particle1TranslateY = particleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.2, height * 0.8],
  });

  const particle2TranslateX = particleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.8, width * 0.2],
  });

  const particle2TranslateY = particleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.7, height * 0.3],
  });

  const tertiaryTranslateX = tertiaryGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  const tertiaryTranslateY = tertiaryGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [12, -12],
  });

  const particle3TranslateX = particleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.5, width * 0.1],
  });

  const particle3TranslateY = particleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.1, height * 0.9],
  });

  const particle4TranslateX = particleAnim4.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.3, width * 0.7],
  });

  const particle4TranslateY = particleAnim4.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.4, height * 0.6],
  });

  const particle5TranslateX = particleAnim5.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.9, width * 0.1],
  });

  const particle5TranslateY = particleAnim5.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.8, height * 0.2],
  });

  const particle6TranslateX = particleAnim6.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.2, width * 0.8],
  });

  const particle6TranslateY = particleAnim6.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.3, height * 0.7],
  });

  const particle7TranslateX = particleAnim7.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.6, width * 0.4],
  });

  const particle7TranslateY = particleAnim7.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.5, height * 0.9],
  });

  const particle8TranslateX = particleAnim8.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.1, width * 0.5],
  });

  const particle8TranslateY = particleAnim8.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.6, height * 0.4],
  });

  const particle9TranslateX = particleAnim9.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.7, width * 0.3],
  });

  const particle9TranslateY = particleAnim9.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.2, height * 0.8],
  });

  const starOpacity = starAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const nebulaOpacity = nebulaAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.4],
  });

  return (
    <View style={styles.root}>
      {/* Base dark gradient background */}
      <LinearGradient
        colors={["#1a1f36", "#0f1220", "#0b0d18"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating particles */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          {
            transform: [
              { translateX: particle1TranslateX },
              { translateY: particle1TranslateY },
            ],
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          {
            transform: [
              { translateX: particle2TranslateX },
              { translateY: particle2TranslateY },
            ],
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle3,
          {
            transform: [
              { translateX: particle3TranslateX },
              { translateY: particle3TranslateY },
            ],
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.particleSmall,
          styles.particle4,
          {
            transform: [
              { translateX: particle4TranslateX },
              { translateY: particle4TranslateY },
            ],
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.particleMedium,
          styles.particle5,
          {
            transform: [
              { translateX: particle5TranslateX },
              { translateY: particle5TranslateY },
            ],
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.particleSmall,
          styles.particle6,
          {
            transform: [
              { translateX: particle6TranslateX },
              { translateY: particle6TranslateY },
            ],
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.particleLarge,
          styles.particle7,
          {
            transform: [
              { translateX: particle7TranslateX },
              { translateY: particle7TranslateY },
            ],
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.particleMedium,
          styles.particle8,
          {
            transform: [
              { translateX: particle8TranslateX },
              { translateY: particle8TranslateY },
            ],
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.particleSmall,
          styles.particle9,
          {
            transform: [
              { translateX: particle9TranslateX },
              { translateY: particle9TranslateY },
            ],
          },
        ]}
        pointerEvents="none"
      />

      {/* Twinkling stars */}
      <Animated.View style={[styles.starContainer, { opacity: starOpacity }]} pointerEvents="none">
        <View style={[styles.star, styles.star1]} />
        <View style={[styles.star, styles.star2]} />
        <View style={[styles.star, styles.star3]} />
        <View style={[styles.star, styles.star4]} />
        <View style={[styles.star, styles.star5]} />
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  glowWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  glow: {
    flex: 1,
  },
  secondaryGlowWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  secondaryGlow: {
    flex: 1,
  },
  tertiaryGlowWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  tertiaryGlow: {
    flex: 1,
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.6)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  particle1: {
    top: "20%",
    left: "10%",
  },
  particle2: {
    top: "70%",
    left: "80%",
  },
  particle3: {
    top: "50%",
    left: "50%",
  },
  particleSmall: {
    position: "absolute",
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  particleMedium: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.6)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  particleLarge: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  particle4: {
    top: "40%",
    left: "30%",
  },
  particle5: {
    top: "80%",
    left: "90%",
  },
  particle6: {
    top: "30%",
    left: "20%",
  },
  particle7: {
    top: "50%",
    left: "60%",
  },
  particle8: {
    top: "60%",
    left: "10%",
  },
  particle9: {
    top: "20%",
    left: "70%",
  },
  starContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: "absolute",
    width: 2,
    height: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 1,
  },
  star1: {
    top: "15%",
    left: "20%",
  },
  star2: {
    top: "25%",
    left: "70%",
  },
  star3: {
    top: "45%",
    left: "15%",
  },
  star4: {
    top: "65%",
    left: "85%",
  },
  star5: {
    top: "85%",
    left: "40%",
  },
  content: {
    flex: 1,
  },
});
