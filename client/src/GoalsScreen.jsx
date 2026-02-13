import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function GoalsScreen({ navigation }) {

  const [goals] = useState([
    {
      icon: '🏋️',
      title: "Bench 225 lbs",
      desc: "Target by June 2025",
    },
    {
      icon: '🏃',
      title: "Sub 3 Hour Marathon",
      desc: "Train consistently for 6 months",    
    },
    {
      icon: '🔥',
      title: "Workout Everyday",
      desc: "At least 30 minutes daily",    
    },
  ]); 

    
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>🎯 Goals</Text>
            <Text style={styles.headerSubtitle}>Your fitness journey at a glance</Text>
        </View>

        {/* Progress Overview */}
        <View style={styles.greenCard}>
            <Text style={styles.cardTitle}>Progress Overview</Text>

        <View style={styles.statsRow}>
            <View style={styles.statBox}>   
                <Text style={styles.statLabel}>Days Exercised</Text>
                <Text style={styles.statValue}>45</Text>
                <Text style={styles.statChange}>+5</Text>
            </View>

        <View style={styles.statBox}>   
                <Text style={styles.statLabel}>Weekly Miles</Text>
                <Text style={styles.statValue}>30</Text>
                <Text style={styles.statChange}>+3</Text>
            </View>
        
        <View style={styles.statBox}>   
                <Text style={styles.statLabel}>Max Bench</Text>
                <Text style={styles.statValue}>200</Text>
                <Text style={styles.statChange}>+10</Text>
            </View>
        </View>
    </View>

    {/* Muscle Groups Placeholder */}
    <View style={styles.tanCard}>
        <Text style={styles.cardTitle}>Muscle Groups Targeted</Text>
        <Text style={styles.placeholderText}>
        Chart coming soon
            </Text>
        </View>

    {/* Goals List */}
    <View style={styles.greenCard}>
        <Text style={styles.cardTitle}>Your Goals</Text>

        {goals.map((goal, index) => (
            <View key={index} style={styles.goalRow}>
        
                <Text style={styles.goalIcon}> {goal.icon}</Text>
                <View style={{flex:1}}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalSubtext}>{goal.desc}</Text>
                </View>

                {/* Placeholder for edit/delete buttons */}
                <Text style={{color:'#fff'}}>•••</Text>
                
                </View>
                ))}

            </View>

            {/* Navigation Button */}
      <TouchableOpacity
       style={styles.primaryButton}
       onPress={() => console.log("Add Goal screen coming soon")}>

        <Text style={styles.primaryButtonText}>Set New Goal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>View History</Text>
      </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
      

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    paddingHorizontal: 16,
  },
  header:{
    marginTop:20,
    marginBottom:16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D5A3C',
  },
  headerSubtitle: {
    color: '#3D5A3C',
    opacity:.6,
  },

  greenCard: {
    backgroundColor: '#3D5A3C',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  tanCard: {
    backgroundColor: '#D4A574',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  statsRow: {       
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
  },
  statChange: {
    fontSize: 12,
    color: '#D4A574',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    },
  
  goalRow: {
    flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 16,
  },
  goalIcon: {
    fontSize: 22,
    marginRight: 12,
    alignSelf: 'center',
  },
  goalTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  goalSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 8,
  },
    primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#3D5A3C',
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: '#3D5A3C',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#3D5A3C',
    fontWeight: '600',
  },
});