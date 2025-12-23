import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Job } from '../data/jobs';

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: job.companyLogo }} style={styles.logo} />
      <View style={styles.content}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>{job.company}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.location}>{job.location}</Text>
          <Text style={styles.salary}>{job.salary}</Text>
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {job.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 16,
    alignSelf: 'center',
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  company: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginTop: 8,
  },
});
