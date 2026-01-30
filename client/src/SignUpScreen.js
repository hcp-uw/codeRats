import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  LogInScreen,
  SafeAreaView,
  Alert,
} from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignUp = () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the Terms of Service');
      return;
    }
    // TODO: Handle sign up logic
    Alert.alert('Success', 'Account created! Ready to start your adventure.');
  };

  return (
    <react-native-safe-area-context style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>👤</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Join Momentum</Text>
            <Text style={styles.headerSubtitle}>Begin your journey</Text>
          </View>
        </View>
      </View>

      {/* Form Container */}
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Username Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Input your name"
            placeholderTextColor="#D4A574"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="athlete@momentum.com"
            placeholderTextColor="#D4A574"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#D4A574"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.helperText}>At least 8 characters</Text>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#D4A574"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Terms & Conditions */}
        <View style={styles.checkboxGroup}>
          <TouchableOpacity
            style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            I agree to the Terms of Service and Privacy Policy
          </Text> // TODO: Link to actual documents
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign Up */} // TODO: Implement Google Sign Up
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>🔍 Sign up with Google</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginLinkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation?.navigate('LogInScreen')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </react-native-safe-area-context>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D5A3C',
  },
  header: {
    backgroundColor: '#3D5A3C',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  backButton: {
    color: '#D4A574',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#D4A574',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 28,
  },
  headerTitle: {
    color: '#D4A574',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#D4A574',
    fontSize: 12,
    opacity: 0.7,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 12,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#3D5A3C',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 116, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#3D5A3C',
  },
  helperText: {
    color: '#3D5A3C',
    fontSize: 12,
    opacity: 0.6,
    marginTop: 6,
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#3D5A3C',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#3D5A3C',
  },
  checkmark: {
    color: '#D4A574',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: '#3D5A3C',
    fontSize: 13,
    opacity: 0.7,
    flex: 1,
    lineHeight: 18,
  },
  signUpButton: {
    backgroundColor: '#3D5A3C',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonText: {
    color: '#D4A574',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3D5A3C',
    opacity: 0.2,
  },
  dividerText: {
    color: '#3D5A3C',
    fontSize: 12,
    opacity: 0.5,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: 'rgba(61, 90, 60, 0.3)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#3D5A3C',
    fontSize: 14,
    fontWeight: '600',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginLinkText: {
    color: '#3D5A3C',
    fontSize: 13,
    opacity: 0.7,
  },
  loginLink: {
    color: '#3D5A3C',
    fontSize: 13,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
