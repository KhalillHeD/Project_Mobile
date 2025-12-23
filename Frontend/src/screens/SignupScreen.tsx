import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextInputField } from '../components/TextInputField';
import { useAppContext } from '../context/AppContext';

export const SignupScreen = ({ navigation }: any) => {
  const { role } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    navigation.navigate('MainTabs');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const roleTitle = role === 'recruiter' ? 'Recruiter Signup' : 'Jobseeker Signup';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{roleTitle}</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>
          </View>

          <View style={styles.form}>
            <TextInputField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
            />

            <TextInputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a strong password"
              secureTextEntry
            />

            <PrimaryButton
              title="Sign up"
              onPress={handleSignup}
              style={styles.signupButton}
            />

            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginPrompt}
            >
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginPrompt: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    color: '#666',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
