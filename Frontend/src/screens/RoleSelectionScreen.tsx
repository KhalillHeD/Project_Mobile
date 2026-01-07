import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, Animated, Easing } from "react-native";
import { Briefcase, UserCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../components/PrimaryButton";
import AuroraBackground from "../components/AuroraBackground";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "expo-router";

const RoleSelectionScreen = () => {
  const { setRole } = useAppContext();
  const router = useRouter();

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const recruiterCardAnim = useRef(new Animated.Value(0)).current;
  const jobseekerCardAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Header animation with smooth bounce
    Animated.spring(headerAnim, {
      toValue: 1,
      tension: 8,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // Recruiter card animation with smooth bounce
    Animated.spring(recruiterCardAnim, {
      toValue: 1,
      tension: 12,
      friction: 6,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Jobseeker card animation with smooth bounce
    Animated.spring(jobseekerCardAnim, {
      toValue: 1,
      tension: 12,
      friction: 6,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Footer animation with smooth bounce
    Animated.spring(footerAnim, {
      toValue: 1,
      tension: 15,
      friction: 7,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // Continuous smooth floating animation for cards
    const startFloating = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Start floating after entrance animations
    setTimeout(startFloating, 1000);

    // Pulsing glow animation for icons
    const startPulsing = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Start pulsing after entrance animations
    setTimeout(startPulsing, 1200);

    // Breathing animation for cards
    const startBreathing = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Start breathing after entrance animations
    setTimeout(startBreathing, 1500);
  }, [headerAnim, recruiterCardAnim, jobseekerCardAnim, footerAnim, floatingAnim, pulseAnim, breatheAnim]);

  const handleRoleSelection = (role: "recruiter" | "jobseeker") => {
    // Trigger ripple animation
    Animated.sequence([
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    setRole(role);
    router.push("/login");
  };

  return (
    <AuroraBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerAnim,
                transform: [
                  {
                    translateY: headerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.brand}>JobSwipe</Text>
            <Text style={styles.tagline}>Find your perfect match</Text>
          </Animated.View>

          {/* Recruiter Card */}
          <Animated.View
            style={[
              {
                opacity: recruiterCardAnim,
                transform: [
                  {
                    translateY: Animated.add(
                      recruiterCardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                      floatingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -5],
                      })
                    ),
                  },
                  {
                    scale: Animated.multiply(
                      recruiterCardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                      breatheAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.02],
                      })
                    ),
                  },
                ],
              },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleRoleSelection("recruiter")}
            >
              <LinearGradient
                colors={['rgba(255,77,90,0.1)', 'rgba(255,77,90,0.05)', 'rgba(255,77,90,0.02)']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Animated.View
                  style={[
                    styles.rippleOverlay,
                    {
                      opacity: rippleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.3],
                      }),
                      transform: [
                        {
                          scale: rippleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1.2],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                     styles.iconWrap,
                    styles.iconRecruiter,
                    {
                      shadowOpacity: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.8],
                      }),
                      shadowRadius: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [5, 15],
                      }),
                    },
                  ]}
                >
                  <Briefcase size={26} color="#FF4D5A" strokeWidth={2.2} />
                </Animated.View>

                <Text style={styles.cardTitle}>I’m hiring</Text>
                <Text style={styles.cardSubtitle}>
                  Post jobs and find talented candidates
                </Text>

                <PrimaryButton
                  title="Continue as Recruiter"
                  onPress={() => handleRoleSelection("recruiter")}
                  variant="solid"
                />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Jobseeker Card */}
          <Animated.View
            style={[
              {
                opacity: jobseekerCardAnim,
                transform: [
                  {
                    translateY: Animated.add(
                      jobseekerCardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                      floatingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -5],
                      })
                    ),
                  },
                  {
                    scale: Animated.multiply(
                      jobseekerCardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                      breatheAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.02],
                      })
                    ),
                  },
                ],
              },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleRoleSelection("jobseeker")}
            >
              <LinearGradient
                colors={['rgba(52,211,153,0.1)', 'rgba(52,211,153,0.05)', 'rgba(52,211,153,0.02)']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Animated.View
                  style={[
                    styles.rippleOverlay,
                    {
                      opacity: rippleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.3],
                      }),
                      transform: [
                        {
                          scale: rippleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1.2],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.iconWrap,
                    styles.iconJobseeker,
                    {
                      shadowOpacity: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.8],
                      }),
                      shadowRadius: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [5, 15],
                      }),
                    },
                  ]}
                >
                  <UserCircle size={26} color="#34D399" strokeWidth={2.2} />
                </Animated.View>

                <Text style={styles.cardTitle}>Looking for work</Text>
                <Text style={styles.cardSubtitle}>
                  Discover exciting job opportunities
                </Text>

                <PrimaryButton
                  title="Continue as Jobseeker"
                  onPress={() => handleRoleSelection("jobseeker")}
                  variant="outline"
                  style={{
                    backgroundColor: "#2A2F45",   // solid, readable
                    borderColor: "rgba(255,255,255,0.22)",
                    borderWidth: 1,
                  }}
                  textStyle={{
                    color: "#FFFFFF",             // 🔥 readable
                    fontWeight: "800",
                  }}
                />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Animated.Text
            style={[
              styles.footer,
              {
                opacity: footerAnim,
                transform: [
                  {
                    translateY: footerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            Tip: you can switch roles later from Profile.
          </Animated.Text>
        </View>
      </SafeAreaView>
    </AuroraBackground>
  );
};

export default RoleSelectionScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  /* Header */
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  brand: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.8,
  },
  tagline: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
  },

  /* Cards */
  card: {
    backgroundColor: "#1C1F2E", // 🔥 solid, readable
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cardGradient: {
    borderRadius: 28,
    padding: 22,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    shadowColor: '#FF4D5A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    borderColor: 'rgba(255,77,90,0.5)',
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  iconRecruiter: {
    backgroundColor: "rgba(255,77,90,0.15)",
    shadowColor: '#FF4D5A',
  },
  iconJobseeker: {
    backgroundColor: "rgba(52,211,153,0.15)",
    shadowColor: '#34D399',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.70)",
    lineHeight: 20,
    marginBottom: 16,
  },

  footer: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
  },

  rippleOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    zIndex: -1,
  },
});
