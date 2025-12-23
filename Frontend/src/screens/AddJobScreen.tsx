import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextInputField } from '../components/TextInputField';
import { useAppContext } from '../context/AppContext';
import { Job } from '../data/jobs';

export const AddJobScreen = ({ navigation }: any) => {
  const { addJob } = useAppContext();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!salary.trim()) {
      newErrors.salary = 'Salary range is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Job description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveJob = () => {
    if (!validateForm()) {
      return;
    }

    const newJob: Job = {
      id: Date.now().toString(),
      title,
      company,
      location,
      salary,
      description,
      companyLogo:
        'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=200',
      interestedCount: 0,
    };

    addJob(newJob);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#007AFF" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Job</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TextInputField
            label="Job Title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: '' }));
              }
            }}
            placeholder="e.g. Senior React Developer"
            error={errors.title}
          />

          <TextInputField
            label="Company Name"
            value={company}
            onChangeText={(text) => {
              setCompany(text);
              if (errors.company) {
                setErrors((prev) => ({ ...prev, company: '' }));
              }
            }}
            placeholder="e.g. TechCorp Inc."
            error={errors.company}
          />

          <TextInputField
            label="Location"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (errors.location) {
                setErrors((prev) => ({ ...prev, location: '' }));
              }
            }}
            placeholder="e.g. San Francisco, CA or Remote"
            error={errors.location}
          />

          <TextInputField
            label="Salary Range"
            value={salary}
            onChangeText={(text) => {
              setSalary(text);
              if (errors.salary) {
                setErrors((prev) => ({ ...prev, salary: '' }));
              }
            }}
            placeholder="e.g. $100k - $150k"
            error={errors.salary}
          />

          <TextInputField
            label="Job Description"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: '' }));
              }
            }}
            placeholder="Describe the role, responsibilities, and requirements"
            multiline
            numberOfLines={6}
            style={styles.textArea}
            error={errors.description}
          />

          <PrimaryButton
            title="Save Job"
            onPress={handleSaveJob}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 24,
  },
});
