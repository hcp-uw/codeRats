import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import WelcomeScreen from './src/WelcomeScreen';
import LogInScreen from './src/LogInScreen';
import SignUpScreen from './src/SignUpScreen';
<<<<<<<< HEAD:client/App.jsx
import Profile from './src/Profile';
========
import GoalsScreen from './src/GoalsScreen';
>>>>>>>> 6d1b1c10ee63f97f8f8689c6db263385097be8b2:client/App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutScreen from './src/InputWorkoutScreen'; 
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LogInScreen" component={LogInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
<<<<<<<< HEAD:client/App.jsx
        <Stack.Screen name="Profile" component={Profile} />
========
        <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
        <Stack.Screen name="GoalsScreen" component={GoalsScreen} />
>>>>>>>> 6d1b1c10ee63f97f8f8689c6db263385097be8b2:client/App.js
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});