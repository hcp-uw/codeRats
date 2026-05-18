import React, { useState } from 'react';
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
import Navbar from './Navbar'; 

export default function GoalsScreen({ navigation }) {

//TODO: replace with Supbase fetch for user goals
  const [goals, setGoals] = useState([
    {
      id: '1',
      icon: '🏋️',
      title: "Bench 225 lbs",
      desc: "Target by June 2025",
    },
    {
      id: '2',
      icon: '🏃',
      title: "Sub 3 Hour Marathon",
      desc: "Train consistently for 6 months",    
    },
    {
      id: '3',
      icon: '🔥',
      title: "Workout Everyday",
      desc: "At least 30 minutes daily",    
    },
  ]); 

  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalIcon, setGoalIcon] = useState('🔥');


  const [modalVisible, setModalVisible] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isediting, setIsEditing] = useState(false);

  const handleSaveGoal = () => {

    if (!goalTitle.trim()) return;

    if (isediting) {
      setGoals(prev =>
        prev.map(g => g.id === selectedGoal.id ? { ...g, title: goalTitle, desc: goalDesc, icon: goalIcon } : g)
      );
    } else {
      const newGoal = {
        id: Date.now().toString(),
        title: goalTitle,
        desc: goalDesc,
        icon: goalIcon,
      };
      setGoals(prev => [...prev, newGoal]);
    }

    setGoalTitle('');
    setGoalDesc('');
    setGoalIcon('🔥');
    setModalVisible(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setGoals(prev => prev.filter(g => g.id !== selectedGoal.id));
    setMenuVisible(false);
  };

    
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}>

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

   
    {/* Goals List */}
    <View style={styles.greenCard}>
        <Text style={styles.cardTitle}>Your Goals</Text>

        {goals.map((goal, index) => (
          <View key={index}>

            {/* box row*/}
            <View style={styles.goalRow}>
              <Text style={styles.goalIcon}>{goal.icon}</Text>

        
                <View style={{flex:1}}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalSubtext}>{goal.desc}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedGoal(goal);
                    setMenuVisible(true);
                }}
                > 
                {/* Edit/delete buttons */}
                <Text style={styles.menuDots}>•••</Text>
                </TouchableOpacity>
                </View>

                {/* Divider Line*/}
                {index !== goals.length -1 && (
                  <View style={styles.divider}/>
                )}

              </View>
            ))}
            </View>

      {/* Buttons */}

      {/* Navigation Button */}
      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setModalVisible(true)}>

        {/* TODO: backend */}
        <Text style={styles.primaryButtonText}>Set New Goal</Text>
        </TouchableOpacity>

       {/* TODO: navigate to create goal */}
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>View History</Text>
      </TouchableOpacity>

      </View>

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
            onPress={() => setModalVisible(false)}>
              <Text style={{fontSize:18}}>x</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Create Goal</Text>

           {/* TODO: controlled input */}
           <TextInput
           placeholder="Title of Goal"
           placeholderTextColor="#fff"
           style={styles.input}/>

           {/* TODO  */}
           <TextInput
           placeholder="Description (how to get there, when, etc.)"
           placeholderTextColor="#fff"
           multiline
           style={[styles.input, {height:90}]}/>

           {/* TODO: icon picker */}
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


             {/* TODO: insert Goal  */}
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
});