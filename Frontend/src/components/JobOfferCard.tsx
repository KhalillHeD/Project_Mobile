import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
/*import { Job } from "../jsr/jobs";*/
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";


export interface Job {
  id: number;
  title: string;
  company_name: string;
  category: string;
  governorate: string;
  location?: string;
  salary_range?: string;
  min_experience_years?: number | null;
  max_experience_years?: number | null;
  skills?: string;
  short_description: string;
  description: string;
  tags?: string;
  image_url?: string;
}


interface Props {
  job: Job;
}

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg"; // any default

const JobOfferCard: React.FC<Props> = ({ job }) => {
  const banner = job.image_url && job.image_url.length > 0
    ? job.image_url
    : FALLBACK_IMAGE;

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={{ uri: banner }}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        {/* You can overlay gradient here later */}
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>{job.company_name}</Text>
        <Text style={styles.location}>
          {job.location || job.governorate || "Location not specified"}
        </Text>
        <Text style={styles.short} numberOfLines={2}>
          {job.short_description}
        </Text>
      </View>
    </View>
  );
};

export default JobOfferCard;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "rgba(15,18,32,0.95)",
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadow,
  },
  banner: {
    height: 140,
    width: "100%",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: Spacing.lg,
    gap: 4,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  company: {
    color: "#ff6b81",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },
  location: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 2,
  },
  short: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    marginTop: 6,
  },
});
