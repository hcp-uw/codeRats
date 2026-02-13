import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Home, Edit3, BarChart2, ShoppingCart, Award, Flame, Target, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import CalendarHeader from './CalendarHeader';

interface Workout {
  id: string;
  name: string;
  points: number;
  completed: boolean;
}

interface DayData {
  date: number;
  workouts: Workout[];
}

interface Props {
  month: string;
  year?: number;
  daysInMonth?: number;
  selectedDate?: number;
  workoutData?: Record<number, DayData>;
  onDateSelect: (date: number) => void;
}

export function Calendar({
  month,
  daysInMonth = 31,
  selectedDate = 1,
  workoutData = {} as Record<number, DayData>,
  onDateSelect,
}: Props) {
  const daysOfWeek = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
  
  // Calculate offset for first day of month (assuming 1st is on Thursday for August)
  const firstDayOffset = 4; // Thursday
  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = new Array(firstDayOffset).fill(null);
  
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const getCompletedCount = () => {
    let total = 0;
    let completed = 0;
    Object.values(workoutData).forEach(day => {
      total += day.workouts.length;
      completed += day.workouts.filter(w => w.completed).length;
    });
    return { completed, total };
  };

  const { completed, total } = getCompletedCount();

  return (
    <SafeAreaView style={styles.container}>
      <CalendarHeader month={month} completed={completed} total={total} />

      {/* Days of week header */}
      <View style={styles.daysOfWeekContainer}>
      {daysOfWeek.map((day, idx) => (
        <Text key={idx} style={styles.dayOfWeekText}>
        {day}
        </Text>
      ))}
      </View>

      {/* Calendar grid */}
      <ScrollView style={styles.calendarGrid}>
      {weeks.map((week, weekIdx) => (
        <View key={weekIdx} style={styles.weekRow}>
        {week.map((day, dayIdx) => (
          <View key={dayIdx} style={styles.dayCell}>
          {day && (
            <TouchableOpacity
            onPress={() => onDateSelect(day)}
            style={[
              styles.dayButton,
              selectedDate === day && styles.selectedDayButton,
            ]}
            >
            <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          )}
          </View>
        ))}
        </View>
      ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7e7e7c',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flameIcon: {
    padding: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#5f6a5f',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dayOfWeekText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.5)',
    flex: 1,
    textAlign: 'center',
  },
  calendarGrid: {
    flex: 1,
    paddingHorizontal: 4,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
  },
  dayButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#f5f0e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: 'rgba(61,90,60,0.11)',
  },
  dayText: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
  },
});


export default Calendar;
