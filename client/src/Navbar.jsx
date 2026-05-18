import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Home, Calendar, Edit3, BarChart2, CircleFadingPlus } from 'lucide-react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

const Navbar = () => {
  // hooks to access navigation and current route
  const navigation = useNavigation();
  const route = useRoute();

  // Helper to handle navigation
  const navigateTo = (routeName) => {
    navigation.navigate(routeName);
  };

  // Helper to determine if a route is active by name
  const isActive = (routeName) => route.name === routeName;

  return (
    <View style={styles.bottomNav}>
      <NavItem 
        icon={<Home color={isActive('Profile') ? "#3D523B" : "#A1A1A1"} />} 
        label="Home" 
        onPress={() => navigateTo('Profile')}
      />
      <NavItem 
        icon={<Calendar color={isActive('Calendar') ? "#3D523B" : "#A1A1A1"} />} 
        label="Calendar" 
        onPress={() => navigateTo('Calendar')}
      />
      
     

      <NavItem 
        icon={<BarChart2 color={isActive('GoalsScreen') ? "#3D523B" : "#A1A1A1"} />} 
        label="Stats" 
        onPress={() => navigateTo('GoalsScreen')}
      />
      <NavItem 
        icon={<CircleFadingPlus color={isActive('WorkoutScreen') ? "#3D523B" : "#A1A1A1"} />} 
        label="WorkoutScreen" 
        onPress={() => navigateTo('WorkoutScreen')}
      />
    </View>
  );
};

const NavItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    {icon}
    <Text style={styles.navLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  navItem: { alignItems: 'center', flex: 1 },
  navLabel: { fontSize: 10, color: '#A1A1A1', marginTop: 4 },
  activeNavCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#FDF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 45,
    borderWidth: 3,
    borderColor: '#D9A066',
    elevation: 5,
  }
});

export default Navbar;