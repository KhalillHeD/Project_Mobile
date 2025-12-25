import React, { useMemo, useState } from "react";
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

    // image can be require(...) (number) or URL string or { uri }
    image?: ImageSourcePropType | any;

    // optional (if your data has these)
    companyLogo?: string;
    imageUrl?: string;
    images?: string[];
    photos?: string[];
  };
  parallaxX?: any;
};

function pickFirstString(...vals: any[]) {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return "";
}

function toImageSource(v: any): ImageSourcePropType | undefined {
  if (!v) return undefined;

  // require('...') returns a number
  if (typeof v === "number") return v;

  // already { uri: "..." }
  if (typeof v === "object" && typeof v.uri === "string") return v;

  // raw string url
  if (typeof v === "string") return { uri: v };

  return undefined;
}

export default function JobCard({ job, parallaxX }: Props) {
  const translateX = parallaxX ?? 0;
  const [failed, setFailed] = useState(false);

  const fallback = useMemo(() => require("../../assets/images/icon.png"), []);

  // Prefer known URL fields if present
  const urlCandidate = useMemo(() => {
    return pickFirstString(
      job?.imageUrl,
      job?.companyLogo,
      typeof job?.image === "string" ? job.image : "",
      Array.isArray(job?.images) ? job.images[0] : "",
      Array.isArray(job?.photos) ? job.photos[0] : ""
    );
  }, [job]);

  const resolved = useMemo<ImageSourcePropType>(() => {
    return (
      toImageSource(urlCandidate) ??
      toImageSource(job?.image) ??
      fallback
    );
  }, [urlCandidate, job, fallback]);

  const sourceToUse = failed ? fallback : resolved;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Animated.Image
          source={sourceToUse}
          style={[styles.image, { transform: [{ translateX }] }]}
          resizeMode="cover"
          resizeMethod="resize"
          fadeDuration={150}
          progressiveRenderingEnabled
          onError={(e) => {
            console.log("JobCard image failed:", { urlCandidate, raw: job?.image, native: e?.nativeEvent });
            setFailed(true);
          }}
        />

        {/* Softer overlays (less muddy) */}
        <View style={styles.overlayTop} />
        <View style={styles.overlayBottom} />
        <View style={styles.highlight} />
      </View>

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
    height: 260, // slightly taller = less stretching/grainy feel
    position: "relative",
    backgroundColor: "#0F1220",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  // Reduce darkness so image stays crisp
  overlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.10)",
  },
  overlayBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  // subtle top highlight makes image look cleaner
  highlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.06)",
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
