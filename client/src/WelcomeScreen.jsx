import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { WelcomeStyles as styles } from './AuthStyles';
import { supabase } from '../lib/supabase';
import Dumbbell from '../icons/Dumbbell.svg';
import Plant from '../icons/plant.svg';
import Users from '../icons/users.svg';
import Track from '../icons/track.svg';

export default function WelcomeScreen({ navigation }) {
   useEffect(() => {
    console.log("SUPABASE_URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);

    supabase.auth.getSession().then(({ data, error }) => {
      console.log("SUPABASE session:", data?.session);
      console.log("SUPABASE error:", error);
    });
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo/Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoPlaceholder}>
            <Image source={require('../icons/coderat.png')} style={styles.coderat} />
          </View>
          <Text style={styles.appTitle}>momentum</Text>
          <Text style={styles.appSubtitle}>Level Up Your Fitness</Text>
        </View>

        {/* Feature Section */}
        <View style={styles.featureSection}>
          <FeatureCard
            icon={<Track width={30} height={30}/>}
            title="Track"
            description="Track your workouts"
          />
          <FeatureCard
            icon={<Plant width={30} height={30}/>}
            title="Grow"
            description="insert some slogan here"
          />
          <FeatureCard
            icon={<Users width={30} height={30}/>}
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
      <View style={styles.featureIcon}>{icon}</View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

// styles are imported from AuthStyles.js
