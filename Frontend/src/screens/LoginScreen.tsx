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

export const LoginScreen = ({ navigation }: any) => {
  const { role } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('MainTabs');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const roleTitle = role === 'recruiter' ? 'Recruiter Login' : 'Jobseeker Login';

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
            <Text style={styles.subtitle}>Welcome back! Sign in to continue</Text>
          </View>

          <View style={styles.form}>
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
              placeholder="Enter your password"
              secureTextEntry
            />

            <PrimaryButton
              title="Login"
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <PrimaryButton
              title="Continue with Google"
              onPress={() => {}}
              variant="outline"
            />

            <TouchableOpacity
              onPress={handleSignup}
              style={styles.signupPrompt}
            >
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink}>Sign up</Text>
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
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  signupPrompt: {
    marginTop: 32,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 15,
    color: '#666',
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
