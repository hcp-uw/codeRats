import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import DateTimePicker from '@react-native-community/datetimepicker';
import Navbar from './Navbar'; 
import { useAuth } from './AuthContext';
import { getGoalsByUser, createGoal, updateGoal, deleteGoal } from './goalBackend';

export default function GoalsScreen({ navigation }) {
  // Try to grab user id
  const { user, loading } = useAuth();
  const userId = user?.id;
  const [goals, setGoals] = useState([]);
  

  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalIcon, setGoalIcon] = useState('🔥');
  const [goalEnd, setGoalEnd] = useState(null);
  const [goalStatus, setGoalStatus] = useState('');

  const confettiRef = useRef(null);

  const [tempDate, setTempDate] = useState(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isediting, setIsEditing] = useState(false);

  const [overdueModalVisible, setOverdueModalVisible] = useState(false);
  const [currentOverdue, setCurrentOverdue] = useState(null);
  const [overdueQueue, setOverdueQueue] = useState([]);
  const [overdueChecked, setOverdueChecked] = useState(false);


  const [isRescheduling, setIsRescheduling] = useState(false);

  // Fetchs current goals from supabase automatically
  useEffect(() => {
    if (!userId) return;
    const fetchGoals = async () => {
      // get goal data for user
      const data = await getGoalsByUser(userId);

      // map data to expected fields
      const mapped = data.map(g => ({
        id: g.goal_id,
        title: g.goal_name,
        desc: g.goal_desc,
        icon: g.icon ?? '🎯',
        end: g.end_date ?? '',
        completed: g.status === 'completed',
      }));
      setGoals(mapped);
    };

    fetchGoals();
  }, [userId]); // reruns whenever userId changes

  useEffect(() => {
    if (!userId || goals.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = goals.filter(g => {
      if (!g.end || g.completed) return false;

      const d = new Date(g.end);
      if (isNaN(d)) return false;

      d.setHours(0, 0, 0, 0);
      return d < today;
    });

    if (overdue.length > 0) {
      setOverdueQueue(overdue);
      setCurrentOverdue(overdue[0]);
      setOverdueModalVisible(true);
    }
  }, [goals, userId]);

  const handleOverdueComplete = async () => {
    console.log("COMPLETE CLICKED", currentOverdue);

    try {
      const result = await updateGoal(
        currentOverdue.id,
        { status: 'completed' }
      );

      console.log("update result", result);

      setGoals(prev =>
        prev.map(g =>
          g.id === currentOverdue.id
            ? {
                ...g,
                completed: true,
              }
            : g
        )
      );

      handleNextOverdue();

    } catch (e) {
      console.log("COMPLETE ERROR:", e.message);
    }
  };

  const handleOverdueAbandon = async () => {
    const goal = currentOverdue;

    console.log("ABANDON CLICKED:", goal);

    if (!goal?.id) {
      console.log("No valid goal to abandon");
      return;
    }

    try {
      const result = await updateGoal(goal.id, {
        status: 'abandoned'
      });

      console.log("ABANDON RESULT:", result);

      setGoals(prev =>
        prev.filter(g => g.id !== goal.id)
      );

      handleNextOverdue();

    } catch (e) {
      console.log("ABANDON ERROR:", e.message);
    }
  };

  const handleOverdueKeepGoing = () => {
    setOverdueModalVisible(false);
    setGoalEnd(new Date(currentOverdue.end));
    setTempDate(new Date(currentOverdue.end));
    setIsRescheduling(true);
    setDatePickerVisible(true);
  };

  const handleNextOverdue = () => {
    setOverdueQueue(prev => {
      const remaining = prev.slice(1);

      if (remaining.length > 0) {
        setCurrentOverdue(remaining[0]);
        setOverdueModalVisible(true);
      } else {
        setCurrentOverdue(null);
        setOverdueModalVisible(false);
      }

      return remaining;
    });
  };

  const handleComplete = async (goal) => {
    const newStatus = goal.completed ? 'active' : 'completed';
    await updateGoal(goal.id, { status: newStatus });
    setGoals(prev =>
      prev.map(g => g.id === goal.id ? { ...g, completed: !g.completed } : g)
    );
    if (newStatus === 'completed') {
      confettiRef.current.start();
    }
  };

  const handleSaveGoal = async () => {
    console.log('1. fired', goalTitle, goalEnd);

    if (!goalTitle.trim()) return;
    console.log('2. past title check');

    try {
      let result;

      if (isediting) {
        console.log('3. editing branch');

        result = await updateGoal(selectedGoal.id, {
          goal_name: goalTitle,
          goal_desc: goalDesc,
          icon: goalIcon,
          end_date: goalEnd,
        });

        setGoals(prev =>
          prev.map(g =>
            g.id === selectedGoal.id
              ? {
                  ...g,
                  title: result.goal_name,
                  desc: result.goal_desc,
                  icon: result.icon,
                  end: result.end_date,
                }
              : g
          )
        );
      } else {
        console.log('3. create branch');

        result = await createGoal({
          goal_name: goalTitle,
          goal_desc: goalDesc,
          icon: goalIcon,
          end_date: goalEnd,
          user_id: userId,
        });

        setGoals(prev => [
          ...prev,
          {
            id: result.goal_id,
            title: result.goal_name,
            desc: result.goal_desc,
            icon: result.icon ?? '🔥',
            end: result.end_date ?? '',
            completed: result.status === 'completed',
          },
        ]);
      }

      console.log('4. success:', result);

      // only reset form after successful save
      setGoalTitle('');
      setGoalDesc('');
      setGoalIcon('🔥');
      setModalVisible(false);
      setIsEditing(false);
      setGoalEnd(null);
      setTempDate(null);

    } catch (e) {
      console.log('ERROR:', e.message);
    }
  };

  const handleDelete = async () => {
    const success = await deleteGoal(selectedGoal.id);
    if (success) {
      // Set state to array copy minus deleted goal
      setGoals(prev => prev.filter(g => g.id !== selectedGoal.id));
    }
    setMenuVisible(false);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
    
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 18 }}>

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
                {/* TODO: pull from Supabase the user stats */}
                <Text style={styles.statValue}>45</Text>

                {/* TODO: pull from Supabase the user stats */}
                <Text style={styles.statChange}>+5</Text>
            </View>

        <View style={styles.statBox}>   
                <Text style={styles.statLabel}>Weekly Miles</Text>
                {/* TODO: pull from Supabase the user stats */}
                <Text style={styles.statValue}>30</Text>

                {/* TODO: pull from Supabase the user stats */}
                <Text style={styles.statChange}>+3</Text>
            </View>
        
        <View style={styles.statBox}>   
                <Text style={styles.statLabel}>Max Bench</Text>
                {/* TODO: pull from Supabase the user stats */}
                <Text style={styles.statValue}>200</Text>

                {/* TODO: pull from Supabase the user stats */}
                <Text style={styles.statChange}>+10</Text>
            </View>
        </View>
    </View>

    {/* Muscle Groups Placeholder */}
    <View style={styles.tanCard}>
        <Text style={styles.cardTitle}>Muscle Groups Targeted</Text>

        {/* TODO: replace with a work analytics chart */}
        <Text style={styles.placeholderText}>
        Chart coming soon
            </Text>
        </View>

    {/* Goals List */}
    {/* Active Goals List */}
    <View style={styles.greenCard}>
        <Text style={styles.cardTitle}>Your Goals</Text>

        {activeGoals.map((goal, index) => (
          <View key={index}>
            <View style={styles.goalRow}>
              <Text style={styles.goalIcon}>{goal.icon}</Text>
              <View style={{flex:1}}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalEnd}>{formatDate(goal.end)}</Text>
                  <Text style={styles.goalSubtext}>{goal.desc}</Text>
              </View>
              <TouchableOpacity
                  style={[styles.checkbox, goal.completed && { backgroundColor: '#D4A574', borderColor: '#D4A574' }]}
                  onPress={() => handleComplete(goal)}
              />
              <TouchableOpacity onPress={() => {
                  setSelectedGoal(goal);
                  setMenuVisible(true);
              }}>
                  <Text style={styles.menuDots}>•••</Text>
              </TouchableOpacity>
            </View>
            {index !== activeGoals.length - 1 && <View style={styles.divider}/>}
          </View>
        ))}
    </View>

    {/* Set New Goal Button */}
    <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.primaryButtonText}>Set New Goal</Text>
        </TouchableOpacity>
    </View>

    {/* Completed Goals History */}
    {completedGoals.length > 0 && (
        <View style={[styles.greenCard, {marginTop: 20}]}>
          <Text style={styles.cardTitle}>🏆 Completed Goals</Text>
          {completedGoals.map((goal, index) => (
            <View key={index}>
              <View style={styles.goalRow}>
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <View style={{flex:1}}>
                  <Text style={[styles.goalTitle, {opacity: 0.6, textDecorationLine: 'line-through'}]}>{goal.title}</Text>
                  <Text style={styles.goalEnd}>{formatDate(goal.end)}</Text>
                  <Text style={styles.goalSubtext}>{goal.desc}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.checkbox, { backgroundColor: '#D4A574', borderColor: '#D4A574' }]}
                  onPress={() => handleComplete(goal)}
                />
              </View>
              {index !== completedGoals.length - 1 && <View style={styles.divider}/>}
            </View>
          ))}
        </View>
    )}

    </ScrollView>
    <Navbar/>

    {/* Modal */}

    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}>

      <View style={styles.modalOverlay}> 
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
          <View style={styles.modalCard}>
          {/* Close */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setGoalTitle('');
                setGoalDesc('');
                setGoalIcon('🔥');
                setGoalEnd(null);
                setIsEditing(false);
              }}>
              <Text style={{fontSize:18}}>x</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Create Goal</Text>

           <TextInput
           placeholder="Title of Goal"
           placeholderTextColor="#fff"
           style={styles.input}
           value={goalTitle}
           onChangeText={setGoalTitle}/>

          <TouchableOpacity 
            style={styles.input}
            onPress={() => setDatePickerVisible(true)}>
            <Text style={{color: '#fff'}}>
              {goalEnd ? goalEnd.toDateString() : 'Pick End Date (optional)'}
            </Text>
          </TouchableOpacity>

          {datePickerVisible && (
            <>
                  <DateTimePicker
                      value={tempDate ?? goalEnd ?? new Date()}
                      mode="date"
                      display="spinner"
                      onChange={onDateChange}
                  />
                  <TouchableOpacity 
                      style={styles.confirmButton}
                      onPress={async () => {
                          const newDate = tempDate ?? goalEnd;
                          setGoalEnd(newDate);
                          setDatePickerVisible(false);
                          if (isRescheduling && currentOverdue) {
                              await updateGoal(currentOverdue.id, { end_date: newDate });
                              setGoals(prev => prev.map(g => g.id === currentOverdue.id ? { ...g, end: newDate.toISOString() } : g));
                              setIsRescheduling(false);
                              handleNextOverdue(overdueQueue);
                          }
                      }}>
                      <Text style={{color: '#fff', fontWeight: '700'}}>Confirm</Text>
                  </TouchableOpacity>
              </>
          )}


           <TextInput
           placeholder="Description (how to get there, when, etc.)"
           placeholderTextColor="#fff"
           multiline
           style={[styles.input, {height:90}]}
           value={goalDesc}
           onChangeText={setGoalDesc}/>

           {/* Icon picker */}
            <Text style={{ color:'#fff', marginBottom:6}}>Choose Icon</Text>

            <TextInput
              value={goalIcon}
              onChangeText={(text) => setGoalIcon(text.slice(-2))}
              style={styles.emojiInput}
              maxLength={2}
              placeholder="Emoji Icon"
              placeholderTextColor="#fff"
              autoCorrect={false}
              autoCapitalize='none'
              />

             {/* Insert Goal  */}
            <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveGoal}>
              <Text style={{color:'#fff', fontWeight:'700'}}>Save Goal</Text>
            </TouchableOpacity>

          </View>
          </TouchableWithoutFeedback>
          </View>
    </Modal>
    {/* Edit Option Modal */}
    <Modal visible={menuVisible} transparent animationType="fade"> 
      <View style={styles.modalOverlay}>
        <View style={styles.menuCard}>

          <TouchableOpacity style={styles.menuOption} onPress={() => {
            setMenuVisible(false);
            setIsEditing(true);
            setGoalTitle(selectedGoal.title);
            setGoalDesc(selectedGoal.desc);
            setGoalIcon(selectedGoal.icon);
            setModalVisible(true);
          }}>

            <Text style={styles.menuText}>Edit Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuOption} onPress={handleDelete}>
            <Text style={styles.menuText}>Delete Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuOption} onPress={() => setMenuVisible(false)}>
            <Text style={[styles.menuText, {color:'red'}]}>Cancel</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
    <Modal visible={overdueModalVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>⏰ Goal Past Due</Text>
              <Text style={{color: '#fff', marginBottom: 8, fontWeight: '600', fontSize: 16}}>
                  {currentOverdue?.icon} {currentOverdue?.title}
              </Text>
              <Text style={{color: '#fff', opacity: 0.8, marginBottom: 24}}>
                  This goal was due {formatDate(currentOverdue?.end)}. What would you like to do?
              </Text>

              <TouchableOpacity style={styles.saveButton} onPress={handleOverdueComplete}>
                  <Text style={{color: '#fff', fontWeight: '700'}}>✅ Mark Completed</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={[styles.saveButton, {backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 10}]} 
                  onPress={handleOverdueAbandon}>
                  <Text style={{color: '#fff', fontWeight: '700'}}>🚩 Abandon Goal</Text>
              </TouchableOpacity>
          </View>
      </View>
  </Modal>

    <ConfettiCannon
        count={80}
        origin={{ x: 200, y: 0 }}
        autoStart={false}
        ref={confettiRef}
        fadeOut={true}
    />

    <ConfettiCannon
        count={80}
        origin={{ x: 200, y: 0 }}
        autoStart={false}
        ref={confettiRef}
        fadeOut={true}
    />

    </SafeAreaView>

  );
}
      

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#3D5A3C',
    paddingHorizontal: 16,
  },
  header:{
    marginTop:20,
    marginBottom:18
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    color: '#fff',
    opacity:.8,
    marginTop: 4,
  },

  greenCard: {
    backgroundColor: '#446646',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,

    shadowColor:'#000',
    shadowOpacity: .12,
    shadowRadius:8,
    shadowOffset:{width:0,height:4},
    elevation:5,

  },

  tanCard: {
    backgroundColor: '#D4A574',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,

    shadowColor:'#000',
    shadowOpacity: .12,
    shadowRadius:8,
    shadowOffset:{width:0,height:4},
    elevation:5,

  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  statsRow: {       
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,.07',
    padding:12,
    borderRadius:14,
    alignItems: 'center',
    flex: 1,
    marginHorizontal:4,
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
    marginTop:2,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    },
  
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical:14,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 12,
    backgroundColor:'rgba(255,255,255,.15',
    padding:8,
    borderRadius:10,

  },
  goalTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  goalSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 2,
  },
  goalEnd: {
    fontSize: 12,
    color: '#D4A574',
    marginTop: 2,
  },

  menuDots:{
    color:'#fff',
    fontSize:18
  },

  menuCard: {
    backgroundColor: '#fff',
    padding:20,
    borderRadius: 16,
    width: '75%',
  },
  menuOption: {
    paddingVertical: 14,
  },

  menuText: {
    fontSize: 16,
    fontWeight: '600',
  },  

  divider:{
    height:1,
    backgroundColor:'rgba(255,255,255,.15',
  },

  buttonContainer:{
    alignItems:'center',
    marginTop:10,
  },

    primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    width:'75%',
    marginBottom: 14,

    shadowColor:'#000',
    shadowOpacity: .15,
    shadowRadius:6,
    shadowOffset:{width:0,height:3},
  },


  primaryButtonText: {
    color: '#3D5A3C',
    fontWeight: '700',
    fontSize:16,
  },

  secondaryButton: {
    borderColor: '#fff',
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    width:'75%',
  },

  secondaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  modalOverlay:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.55)',
    justifyContent:'center',
    alignItems:'center',
  },

  modalCard:{
    width:'85%',
    backgroundColor:'#D4A574',
    borderRadius:20,
    padding:20,
  },

  modalTitle:{
    fontSize:20,
    fontWeight:'800',
    color:'#fff',
    marginBottom:18,
  },

  closeButton:{
    position:'absolute',
    right:14,
    top:14,
    zIndex:10,
  },

  input:{
    backgroundColor:'#C8935C',
    borderRadius:12,
    padding:14,
    marginBottom:14,
    color:'#fff',
  },

   emojiInput: {
    backgroundColor:'#C8935C',
    borderRadius:12,
    padding:14,
    marginBottom:28,
    color:'#fff',
    fontSize:12,
    textAlign:'center',
  },


  iconPicker:{
    backgroundColor:'#C8935C',
    padding:14,
    borderRadius:12,
    marginBottom:20,
  },

  saveButton:{
    backgroundColor:'#3D5A3C',
    padding:16,
    borderRadius:14,
    alignItems:'center',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 12,
  },

  confirmButton:{
    backgroundColor:'#3D5A3C',
    padding:10,
    borderRadius:10,
    alignItems:'center',
    marginTop:8,
    marginBottom:14,
    width:'40%',
    alignSelf:'center',
  },
});