import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Home, Calendar, Edit3, BarChart2, ShoppingCart, Award, Flame, Target, TrendingUp } from 'lucide-react-native';
import Navbar from './Navbar';
import { supabase } from '../lib/supabase'
import { useIsFocused } from '@react-navigation/native';

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
      const { data, error } = await supabase
        .from('avatar')
        .select('coins, level')
        .eq('user_id', uid)
        .single();

      if (error) throw error;
      if (data) {
        setCoins(data.coins); // Updates state with persistent coins from the schema!
      }
    } catch (err) {
      console.error("Error fetching avatar data:", err.message);
    }
  };

  // Fetch session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        
        fetchUserProfile(session.user.id);
        fetchAvatarData(session.user.id); 
        calculateCurrentStreak(session.user.id);
        fetchTasksForDate(session.user.id, selectedDate);
      }
    };
    if (isFocused) {
      checkSession();

      setTimeout(() => {
        ribbonScrollRef.current?.scrollTo({
          x: 20.25 * ITEM_WIDTH, 
          animated: false // Set to false if you want it to be invisible to the eye!
        });
      }, 100);
    }
  }, [isFocused]);

  // Fetch tasks whenever the user changes the viewed date
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

  // Check if rows exist for that particular date in databse
  const fetchTasksForDate = async (uid, dateString) => {
    // Standardizes the selected ribbon date into a clean YYYY-MM-DD format
    const parsedDate = new Date(dateString);
    const yyyy = parsedDate.getFullYear();
    const mm = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(parsedDate.getDate()).padStart(2, '0');
    const targetDate = `${yyyy}-${mm}-${dd}`; 

    // Added for mark as complete task
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const { data } = await supabase
      .from('task')
      .select('*')
      .eq('user_id', uid)
      // REMOVED 'Z' HERE: Querying against local time snapshots directly
      .gte('start_time', `${targetDate}T00:00:00.000`)
      .lte('start_time', `${targetDate}T23:59:59.999`);

    if (data) {
      const mappedTasks = data.map(t => {
        const taskDateStr = t.start_time.slice(0, 10);
        
        return {
          id: t.task_id,
          title: t.task_name,
          completed: taskDateStr <= todayStr 
        }
        
      });
      setTasks(mappedTasks);
    } else {
      setTasks([]);
    }
  };

  // Calculate Streak
    // Do this by pulling user's task history and walk backwards day-by-day
    // to compute streak value dynamically
    // TODO - Later change this to just be a value in the schema 
  const calculateCurrentStreak = async (uid) => {
    // Fetch start_times for tasks over the last month (or adjust range as needed)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('task')
      .select('start_time')
      .eq('user_id', uid)
      .gte('start_time', thirtyDaysAgo.toISOString())
      .order('start_time', { ascending: false });

    if (error || !data) return;

    // Extract unique calendar dates (YYYY-MM-DD) that have recorded tasks
    const completedDates = new Set(
      data.map(t => t.start_time.slice(0, 10))
    );

    let currentStreak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Determine our starting baseline date
    let checkDate = new Date();
    
    if (completedDates.has(todayStr)) {
      // If completed today, start counting backward from today
      checkDate = today;
    } else if (completedDates.has(yesterdayStr)) {
      // If missed today but completed yesterday, streak is still alive starting yesterday
      checkDate = yesterday;
    } else {
      // Missed both today and yesterday? Streak is broken.
      setStreak(0);
      return;
    }

    // Step backward day-by-day until a gap is hit
    while (true) {
      const checkDateStr = checkDate.toISOString().split('T')[0];
      if (completedDates.has(checkDateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1); // Move 1 day back
      } else {
        break; // Chain broken
      }
    }

    setStreak(currentStreak);
  };


  // Check with Seorim's version --> Recording New Task Completion
  const logCompletedTask = async (taskName, activityType = 'running', distance = 5.0) => {
    if (!userId) return;

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('task')
      .insert([
        {
          user_id: userId,
          task_name: taskName,
          start_time: now,
          activity_type: activityType,
          distance: distance,
          // Add default fields or mappings required by your database schema constraints
        }
      ])
      .select();

    if (!error) {
      // Refresh the streak computation and the current list layout
      calculateCurrentStreak(userId);
      fetchTasksForDate(userId, selectedDate);
    } else {
      console.error("Error saving task:", error.message);
    }
  };

  // Fetch Coins
  const fetchLiveCoins = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('avatar')
        .select('coins')
        .eq('user_id', uid)
        .single();

      if (data) {
        // Formats numbers with commas automatically (e.g., 15847 becomes "15,847")
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
            <Text style={styles.currencyText}>{coins.toLocaleString()}</Text> 
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
          {/* TODO: backend import user's name e.g. Megan */}
          <Text style={styles.userName}>User's name</Text> 
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
        <View>
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
                    // If it is today but NOT actively selected, apply a light, distinct outline tint
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

        {/* Task List */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskLeft}>
                  {/* Updated Checkbox to dynamically render based on completion state */}
                  <View 
                    style={[
                      styles.checkbox, 
                      task.completed 
                        ? { backgroundColor: '#D9A066', borderColor: '#D9A066' } 
                        : { backgroundColor: 'transparent', borderColor: '#A1A1A1', borderStyle: 'dashed' }
                    ]} 
                  />
                  {/* Updated Text styling to only strike-through completed exercises */}
                  <Text style={[
                    styles.taskTitle, 
                    task.completed 
                      ? { color: '#A1A1A1', textDecorationLine: 'line-through' } 
                      : { color: '#444444', textDecorationLine: 'none' }
                  ]}>
                    {task.title}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#A1A1A1' }}>No workouts scheduled for this day.</Text>
            </View>
          )}
        </ScrollView>
      </View>        
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
  dateRibbon: { 
    flexDirection: 'row', 
    paddingHorizontal: 25, // Re-aligns the first item with your content padding
    gap: 15, // Creates consistent spacing between items
  },
  dateItem: { 
    backgroundColor: '#F2F2F2', 
    marginHorizontal: 3,
    paddingVertical: 12,
    paddingHorizontal: 20, // Wider horizontal padding for a "pill" or "card" look
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center',
    minWidth: 50, // Ensures the days have a substantial presence
    // Optional: add a subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  datePickerContainer: {
    marginBottom: 20,
    marginHorizontal: -25, // This pulls the scroll area to the edges of the screen
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
    backgroundColor: 'rgba(217, 160, 102, 0.15)', // Accent tint color opacity
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D9A066', // Accent theme color boundary
  },
  todayButtonText: {
    color: '#D9A066',
    fontSize: 13,
    fontWeight: '600',
  },
  todayShadedItem: {
    backgroundColor: '#EAEAEA', // Light background gray block placeholder
    borderWidth: 1,
    borderColor: '#D9A066', // Distinct warm accent line frame
  },
  todayShadedText: {
    color: '#D9A066', // Contrasted tracking text
    fontWeight: '700',
  }
});

export default Profile;