import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { ChevronLeft, Home, Calendar, Edit3, BarChart2, ShoppingCart, Award, Flame, Target, TrendingUp, X } from 'lucide-react-native';
import Navbar from './Navbar';
import { supabase } from '../lib/supabase';
import { getAvatarByUser, createAvatar } from './avatarBackend';
import { useIsFocused } from '@react-navigation/native';
import { getGoalsByUser } from './goalBackend';

const Profile = () => {
  const TODAY_STR = new Date().toDateString();

  // Generate the upcoming dates for the scroll feature
  const generateDates = () => {
    const dates = [];
    for (let i = -14; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        full: date.toDateString(), // Matches unique key bindings
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        num: date.getDate(),
      });
    }
    return dates;
  };

  const [availableDates] = useState(generateDates());
  const [selectedDate, setSelectedDate] = useState(availableDates[14].full);

  const ribbonScrollRef = useRef(null);
  const ITEM_WIDTH = 62;

  // Dynamic State Variables
  const [userId, setUserId] = useState(null);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState("0");
  const [userProfile, setUserProfile] = useState({ name: 'Loading...', username: '@loading' });
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const isFocused = useIsFocused();

  const currentTasks = tasks;

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const handleSnapToToday = () => {
    setSelectedDate(TODAY_STR); // Automatically select today's data rows
    ribbonScrollRef.current?.scrollTo({
      x: 20.25 * ITEM_WIDTH,
      animated: true,
    });
  };

  const fetchAvatarData = async (uid) => {
    try {
      let avatarRow = await getAvatarByUser(uid);

      if (!avatarRow) {
        avatarRow = await createAvatar({ user_id: uid });
      }

      setAvatar(avatarRow);
      setCoins((avatarRow.coins ?? 0).toLocaleString());
    } catch (err) {
      console.error("Error fetching avatar data:", err.message);
    } finally {
      setLoadingAvatar(false);
    }
  };

  // Fetch active goals from database
  const fetchActiveGoals = async (uid) => {
    try {
      const allGoals = await getGoalsByUser(uid);
      // Filter out completed/abandoned goals so we only show current targets
      const activeOnly = allGoals.filter(g => g.status === 'active');
      setGoals(activeOnly);
    } catch (err) {
      console.error("Error fetching goals for profile:", err);
    }
  };

  // INITIAL LOAD & FOCUS ONLY: Fetch session and snap UI to today
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        
        fetchUserProfile(session.user.id);
        fetchAvatarData(session.user.id); 
        calculateCurrentStreak(session.user.id);
        fetchTasksForDate(session.user.id, selectedDate);
        fetchActiveGoals(session.user.id);
      }
    };
    if (isFocused) {
      checkSession();

      setTimeout(() => {
        ribbonScrollRef.current?.scrollTo({
          x: 20.25 * ITEM_WIDTH, 
          animated: false // Initial snap should remain clean and non-visible
        });
      }, 100);
    }
  }, [isFocused]); 

  // DATA UPDATES ONLY: Fetch tasks whenever the user explicitly changes the viewed date
  useEffect(() => {
    if (userId) {
      fetchTasksForDate(userId, selectedDate);
    }
  }, [selectedDate, userId]);

  // Fetch Profile Details
  const fetchUserProfile = async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', uid)
      .single();
    
    if (data) {
      setUserProfile({ name: data.username, username: `@${data.username}` });
    }
  };

  // Check if rows exist for that particular date in database
  const fetchTasksForDate = async (uid, dateString) => {
    const parsedDate = new Date(dateString);
    const yyyy = parsedDate.getFullYear();
    const mm = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(parsedDate.getDate()).padStart(2, '0');
    const targetDate = `${yyyy}-${mm}-${dd}`; 

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    try {
      // A. Fetch Workouts from Supabase
      const { data: taskData } = await supabase
        .from('task')
        .select('*')
        .eq('user_id', uid)
        .gte('start_time', `${targetDate}T00:00:00.000`)
        .lte('start_time', `${targetDate}T23:59:59.999`);

      const mappedWorkouts = taskData ? taskData.map(t => {
        const taskDateStr = t.start_time.slice(0, 10);
        return {
          id: t.task_id,
          title: t.task_name,
          type: 'workout',
          completed: taskDateStr <= todayStr
        };
      }) : [];

      // B. Fetch Goals directly from Backend
      const allGoals = await getGoalsByUser(uid);
      
      const mappedGoals = allGoals
        .filter(g => {
          if (!g.end_date) return false;
          
          const goalDateParsed = new Date(g.end_date);
          const goalYyyy = goalDateParsed.getFullYear();
          const goalMm = String(goalDateParsed.getMonth() + 1).padStart(2, '0');
          const goalDd = String(goalDateParsed.getDate()).padStart(2, '0');
          const goalCleanDate = `${goalYyyy}-${goalMm}-${goalDd}`;

          return goalCleanDate === targetDate;
        })
        .map(g => ({
          id: g.goal_id,
          title: `${g.icon || '🎯'} ${g.goal_name}`,
          type: 'goal', 
          completed: g.status === 'completed'
        }));

      // C. Merge into comprehensive list
      const combinedActivities = [...mappedWorkouts, ...mappedGoals];
      setTasks(combinedActivities.flat());

    } catch (err) {
      console.error("Error aggregating daily profile stream:", err);
    }
  };

  // Calculate Streak
  const calculateCurrentStreak = async (uid) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('task')
      .select('start_time')
      .eq('user_id', uid)
      .gte('start_time', thirtyDaysAgo.toISOString())
      .order('start_time', { ascending: false });

    if (error || !data) return;

    const completedDates = new Set(
      data.map(t => t.start_time.slice(0, 10))
    );

    let currentStreak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let checkDate = new Date();
    
    if (completedDates.has(todayStr)) {
      checkDate = today;
    } else if (completedDates.has(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      setStreak(0);
      return;
    }

    while (true) {
      const checkDateStr = checkDate.toISOString().split('T')[0];
      if (completedDates.has(checkDateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const fetchLiveCoins = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('avatar')
        .select('coins')
        .eq('user_id', uid)
        .single();

      if (data) {
        setCoins(data.coins.toLocaleString()); 
      }
    } catch (err) {
      console.error("Error pulling live balance details:", err.message);
    }
  };

  useEffect(() => {
    if (isFocused && userId) {
      fetchLiveCoins(userId);
      calculateCurrentStreak(userId);
    }
  }, [isFocused, userId]);

  return (
    <SafeAreaView style={styles.container}>
        
        {/* Header Navigation */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleLogout}>
            <Text style={styles.headerText}>Logout</Text>
          </TouchableOpacity>
          <View style={styles.currencyContainer}>
            <Award color="white" size={20} />
            <Text style={styles.currencyText}>{coins}</Text> 
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarImageWrapper}
              onPress={() => setShowAvatarModal(true)}
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/avatar-head.png')}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>
                Lvl {loadingAvatar ? "..." : (avatar?.level ?? 1)}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userTitle}>
             HP {loadingAvatar ? "..." : (avatar?.health ?? 100)} • STR {loadingAvatar ? "..." : (avatar?.strength ?? 10)}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox icon={<TrendingUp color="white" size={18}/>} label="Day Streak" value={streak} />
          <View style={styles.divider} />
          <StatBox icon={<Target color="white" size={18}/>} label="Goal Rate" value="89%" />
          <View style={styles.divider} />
          <StatBox icon={<Award color="white" size={18}/>} label="Achievements" value="24" />
        </View>

        {/* Daily Workout Card */}
        <View style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTitle}>Daily Workout</Text> 

            {/* Action button that returns to Today */}
            <TouchableOpacity
              style={styles.todayButton}
              onPress={handleSnapToToday}
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
            
            <View style={styles.completionStatus}>
              <Flame color="#D9A066" size={16} />
              <Text style={styles.completionText}> 
                {currentTasks.filter(t => t.completed).length}/{currentTasks.length} completed
              </Text>
            </View>
          </View>

          {/* Date Picker Ribbon */}
          <View style={styles.datePickerContainer}>
            <ScrollView 
              ref={ribbonScrollRef}
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.dateRibbon}
            >
              {availableDates.map((dateObj) => {
                const isActive = selectedDate === dateObj.full;
                const isActualToday = dateObj.full === TODAY_STR;

                return (
                  <TouchableOpacity 
                    key={dateObj.full} 
                    onPress={() => setSelectedDate(dateObj.full)}
                    style={[
                      styles.dateItem, 
                      isActive && styles.activeDateItem,
                      (!isActive && isActualToday) && styles.todayShadedItem 
                    ]}
                  >
                    <Text style={[
                      styles.dateText, 
                      isActive && styles.activeDateText,
                      (!isActive && isActualToday) && styles.todayShadedText
                    ]}>
                      {dateObj.day}
                    </Text>
                    <Text style={[
                      styles.dateNumber, 
                      isActive && styles.activeDateText,
                      (!isActive && isActualToday) && styles.todayShadedText
                    ]}>
                      {dateObj.num}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Exercise + Goals List */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <View key={`${task.type}-${task.id}`} style={styles.taskItem}>
                  <View style={styles.taskLeft}>
                    {/* Checkbox Frame */}
                    <View 
                      style={[
                        styles.checkbox, 
                        task.completed 
                          ? { backgroundColor: '#D9A066', borderColor: '#D9A066' } 
                          : { backgroundColor: 'transparent', borderColor: '#A1A1A1', borderStyle: 'dashed' }
                      ]} 
                    />
                    {/* Dynamic Title Text (Struck out if completed) */}
                    <Text style={[
                      styles.taskTitle, 
                      task.completed 
                        ? { color: '#A1A1A1', textDecorationLine: 'line-through' } 
                        : { color: '#444444', textDecorationLine: 'none' }
                    ]}>
                      {task.title}
                    </Text>
                  </View>

                  {/* Goal items condition indicator */}
                  {task.type === 'goal' && (
                    <View style={styles.goalBadge}>
                      <Award size={14} color="#D9A066" style={{ marginRight: 4 }} />
                      <Text style={styles.goalBadgeText}>Goal</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: '#A1A1A1' }}>No activities scheduled for this day.</Text>
              </View>
            )}
          </ScrollView>
        </View>        
        
        {/* Preview Character Modal Overlay */}
        <Modal
          visible={showAvatarModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAvatarModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={require('../assets/avatar-full.png')}
                style={styles.fullAvatarImage}
                resizeMode="contain"
              />

              <Pressable
                style={styles.closeButton}
                onPress={() => setShowAvatarModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>    

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
  headerText: { color: 'white', fontSize: 18, marginLeft: 5},
  currencyContainer: { flexDirection: 'row', alignItems: 'center' },
  currencyText: { color: 'white', marginLeft: 5, fontWeight: 'bold' },
  profileSection: { alignItems: 'center', marginTop: 10 },
  avatarContainer: { width: 120, height: 120, position: 'relative' },
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
  dateRibbon: { 
    flexDirection: 'row', 
    paddingHorizontal: 25, 
    gap: 15, 
  },
  dateItem: { 
    backgroundColor: '#F2F2F2', 
    marginHorizontal: 3,
    paddingVertical: 12,
    paddingHorizontal: 20, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center',
    minWidth: 50, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  datePickerContainer: {
    marginBottom: 20,
    marginHorizontal: -25, 
  },
  activeDateItem: { 
    backgroundColor: '#D9A066',
    elevation: 4,
  },
  dateText: { 
    color: '#888', 
    fontSize: 13, 
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase'
  },
  dateNumber: { 
    color: '#444', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  activeDateText: { 
    color: 'white' 
  },
  taskItem: { backgroundColor: '#F9F9F4', padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  taskLeft: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: '#D9A066', marginRight: 15 },
  taskTitle: { color: '#666', fontSize: 16 },
  taskReward: { flexDirection: 'row', alignItems: 'center' },
  rewardText: { color: '#888', marginLeft: 5 },
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', height: 90, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 10 },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 10, color: '#A1A1A1', marginTop: 4 },
  activeNavCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FDF5E6', justifyContent: 'center', alignItems: 'center', marginBottom: 40, borderWidth: 2, borderColor: '#D9A066' },
  todayButton: {
    backgroundColor: 'rgba(217, 160, 102, 0.15)', 
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D9A066', 
  },
  todayButtonText: {
    color: '#D9A066',
    fontSize: 13,
    fontWeight: '600',
  },
  todayShadedItem: {
    backgroundColor: '#EAEAEA', 
    borderWidth: 1,
    borderColor: '#D9A066', 
  },
  todayShadedText: {
    color: '#D9A066', 
    fontWeight: '700',
  },
  avatarImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D9A066',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 110,
    height: 110,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullAvatarImage: {
    width: '100%',
    height: '85%',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#3D523B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;