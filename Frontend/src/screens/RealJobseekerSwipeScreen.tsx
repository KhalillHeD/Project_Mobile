import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { X, Heart } from "lucide-react-native";

import JobOfferCard, { Job } from "../components/JobOfferCard";
import { useAppContext } from "../context/AppContext";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";
import { fetchJobsForSeeker, likeOrDislikeJob } from "../jsr/jobs";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function RealJobseekerSwipeScreen() {
  const { role, accessToken } = useAppContext() as any;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [swipedIds, setSwipedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const position = useRef(new Animated.ValueXY()).current;

  const availableJobs = useMemo(
    () => jobs.filter((j) => !swipedIds.includes(j.id)),
    [jobs, swipedIds]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentJob = availableJobs[currentIndex];
  const nextJob = availableJobs[currentIndex + 1];

  // Entrance animation for cards
  const cardEntranceAnim = useRef(new Animated.Value(0)).current;
  const nextCardEntranceAnim = useRef(new Animated.Value(0)).current;

  // Button press animations
  const nopeScale = useRef(new Animated.Value(1)).current;
  const likeScale = useRef(new Animated.Value(1)).current;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchJobsForSeeker(accessToken)) as Job[];
      setJobs(data);
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        (typeof e?.data === "string" ? e.data : JSON.stringify(e?.data)) ||
        e?.message ||
        "Failed to load jobs.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentJob) {
      Animated.timing(cardEntranceAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
    if (nextJob) {
      Animated.timing(nextCardEntranceAnim, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [currentJob, nextJob, cardEntranceAnim, nextCardEntranceAnim]);

  useEffect(() => {
    if (role !== "jobseeker" || !accessToken) return;
    load();
  }, [role, accessToken]);

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-8deg", "0deg", "8deg"],
    extrapolate: "clamp",
  });

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

  const handleSwipeComplete = async (direction: "left" | "right") => {
    if (currentJob && accessToken) {
      try {
        const action = direction === "right" ? "like" : "dislike";
        await likeOrDislikeJob(accessToken, currentJob.id, action);
      } catch {
        // optional
      }
      setSwipedIds((prev) => [...prev, currentJob.id]);
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

  const handleNopePressIn = () => {
    Animated.spring(nopeScale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handleNopePressOut = () => {
    Animated.spring(nopeScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleLikePressIn = () => {
    Animated.spring(likeScale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handleLikePressOut = () => {
    Animated.spring(likeScale, { toValue: 1, useNativeDriver: true }).start();
  };

  if (role !== "jobseeker") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>0 opportunities</Text>
        </View>
        <View style={styles.deck}>
          <View style={styles.center}>
            <Text style={styles.error}>Only jobseekers can see this screen.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
      {
        scale: cardEntranceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
      {
        translateY: cardEntranceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  const nextCardStyle = {
    transform: [
      { scale: nextScale },
      { translateY: nextTranslateY },
      {
        scale: nextCardEntranceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1],
        }),
      },
      {
        translateY: nextCardEntranceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>
          {availableJobs.length - currentIndex} opportunities
        </Text>
      </View>

      <View style={styles.deck}>
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        {error && !loading && (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={load}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!currentJob && !loading && !error && (
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>You’re all caught up</Text>
            <Text style={styles.emptySubtitle}>New jobs will appear soon.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={load}>
              <Text style={styles.retryText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentJob && !loading && !error && (
          <>
            {nextJob && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.nextCardWrap,
                  {
                    opacity: nextOpacity,
                    transform: nextCardStyle.transform,
                  },
                ]}
              >
                <JobOfferCard job={nextJob} />
              </Animated.View>
            )}

            <Animated.View style={[styles.cardWrap, cardStyle]} {...panResponder.panHandlers}>
              <Animated.View pointerEvents="none" style={[styles.glow, styles.glowGreen, { opacity: glowGreen }]} />
              <Animated.View pointerEvents="none" style={[styles.glow, styles.glowRed, { opacity: glowRed }]} />

              <Animated.View style={[styles.likeBadge, { opacity: likeOpacity }]}>
                <Text style={styles.likeText}>LIKE</Text>
              </Animated.View>
              <Animated.View style={[styles.nopeBadge, { opacity: nopeOpacity }]}>
                <Text style={styles.nopeText}>SKIP</Text>
              </Animated.View>

              <JobOfferCard job={currentJob} />
            </Animated.View>
          </>
        )}
      </View>

      {currentJob && !loading && !error && (
        <View style={styles.actions}>
          <Animated.View style={{ transform: [{ scale: nopeScale }] }}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.nopeBtn]}
              onPress={() => handleButtonPress("left")}
              onPressIn={handleNopePressIn}
              onPressOut={handleNopePressOut}
              activeOpacity={0.85}
            >
              <X size={28} color={Colors.danger} strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.likeBtn]}
              onPress={() => handleButtonPress("right")}
              onPressIn={handleLikePressIn}
              onPressOut={handleLikePressOut}
              activeOpacity={0.85}
            >
              <Heart size={28} color={Colors.success} strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  title: { fontSize: 34, fontWeight: "900", color: Colors.text, letterSpacing: -0.6 },
  subtitle: { marginTop: 4, fontSize: 14, fontWeight: "600", color: Colors.textMuted },
  deck: { flex: 1, justifyContent: "center", alignItems: "center" },
  nextCardWrap: { width: SCREEN_WIDTH - 40, position: "absolute" },
  cardWrap: { width: SCREEN_WIDTH - 40, ...Shadow },
  glow: { ...StyleSheet.absoluteFillObject, borderRadius: Radius.xl, borderWidth: 2, zIndex: 2 },
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
  likeText: { color: Colors.success, fontSize: 26, fontWeight: "900" },
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
  nopeText: { color: Colors.danger, fontSize: 26, fontWeight: "900" },
  actions: { flexDirection: "row", justifyContent: "center", gap: 36, paddingBottom: 36 },
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "#f87171", fontWeight: "700" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  emptyTitle: { fontSize: 26, fontWeight: "900", color: Colors.text, marginBottom: 10 },
  emptySubtitle: { fontSize: 15, fontWeight: "600", color: Colors.textMuted, textAlign: "center" },
  retryBtn: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    ...Shadow,
  },
  retryText: { color: Colors.surface, fontSize: 16, fontWeight: "700" },
});
