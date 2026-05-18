import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trophy, Dumbbell, Pencil, Trash2 } from "lucide-react-native";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import Navbar from './Navbar';
import { useAuth } from './AuthContext';
import { getTasksByUser, deleteTask, updateTask, deductUserCoins } from './taskBackend';
import { useIsFocused } from "@react-navigation/native";

interface ScheduleItem {
  id: string;
  title: string;
  category: "goal" | "workout";
  points: number;
  completed?: boolean;
  description?: string | null;
  activity_type?: string | null;
  duration?: number | null;
  start_time?: string | null;
  distance?: number | null;
  muscle_groups?: string | null;
  exercise?: string | null;
  weight?: number | null;
  set_reps?: string | null;
}

interface DaySchedule {
  [key: string]: ScheduleItem[];
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#3d5a3c',
  },
  content: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 10, // 16
    paddingVertical: 12,
    marginBottom: 18,
    width: '100%',
    borderRadius: 12,
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
    width: '14.28%',
    height: 90,
    padding: 4,
  },
  dayInner: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
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
  todayIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3d5a3c',
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
    flex: 1,
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
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    padding: 4,
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
  detailText: {
    fontFamily: 'Arial',
    fontSize: 13,
    color: '#808080',
    marginTop: 4,
  },
  // Edit modal styles
  editModalCard: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: '#fdfcf9',
    borderWidth: 0.5,
    borderColor: 'rgba(61,90,60,0.15)',
    borderRadius: 14,
    padding: 20,
    maxHeight: '80%',
  },
  editModalTitle: {
    fontFamily: 'Arial',
    color: '#5f6a5f',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    paddingRight: 24,
  },
  editInput: {
    backgroundColor: 'rgba(212,207,186,0.3)',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#3d5a3c',
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(61,90,60,0.2)',
  },
  editLabel: {
    fontFamily: 'Arial',
    fontSize: 12,
    color: '#808080',
    marginBottom: 3,
  },
  editButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(61,90,60,0.2)',
  },
  cancelBtnText: {
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#5f6a5f',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#d4a574',
  },
  saveBtnText: {
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#3d5a3c',
    fontWeight: '600',
  },
  exerciseSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Soft ambient border rule
    marginVertical: 10,
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  multiExerciseTitle: {
    color: '#D9A066',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default function MonthlyCalendar() {
  const { user } = useAuth() as { user: any };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule>({});

  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editDistance, setEditDistance] = useState('');
  const [editExercise, setEditExercise] = useState('');
  const [editMuscleGroups, setEditMuscleGroups] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editSetReps, setEditSetReps] = useState('');

  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const todayDateString = new Date().toLocaleDateString('sv-SE');
  
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const tasks = await getTasksByUser(user.id);
        
        const newSchedule: DaySchedule = {};
        tasks.forEach((task) => {
          if (task.start_time) {
            const localDate = new Date(task.start_time);
            
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0');
            const day = String(localDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            
            if (!newSchedule[dateKey]) {
              newSchedule[dateKey] = [];
            }
            newSchedule[dateKey].push({
              id: String(task.task_id),
              title: task.task_name,
              category: "workout",
              points: Math.round(task.duration ?? 0),
              completed: false,
              description: task.description ?? null,
              activity_type: task.activity_type ?? null,
              duration: task.duration ?? null,
              start_time: task.start_time ?? null,
              distance: task.distance ?? null,
              muscle_groups: task.muscle_groups ?? null,
              exercise: task.exercise ?? null,
              weight: task.weight ?? null,
              set_reps: task.set_reps ?? null,
            });
          }
        });
        
        setSchedule(newSchedule);
      } catch (err) {
        console.error("Error loading calendar data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      loadTasks();
    }
  }, [user, isFocused]);

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

  const handleDeleteWorkout = (item: ScheduleItem) => {
    Alert.alert(
      'Delete Workout',
      `Delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(item.id);
              await deductUserCoins(user.id, 10);

              if (!item.start_time) return;
              const d = new Date(item.start_time);
              const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
              if (!dateKey) return;
              setSchedule(prev => {
                const updated = { ...prev };
                updated[dateKey] = (updated[dateKey] ?? []).filter(i => i.id !== item.id);
                if (updated[dateKey].length === 0) delete updated[dateKey];
                return updated;
              });
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const handleEditOpen = (item: ScheduleItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description ?? '');
    setEditDuration(item.duration != null ? String(item.duration) : '');
    setEditDistance(item.distance != null ? String(item.distance) : '');
    setEditExercise(item.exercise ?? '');
    setEditMuscleGroups(item.muscle_groups ?? '');
    setEditWeight(item.weight != null ? String(item.weight) : '');
    setEditSetReps(item.set_reps ?? '');
  };

  const handleEditSave = async () => {
    if (!editingItem) return;
    const patch: any = {
      task_name: editTitle,
      description: editDescription || null,
      duration: editDuration ? Number(editDuration) : editingItem.duration,
    };
    if (editingItem.activity_type === 'run') {
      patch.distance = editDistance ? Number(editDistance) : null;
    }
    if (editingItem.activity_type === 'weight_lift') {
      patch.exercise = editExercise || null;
      patch.muscle_groups = editMuscleGroups || null;
      patch.weight = editWeight ? Number(editWeight) : null;
      patch.set_reps = editSetReps || null;
    }
    try {
      await updateTask(editingItem.id, patch);
      if (!editingItem.start_time) return;
      const d = new Date(editingItem.start_time);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (dateKey) {
        setSchedule(prev => {
          const updated = { ...prev };
          updated[dateKey] = (updated[dateKey] ?? []).map(i =>
            i.id === editingItem.id
              ? {
                  ...i,
                  title: editTitle,
                  description: editDescription || null,
                  duration: editDuration ? Number(editDuration) : i.duration,
                  distance: editingItem.activity_type === 'run'
                    ? (editDistance ? Number(editDistance) : null)
                    : i.distance,
                  exercise: editingItem.activity_type === 'weight_lift' ? (editExercise || null) : i.exercise,
                  muscle_groups: editingItem.activity_type === 'weight_lift' ? (editMuscleGroups || null) : i.muscle_groups,
                  weight: editingItem.activity_type === 'weight_lift' ? (editWeight ? Number(editWeight) : null) : i.weight,
                  set_reps: editingItem.activity_type === 'weight_lift' ? (editSetReps || null) : i.set_reps,
                }
              : i
          );
          return updated;
        });
      }
      setEditingItem(null);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : '';
  const selectedSchedule = selectedDateKey ? schedule[selectedDateKey] || [] : [];
  const goals = selectedSchedule.filter((item) => item.category === 'goal');
  const workouts = selectedSchedule.filter((item) => item.category === 'workout');

  const hasSchedule = (day: number) => {
    const dateKey = formatDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    return schedule[dateKey]?.length > 0;
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
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.dayCell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const hasItems = hasSchedule(day);
              const isTodayDate = isToday(day);
              return (
                <View 
                  key={day} style={styles.dayCell}>
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
                    {hasItems && (
                      <View style={isTodayDate ? styles.todayIndicator : styles.dotIndicator} />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <Navbar />

      <Modal
        visible={isDialogOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { setEditingItem(null); setIsDialogOpen(false); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {editingItem ? (
              <>
                <TouchableOpacity style={styles.closeButton} onPress={() => setEditingItem(null)}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
                <Text style={styles.editModalTitle}>Edit Workout</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.editLabel}>Title</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editTitle}
                    onChangeText={setEditTitle}
                    placeholder="Workout title"
                    placeholderTextColor="#aaa"
                  />
                  <Text style={styles.editLabel}>Description</Text>
                  <TextInput
                    style={[styles.editInput, { minHeight: 60, textAlignVertical: 'top' }]}
                    value={editDescription}
                    onChangeText={setEditDescription}
                    placeholder="Optional note"
                    placeholderTextColor="#aaa"
                    multiline
                  />
                  <Text style={styles.editLabel}>Duration (minutes)</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editDuration}
                    onChangeText={setEditDuration}
                    placeholder="e.g. 45"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                  />
                  {editingItem.activity_type === 'run' && (
                    <>
                      <Text style={styles.editLabel}>Distance (km)</Text>
                      <TextInput
                        style={styles.editInput}
                        value={editDistance}
                        onChangeText={setEditDistance}
                        placeholder="e.g. 5"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                      />
                    </>
                  )}
                  {editingItem.activity_type === 'weight_lift' && (
                    <>
                      <Text style={styles.editLabel}>Exercise</Text>
                      <TextInput
                        style={styles.editInput}
                        value={editExercise}
                        onChangeText={setEditExercise}
                        placeholder="e.g. bench press"
                        placeholderTextColor="#aaa"
                      />
                      <Text style={styles.editLabel}>Muscle Groups</Text>
                      <TextInput
                        style={styles.editInput}
                        value={editMuscleGroups}
                        onChangeText={setEditMuscleGroups}
                        placeholder="e.g. chest, back"
                        placeholderTextColor="#aaa"
                      />
                      <Text style={styles.editLabel}>Weight (lbs)</Text>
                      <TextInput
                        style={styles.editInput}
                        value={editWeight}
                        onChangeText={setEditWeight}
                        placeholder="e.g. 135"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                      />
                      <Text style={styles.editLabel}>Sets x Reps</Text>
                      <TextInput
                        style={styles.editInput}
                        value={editSetReps}
                        onChangeText={setEditSetReps}
                        placeholder="e.g. 3x10"
                        placeholderTextColor="#aaa"
                      />
                    </>
                  )}
                </ScrollView>
                <View style={styles.editButtonRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingItem(null)}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleEditSave}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
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
                          <View style={styles.itemActions}>
                            {item.duration != null && (
                              <View style={styles.itemRight}>
                                <Dumbbell size={14} color="#d4a574" />
                                <Text style={styles.points}>{item.duration}m</Text>
                              </View>
                            )}
                            <TouchableOpacity style={styles.actionBtn} onPress={() => handleEditOpen(item)}>
                              <Pencil size={14} color="#5f6a5f" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteWorkout(item)}>
                              <Trash2 size={14} color="#c0392b" />
                            </TouchableOpacity>
                          </View>
                        </View>
                        {item.start_time && (
                          <Text style={styles.detailText}>
                            {new Date(item.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </Text>
                        )}
                        {item.activity_type && (
                          <Text style={styles.detailText}>
                            Type: {item.activity_type.replace('_', ' ')}
                          </Text>
                        )}
                        {item.activity_type === 'run' && item.distance != null && (
                          <Text style={styles.detailText}>Distance: {item.distance} km</Text>
                        )}
                        {item.activity_type === 'weight_lift' && (
                          <>
                            {item.muscle_groups && <Text style={styles.detailText}>Muscles Target: {item.muscle_groups}</Text>}
                            
                            {item.exercise ? (() => {
                              try {
                                // Attempt to parse out our dynamic multi-row list
                                const parsedExercises = JSON.parse(item.exercise);
                                
                                if (Array.isArray(parsedExercises)) {
                                  return (
                                    <View style={{ marginTop: 6 }}>
                                      {parsedExercises.map((ex, idx) => (
                                        <View key={idx}>
                                          {/* Horizontal Separation Line Rules between items */}
                                          {idx > 0 && <View style={styles.exerciseSeparator} />}
                                          
                                          <Text style={styles.multiExerciseTitle}>🏋️‍♂️ {ex.exercise_name}</Text>
                                          <View style={{ flexDirection: 'row', paddingLeft: 16, marginTop: 2 }}>
                                            {ex.weight ? <Text style={styles.detailText}>Weight: {ex.weight} lbs  |  </Text> : null}
                                            {ex.set_reps ? <Text style={styles.detailText}>Stats: {ex.set_reps}</Text> : null}
                                          </View>
                                        </View>
                                      ))}
                                    </View>
                                  );
                                }
                              } catch (e) {
                                // Fallback safe catch: Render standard legacy format if it isn't a array layout bundle
                                return <Text style={styles.detailText}>Exercise: {item.exercise}</Text>;
                              }
                            })() : null}
                          </>
                        )}
                        {item.description && (
                          <Text style={styles.detailText}>Note: {item.description}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {selectedSchedule.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No scheduled items for this day</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}
