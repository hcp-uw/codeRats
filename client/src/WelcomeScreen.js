import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  LogInScreen,
  SignUpScreen,
  SafeAreaView,
} from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D5A3C',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 50,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4A574',
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#D4A574',
    opacity: 0.8,
    textAlign: 'center',
  },
  featureSection: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(212, 165, 116, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4A574',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 11,
    color: '#D4A574',
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonSection: {
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#D4A574',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#3D5A3C',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D4A574',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#D4A574',
    fontSize: 16,
    fontWeight: '600',
  },
});
