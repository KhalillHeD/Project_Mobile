import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  children: React.ReactNode;
};

export default function AuroraBackground({ children }: Props) {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 4200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 4200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);

  const translate = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 18],
  });

  const scale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1.02, 1.08],
  });

  return (
    <View style={styles.root}>
      {/* Base gradient */}
      <LinearGradient
        colors={["#0B1020", "#120B2E", "#2B0B2B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft moving glow layer */}
      <Animated.View
        style={[
          styles.glowWrap,
          { transform: [{ translateX: translate }, { translateY: translate }, { scale }] },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={["rgba(255,68,88,0.26)", "rgba(122,92,255,0.20)", "rgba(34,197,94,0.18)"]}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.glow}
        />
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
    opacity: 0.95,
  },
  glow: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
