import { supabase } from './lib/supabase'

import React, { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, KeyboardAvoidingView, Platform} from 'react-native';

import WelcomeScreen from './src/WelcomeScreen';
import LogInScreen from './src/LogInScreen';
import SignUpScreen from './src/SignUpScreen';
import Profile from './src/Profile';
import GoalsScreen from './src/GoalsScreen';
import Calendar from './src/Calendar';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutScreen from './src/InputWorkoutScreen'; 
const Stack = createStackNavigator();
import Navbar from './src/Navbar';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//const Tab = createBottomTabNavigator();


export default function App() {
  const [instruments, setInstruments] = useState([])
  useEffect(() => {
    getInstruments()
  }, [])
  async function getInstruments() {
    const { data } = await supabase.from('instruments').select()
    setInstruments(data)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LogInScreen" component={LogInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
        <Stack.Screen name="GoalsScreen" component={GoalsScreen} />
        <Stack.Screen name="Calendar" component={Calendar} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
