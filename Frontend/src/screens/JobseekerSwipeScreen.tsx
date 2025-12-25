import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { X, Heart } from "lucide-react-native";
import JobCard from "../components/JobCard";
import { useAppContext } from "../context/AppContext";

import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const withImage = (job: any) => {
  if (!job) return job;

  // keep existing image if already present
  if (job.image) return job;

  const fallback =
    job.companyLogo ||
    job.imageUrl ||
    job.logo ||
    (Array.isArray(job.images) ? job.images[0] : undefined) ||
    (Array.isArray(job.photos) ? job.photos[0] : undefined);

  // do NOT mutate original object
  return fallback ? { ...job, image: fallback } : job;
};




export const JobseekerSwipeScreen = () => {
  const { jobs, likeJob, swipedJobIds, addSwipedJob } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const position = useRef(new Animated.ValueXY()).current;

  const availableJobs = useMemo(
    () => jobs.filter((j) => !swipedJobIds.includes(j.id)),
    [jobs, swipedJobIds]
  );

  const currentJob = availableJobs[currentIndex];
  const nextJob = availableJobs[currentIndex + 1];

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-8deg", "0deg", "8deg"],
    extrapolate: "clamp",
  });

  // Like/Nope progress
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 6],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 6, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Next card depth illusion
  const nextScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [0.965, 0.94, 0.965],
    extrapolate: "clamp",
  });

  const nextTranslateY = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [10, 18, 10],
    extrapolate: "clamp",
  });

  const nextOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [0.82, 0.65, 0.82],
    extrapolate: "clamp",
  });

  // Parallax for hero image
  const parallaxX = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [18, 0, -18],
    extrapolate: "clamp",
  });

  // Glow feedback on card edge
  const glowGreen = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 3],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const glowRed = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 3, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const handleSwipeComplete = (direction: "left" | "right") => {
    if (currentJob) {
      addSwipedJob(currentJob.id);
      if (direction === "right") likeJob(currentJob);
    }
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((p) => p + 1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => position.setValue({ x: g.dx, y: g.dy }),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 140, y: g.dy },
            useNativeDriver: true,
          }).start(() => handleSwipeComplete("right"));
        } else if (g.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 140, y: g.dy },
            useNativeDriver: true,
          }).start(() => handleSwipeComplete("left"));
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 7,
            tension: 90,
          }).start();
        }
      },
    })
  ).current;

  const handleButtonPress = (direction: "left" | "right") => {
    const toValue = direction === "right" ? SCREEN_WIDTH + 140 : -SCREEN_WIDTH - 140;
    Animated.spring(position, {
      toValue: { x: toValue, y: 0 },
      useNativeDriver: true,
    }).start(() => handleSwipeComplete(direction));
  };

  if (!currentJob) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>You’re all caught up</Text>
          <Text style={styles.emptySubtitle}>New jobs will appear soon.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>
          {availableJobs.length - currentIndex} opportunities
        </Text>
      </View>

      {/* Deck */}
      <View style={styles.deck}>
        {/* Next card (behind) */}
        {nextJob && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.nextCardWrap,
              {
                opacity: nextOpacity,
                transform: [{ scale: nextScale }, { translateY: nextTranslateY }],
              },
            ]}
          >
            <JobCard job={withImage(nextJob)} />

          </Animated.View>
        )}

        {/* Current card */}
        <Animated.View style={[styles.cardWrap, cardStyle]} {...panResponder.panHandlers}>
          {/* Glow edges */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.glow,
              styles.glowGreen,
              { opacity: glowGreen },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.glow,
              styles.glowRed,
              { opacity: glowRed },
            ]}
          />

          {/* Like/Nope badges */}
          <Animated.View style={[styles.likeBadge, { opacity: likeOpacity }]}>
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>

          <Animated.View style={[styles.nopeBadge, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeText}>SKIP</Text>
          </Animated.View>

          {/* Parallax-enabled card */}
          <JobCard job={withImage(currentJob)} parallaxX={parallaxX} />
            
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.nopeBtn]}
          onPress={() => handleButtonPress("left")}
          activeOpacity={0.85}
        >
          <X size={28} color={Colors.danger} strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.likeBtn]}
          onPress={() => handleButtonPress("right")}
          activeOpacity={0.85}
        >
          <Heart size={28} color={Colors.success} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textMuted,
  },

  deck: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  nextCardWrap: {
    width: SCREEN_WIDTH - 40,
    position: "absolute",
  },

  cardWrap: {
    width: SCREEN_WIDTH - 40,
    ...Shadow,
  },

  // Glow overlays
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.xl,
    borderWidth: 2,
    zIndex: 2,
  },
  glowGreen: {
    borderColor: "rgba(34,197,94,0.8)",
    shadowColor: "rgba(34,197,94,0.9)",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  glowRed: {
    borderColor: "rgba(239,68,68,0.85)",
    shadowColor: "rgba(239,68,68,0.95)",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },

  likeBadge: {
    position: "absolute",
    top: 50,
    right: 26,
    borderWidth: 3,
    borderColor: Colors.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    transform: [{ rotate: "18deg" }],
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.10)",
  },
  likeText: {
    color: Colors.success,
    fontSize: 26,
    fontWeight: "900",
  },

  nopeBadge: {
    position: "absolute",
    top: 50,
    left: 26,
    borderWidth: 3,
    borderColor: Colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    transform: [{ rotate: "-18deg" }],
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.10)",
  },
  nopeText: {
    color: Colors.danger,
    fontSize: 26,
    fontWeight: "900",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 36,
    paddingBottom: 36,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...Shadow,
  },
  nopeBtn: { borderWidth: 2, borderColor: Colors.danger },
  likeBtn: { borderWidth: 2, borderColor: Colors.success },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textMuted,
    textAlign: "center",
  },
});
