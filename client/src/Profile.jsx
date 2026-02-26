import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Home, Calendar, Edit3, BarChart2, ShoppingCart, Award, Flame, Target, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import Navbar from './Navbar';

const Profile = () => {
  const dailyTasks = [
    { id: 1, title: '5km run', reward: 80, completed: false },
    { id: 2, title: '30 burpees', reward: 40, completed: false },
    { id: 3, title: 'Stretch 15min', reward: 25, completed: false },
  ];
  const [tasks, setTasks] = useState(dailyTasks);

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Navigation */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <ChevronLeft color="white" size={28} />
            <Text style={styles.headerText}>Action</Text>
          </TouchableOpacity>
          <View style={styles.currencyContainer}>
            <Award color="white" size={20} />
            <Text style={styles.currencyText}>15,847</Text> // TODO: backend Import user coins
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle} />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lvl 12</Text>
            </View>
          </View>
          <Text style={styles.userName}>User's name</Text> // TODO: backend import user's name e.g. Megan
          <Text style={styles.userTitle}>Fitness Warrior</Text> // TODO: backend username e.g. IhateRunning
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox icon={<TrendingUp color="white" size={18}/>} label="Day Streak" value="127" /> // TODO: backend Import user Day streak
          <View style={styles.divider} />
          <StatBox icon={<Target color="white" size={18}/>} label="Goal Rate" value="89%" /> // TODO: backend
          <View style={styles.divider} />
          <StatBox icon={<Award color="white" size={18}/>} label="Achievements" value="24" /> // TODO: backend
        </View>

        {/* Daily Workout Card */}
        <View style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTitle}>Daily Workout</Text> 
            <View style={styles.completionStatus}>
              <Flame color="#D9A066" size={16} />
              <Text style={styles.completionText}> 0/3 completed</Text>
            </View>
          </View>

        {/* Date Picker Ribbon */}
        <View style={styles.dateRibbon}>
          {['Tue 21', 'Wed 22', 'Thu 23', 'Fri 24'].map((date, index) => (
            <View key={index} style={[styles.dateItem, index === 0 && styles.activeDateItem]}>
              <Text style={[styles.dateText, index === 0 && styles.activeDateText]}>{date.split(' ')[0]}</Text>
              <Text style={[styles.dateNumber, index === 0 && styles.activeDateText]}>{date.split(' ')[1]}</Text>
            </View>
          ))}
        </View>

        {/* Task List */}
        {tasks.map((task) => (
        <View key={task.id} style={styles.taskItem}>
          <View style={styles.taskLeft}>
            <TouchableOpacity 
              style={[styles.checkbox, task.completed && { backgroundColor: '#D9A066', borderColor: '#D9A066' }]} 
              onPress={() => toggleTask(task.id)} 
            />
            <Text style={[styles.taskTitle, task.completed && { color: '#A1A1A1', textDecorationLine: 'line-through' }]}>{task.title}</Text>
          </View>
          <View style={styles.taskReward}>
            <Award color="#D9A066" size={16} />
            <Text style={styles.rewardText}>+{task.reward}</Text>
          </View>
        </View>
        ))}
      </View>

        </ScrollView>
      <Navbar />
  </SafeAreaView>
  );
};

// Reusable Components
const StatBox = ({ icon, label, value }) => (
  <View style={styles.statBox}>
    <View style={styles.statValueRow}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3D523B' },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  headerText: { color: 'white', fontSize: 18, marginLeft: 5 },
  currencyContainer: { flexDirection: 'row', alignItems: 'center' },
  currencyText: { color: 'white', marginLeft: 5, fontWeight: 'bold' },
  profileSection: { alignItems: 'center', marginTop: 10 },
  avatarContainer: { width: 120, height: 120, position: 'relative' },
  avatarCircle: { width: '100%', height: '100%', borderRadius: 60, backgroundColor: '#D9A066' },
  levelBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#D9A066', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 2, borderColor: '#3D523B' },
  levelText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  userName: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  userTitle: { color: '#A1A1A1', fontSize: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 25, paddingHorizontal: 20 },
  statBox: { alignItems: 'center' },
  statValueRow: { flexDirection: 'row', alignItems: 'center' },
  statValue: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 5 },
  statLabel: { color: '#A1A1A1', fontSize: 12, marginTop: 4 },
  divider: { width: 1, height: 40, backgroundColor: '#556B53' },
  workoutCard: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, flex: 1, minHeight: 400 },
  workoutHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  workoutTitle: { color: '#E0E0E0', fontSize: 18, fontWeight: '600' },
  completionStatus: { flexDirection: 'row', alignItems: 'center' },
  completionText: { color: '#A1A1A1', fontSize: 14 },
  dateRibbon: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  dateItem: { backgroundColor: '#F2F2F2', padding: 15, borderRadius: 15, alignItems: 'center', width: '22%' },
  activeDateItem: { backgroundColor: '#D9A066' },
  dateText: { color: '#888', fontSize: 12 },
  dateNumber: { color: '#444', fontSize: 18, fontWeight: 'bold' },
  activeDateText: { color: 'white' },
  taskItem: { backgroundColor: '#F9F9F4', padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  taskLeft: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: '#D9A066', marginRight: 15 },
  taskTitle: { color: '#666', fontSize: 16 },
  taskReward: { flexDirection: 'row', alignItems: 'center' },
  rewardText: { color: '#888', marginLeft: 5 },
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', height: 90, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 10 },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 10, color: '#A1A1A1', marginTop: 4 },
  activeNavCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FDF5E6', justifyContent: 'center', alignItems: 'center', marginBottom: 40, borderWidth: 2, borderColor: '#D9A066' }
});

export default Profile;