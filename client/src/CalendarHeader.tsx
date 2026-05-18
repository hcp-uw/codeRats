import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Check } from 'lucide-react-native';

interface HeaderProps {
  viewMode: 'weekly' | 'monthly';
  onViewModeChange: (mode: 'weekly' | 'monthly') => void;
}

export default function CalendarHeader({ viewMode, onViewModeChange }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3d5a3c',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#D4A574',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#3d5a3c',
    fontSize: 14,
    fontWeight: '500',
  },
  checkIcon: {
    backgroundColor: 'rgba(61, 90, 60, 0.3)',
    borderRadius: 4,
    padding: 2,
  },
});
