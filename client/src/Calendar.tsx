import { useState } from "react";
import { ChevronLeft, ChevronRight, Trophy, Dumbbell } from "lucide-react-native";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Navbar from './Navbar'; 


interface ScheduleItem {
  id: string;
  title: string;
  category: "goal" | "workout";
  points: number;
  completed?: boolean;
}

interface DaySchedule {
  [key: string]: ScheduleItem[];
}

// Mock data for demonstration
const mockSchedule: DaySchedule = {
  "2026-04-01": [
    { id: "1", title: "Complete 5km run", category: "goal", points: 100, completed: false },
    { id: "2", title: "Morning yoga", category: "workout", points: 50, completed: true },
  ],
  "2026-04-15": [
    { id: "3", title: "Reach 10k steps", category: "goal", points: 80, completed: false },
    { id: "4", title: "Upper body strength", category: "workout", points: 120, completed: false },
    { id: "5", title: "30 min cardio", category: "workout", points: 90, completed: true },
  ],
  "2026-04-20": [
    { id: "6", title: "Drink 8 glasses of water", category: "goal", points: 40, completed: true },
    { id: "7", title: "Core workout", category: "workout", points: 70, completed: false },
  ],
  "2026-04-24": [
    { id: "8", title: "Complete weekly streak", category: "goal", points: 150, completed: false },
    { id: "9", title: "5km run", category: "workout", points: 80, completed: false },
    { id: "10", title: "30 burpees", category: "workout", points: 40, completed: false },
  ],
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#3d5a3c',
  },
  content: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  calendarCard: {
    width: '100%',
    maxWidth: 375,
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    width: '100%',
    // Add these lines:
    backgroundColor: '#D4A574', 
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  iconButton: {
    padding: 10,
    borderRadius: 12,
  },
  monthTitle: {
    fontFamily: 'Arial',
    color: '#3d5a3c',
    fontSize: 20,
    textAlign: 'center',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayLabelCell: {
    width: '13.5%',
    alignItems: 'center',
  },
  dayLabelText: {
    fontFamily: 'Arial',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', 
    marginBottom: 8,
    width: '100%',
  },
  dayCell: {
    width: '14.28%', // Exactly 1/7th of the width
    height: 90,
    padding: 4, // This creates the "gap" between days
  },
  dayInner: {
    flex: 1, // Fill the dayCell
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // Update these to apply to the inner box, not the cell
  todayCell: {
    backgroundColor: '#d4a574',
  },
  normalDayCell: {
    backgroundColor: 'rgba(212,207,186,0.5)',
  },
  dayButton: {
    padding: 10,
  },
  dayNumber: {
    fontFamily: 'Arial',
    fontSize: 16,
  },
  todayNumber: {
    color: '#f5f1e8',
  },
  normalDayNumber: {
    color: '#5f6a5f',
  },
  dotIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d4a574',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: '#fdfcf9',
    borderWidth: 0.5,
    borderColor: 'rgba(61,90,60,0.15)',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontFamily: 'Arial',
    color: '#5f6a5f',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#5f6a5f',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: 'Arial',
    color: '#5f6a5f',
    fontSize: 16,
  },
  item: {
    backgroundColor: 'rgba(212,207,186,0.3)',
    borderRadius: 10,
    padding: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(61,90,60,0.15)',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(61,90,60,0.15)',
    marginRight: 10,
  },
  itemTitle: {
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#808080',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#5f6a5f',
    marginLeft: 4,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Arial',
    color: '#808080',
    fontSize: 14,
  },
});

export default function MonthlyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setIsDialogOpen(true);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : '';
  const selectedSchedule = selectedDateKey ? mockSchedule[selectedDateKey] || [] : [];
  const goals = selectedSchedule.filter((item) => item.category === 'goal');
  const workouts = selectedSchedule.filter((item) => item.category === 'workout');

  const hasSchedule = (day: number) => {
    const dateKey = formatDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    return mockSchedule[dateKey]?.length > 0;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconButton} onPress={handlePreviousMonth}>
              <ChevronLeft size={24} color="#3d5a3c" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{monthName}</Text>
            <TouchableOpacity style={styles.iconButton} onPress={handleNextMonth}>
              <ChevronRight size={24} color="#3d5a3c" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.dayLabelsRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <View key={day} style={styles.dayLabelCell}>
                <Text style={styles.dayLabelText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {/* Empty cells for padding at the start */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.dayCell} />
            ))}

            {/* Actual days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const hasItems = hasSchedule(day);
              const isTodayDate = isToday(day);
              
              return (
                <View key={day} style={styles.dayCell}>
                  <TouchableOpacity
                    style={[
                      styles.dayInner,
                      isTodayDate ? styles.todayCell : styles.normalDayCell,
                    ]}
                    onPress={() => handleDayClick(day)}
                  >
                    <Text style={[styles.dayNumber, isTodayDate ? styles.todayNumber : styles.normalDayNumber]}>
                      {day}
                    </Text>
                    {hasItems && <View style={styles.dotIndicator} />}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <Navbar/>

      <Modal
        visible={isDialogOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDialogOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsDialogOpen(false)}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Selected Date'}
            </Text>

            {goals.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Trophy size={16} color="#d4a574" style={styles.sectionIcon} />
                  <Text style={styles.sectionTitle}>Goals</Text>
                </View>
                {goals.map((item) => (
                  <View key={item.id} style={styles.item}>
                    <View style={styles.itemRow}>
                      <View style={styles.itemLeft}>
                        <View style={[styles.checkbox, item.completed && { backgroundColor: '#d4a574' }]} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                      </View>
                      <View style={styles.itemRight}>
                        <Trophy size={16} color="#d4a574" />
                        <Text style={styles.points}>{item.points}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {workouts.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Dumbbell size={16} color="#d4a574" style={styles.sectionIcon} />
                  <Text style={styles.sectionTitle}>Workouts</Text>
                </View>
                {workouts.map((item) => (
                  <View key={item.id} style={styles.item}>
                    <View style={styles.itemRow}>
                      <View style={styles.itemLeft}>
                        <View style={[styles.checkbox, item.completed && { backgroundColor: '#d4a574' }]} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                      </View>
                      <View style={styles.itemRight}>
                        <Dumbbell size={16} color="#d4a574" />
                        <Text style={styles.points}>{item.points}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {selectedSchedule.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No scheduled items for this day</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}