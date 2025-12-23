import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Edit2, X } from 'lucide-react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextInputField } from '../components/TextInputField';
import { useAppContext } from '../context/AppContext';

export const ProfileScreen = () => {
  const { role, user, setUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSaveProfile = () => {
    if (editedUser) {
      setUser(editedUser);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={styles.editButton}
        >
          <Edit2 size={20} color="#007AFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.card}>
          {role === 'jobseeker' ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Skills</Text>
                <Text style={styles.value}>{user.skills || 'Not specified'}</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Experience</Text>
                <Text style={styles.value}>
                  {user.yearsOfExperience
                    ? `${user.yearsOfExperience} years`
                    : 'Not specified'}
                </Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Bio</Text>
                <Text style={styles.value}>{user.bio || 'Not specified'}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Company</Text>
                <Text style={styles.value}>{user.company || 'Not specified'}</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <Text style={styles.label}>Role</Text>
                <Text style={styles.value}>{user.role || 'Not specified'}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isEditing}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelEdit}>
              <X size={24} color="#007AFF" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <TextInputField
                label="Name"
                value={editedUser?.name || ''}
                onChangeText={(text) =>
                  setEditedUser((prev) => (prev ? { ...prev, name: text } : prev))
                }
              />

              <TextInputField
                label="Email"
                value={editedUser?.email || ''}
                onChangeText={(text) =>
                  setEditedUser((prev) => (prev ? { ...prev, email: text } : prev))
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {role === 'jobseeker' ? (
                <>
                  <TextInputField
                    label="Skills"
                    value={editedUser?.skills || ''}
                    onChangeText={(text) =>
                      setEditedUser((prev) =>
                        prev ? { ...prev, skills: text } : prev
                      )
                    }
                    placeholder="e.g. React, TypeScript, Node.js"
                  />

                  <TextInputField
                    label="Years of Experience"
                    value={editedUser?.yearsOfExperience?.toString() || ''}
                    onChangeText={(text) =>
                      setEditedUser((prev) =>
                        prev
                          ? { ...prev, yearsOfExperience: parseInt(text) || 0 }
                          : prev
                      )
                    }
                    keyboardType="numeric"
                  />

                  <TextInputField
                    label="Bio"
                    value={editedUser?.bio || ''}
                    onChangeText={(text) =>
                      setEditedUser((prev) => (prev ? { ...prev, bio: text } : prev))
                    }
                    multiline
                    numberOfLines={4}
                    style={styles.textArea}
                  />
                </>
              ) : (
                <>
                  <TextInputField
                    label="Company"
                    value={editedUser?.company || ''}
                    onChangeText={(text) =>
                      setEditedUser((prev) =>
                        prev ? { ...prev, company: text } : prev
                      )
                    }
                  />

                  <TextInputField
                    label="Role"
                    value={editedUser?.role || ''}
                    onChangeText={(text) =>
                      setEditedUser((prev) => (prev ? { ...prev, role: text } : prev))
                    }
                  />
                </>
              )}

              <PrimaryButton
                title="Save Changes"
                onPress={handleSaveProfile}
                style={styles.saveButton}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  editButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 24,
  },
  keyboardView: {
    flex: 1,
  },
  modalContent: {
    padding: 24,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 24,
  },
});
