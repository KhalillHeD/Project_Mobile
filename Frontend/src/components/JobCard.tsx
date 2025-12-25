import React from "react";
import { Animated, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";
import { Spacing } from "../theme/spacing";

type Props = {
  job: {
    title: string;
    company: string;
    location: string;
    salary?: string;
    description?: string;
    image?: ImageSourcePropType | any;
  };
  // optional parallax (provided by swipe screen)
  parallaxX?: any;
};

export default function JobCard({ job, parallaxX }: Props) {
  const translateX = parallaxX ?? 0;

  return (
    <View style={styles.card}>
      {/* Hero image */}
      <View style={styles.header}>
        <Animated.Image
          source={job.image ?? require("../../assets/images/icon.png")}
          style={[styles.image, { transform: [{ translateX }, { scale: 1.06 }] }]}
          resizeMode="cover"
        />

        {/* Better readability */}
        <View style={styles.overlayTop} />
        <View style={styles.overlayBottom} />
      </View>

      {/* Content */}
      <View style={styles.body}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company}</Text>
            <Text style={styles.meta}>{job.location}</Text>
          </View>

          {!!job.salary && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{job.salary}</Text>
            </View>
          )}
        </View>

        {!!job.description && (
          <Text numberOfLines={3} style={styles.desc}>
            {job.description}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1F2E",
    borderRadius: Radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    ...Shadow,
  },

  header: {
    height: 230,
    position: "relative",
    backgroundColor: "#0F1220",
    overflow: "hidden",
  },
  image: {
    width: "110%",
    height: "110%",
    marginLeft: "-5%",
    marginTop: "-5%",
  },

  overlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.16)",
  },
  overlayBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.30)",
  },

  body: {
    padding: Spacing.xl,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  company: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  meta: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
    marginTop: 6,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  desc: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});
