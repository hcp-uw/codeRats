import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Home, Calendar, Edit3, BarChart2, ShoppingCart, Award, Flame, Target, TrendingUp } from 'lucide-react-native';
import { SignUpStyles as styles } from './AuthStyles';


const ProfilePage = () => {
  const dailyTasks = [
    { id: 1, title: '5km run', reward: 80, completed: false },
    { id: 2, title: '30 burpees', reward: 40, completed: false },
    { id: 3, title: 'Stretch 15min', reward: 25, completed: false },
  ];

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
            <Text style={styles.currencyText}>15,847</Text>
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
          <Text style={styles.userName}>Profile name</Text>
          <Text style={styles.userTitle}>Fitness Warrior</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox icon={<TrendingUp color="white" size={18}/>} label="Day Streak" value="127" />
          <View style={styles.divider} />
          <StatBox icon={<Target color="white" size={18}/>} label="Goal Rate" value="89%" />
          <View style={styles.divider} />
          <StatBox icon={<Award color="white" size={18}/>} label="Achievements" value="24" />
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
          {dailyTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskLeft}>
                <View style={styles.checkbox} />
                <Text style={styles.taskTitle}>{task.title}</Text>
              </View>
              <View style={styles.taskReward}>
                <Award color="#D9A066" size={14} />
                <Text style={styles.rewardText}>{task.reward}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon={<Home color="#A1A1A1" />} label="Home" />
        <NavItem icon={<Calendar color="#A1A1A1" />} label="Calendar" />
        <View style={styles.activeNavCircle}>
          <Edit3 color="#D9A066" size={32} />
        </View>
        <NavItem icon={<BarChart2 color="#A1A1A1" />} label="Stats" />
        <NavItem icon={<ShoppingCart color="#A1A1A1" />} label="Market" />
      </View>
    </SafeAreaView>
  );
};

// Reusable Components
const StatBox = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <View style={styles.statBox}>
    <View style={styles.statValueRow}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const NavItem = ({ icon, label }: { icon: any, label: string }) => (
  <TouchableOpacity style={styles.navItem}>
    {icon}
    <Text style={styles.navLabel}>{label}</Text>
  </TouchableOpacity>
);

export default ProfilePage;