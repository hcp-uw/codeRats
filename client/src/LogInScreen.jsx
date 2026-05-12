import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert } from 'react-native';
import { LogInStyles as styles } from './AuthStyles';
import { supabase } from '../lib/supabase';

export default function LogInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Login Failed', error.message);
    }
    // On success, AuthContext detects the new session and RootNavigator redirects automatically
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
            <Text style={styles.headerIconText}>🏋️</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>Continue your journey</Text>
          </View>
        </View>
      </View>

      {/* Form Container */}
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Email Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="athelete@momentum.com"
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
        </View>

        {/* Remember Me & Forgot Password */}
        <View style={styles.optionsRow}>
          <View style={styles.checkboxGroup}>
            <TouchableOpacity
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              onPress={() => setRememberMe(!rememberMe)}
            >
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Remember me</Text>
          </View>
          <TouchableOpacity onPress={() => navigation?.navigate('ForgotPassword')}>
            <Text style={styles.forgotLink}>Forgot?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Login */}
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>🔍 Continue with Google</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>New athelete? </Text>
          <TouchableOpacity onPress={() => navigation?.navigate('SignUpScreen')}>
            <Text style={styles.signUpLink}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// styles are imported from AuthStyles.js