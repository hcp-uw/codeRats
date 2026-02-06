import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { WelcomeStyles as styles } from './AuthStyles';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo/Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🏋️</Text>
          </View>
          <Text style={styles.appTitle}>Momentum</Text>
          <Text style={styles.appSubtitle}>Level Up Your Fitness</Text>
        </View>

        {/* Feature Section */}
        <View style={styles.featureSection}>
          <FeatureCard
            icon="🎯"
            title="Track"
            description="Track your workouts"
          />
          <FeatureCard
            icon="🌱"
            title="Grow"
            description="insert some slogan here"
          />
          <FeatureCard
            icon="👥"
            title="Compete"
            description="Compete and rank up"
          />
        </View>

        {/* CTA Buttons Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation?.navigate('SignUpScreen')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation?.navigate('LogInScreen')}
          >
            <Text style={styles.secondaryButtonText}>I Have an Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

// styles are imported from AuthStyles.js