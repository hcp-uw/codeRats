import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert } from 'react-native';
import { SignUpStyles as styles } from './AuthStyles';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the Terms of Service');
      return;
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert('Success', 'Check your email to confirm your account!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          onpress={handleSignUp}
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
    </SafeAreaView>
  );
}

// styles are imported from AuthStyles.js
