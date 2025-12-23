import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Plus, MapPin, Users } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';
import { Job } from '../data/jobs';

export const RecruiterJobsScreen = ({ navigation }: any) => {
  const { jobs } = useAppContext();

  const handleAddJob = () => {
    navigation.navigate('AddJob');
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={styles.jobItem}>
      <Image source={{ uri: item.companyLogo }} style={styles.logo} />
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#666" strokeWidth={2} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.interestedRow}>
          <Users size={16} color="#34C759" strokeWidth={2} />
          <Text style={styles.interestedText}>
            {item.interestedCount || 0} interested
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Jobs</Text>
        <Text style={styles.subtitle}>{jobs.length} active postings</Text>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddJob}>
        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  jobItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 16,
  },
  jobInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  interestedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interestedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
