import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Briefcase, UserCircle } from 'lucide-react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppContext } from '../context/AppContext';

export const RoleSelectionScreen = ({ navigation }: any) => {
  const { setRole } = useAppContext();

  const handleRoleSelection = (selectedRole: 'recruiter' | 'jobseeker') => {
    setRole(selectedRole);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appName}>JobSwipe</Text>
          <Text style={styles.tagline}>Find Your Perfect Match</Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.roleCard}>
            <View style={styles.iconContainer}>
              <Briefcase size={48} color="#007AFF" strokeWidth={2} />
            </View>
            <Text style={styles.roleTitle}>I'm Hiring</Text>
            <Text style={styles.roleDescription}>
              Post jobs and find talented candidates
            </Text>
            <PrimaryButton
              title="Continue as Recruiter"
              onPress={() => handleRoleSelection('recruiter')}
              style={styles.button}
            />
          </View>

          <View style={styles.roleCard}>
            <View style={styles.iconContainer}>
              <UserCircle size={48} color="#34C759" strokeWidth={2} />
            </View>
            <Text style={styles.roleTitle}>Looking for Work</Text>
            <Text style={styles.roleDescription}>
              Discover exciting job opportunities
            </Text>
            <PrimaryButton
              title="Continue as Jobseeker"
              onPress={() => handleRoleSelection('jobseeker')}
              style={styles.button}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 24,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
});
