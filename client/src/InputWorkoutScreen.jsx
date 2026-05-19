import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {useNavigation} from '@react-navigation/native';
import {
  ActivityDropdown,
  DatePicker,
  TimePicker,
  DurationPicker,
  DistancePicker
} from "./Dropdown";
import { supabase } from "../lib/supabase";
import { createTaskFromWorkoutForm, rewardUserCoins } from "./taskBackend";

export default function WorkoutScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activity, setActivity] = useState("Run");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState("00:00:00");
  const [distance, setDistance] = useState("");

  /*
  const [muscleGroups, setMuscleGroups] = useState("");
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [setReps, setSetReps] = useState("");
  */

  const [exercisesList, setExercisesList] = useState([
    { exercise_name: "", weight: "", set_reps: "" }
  ]);
  const [muscleGroups, setMuscleGroups] = useState("");

  const isWeights = activity === "Weights";

  const activityOptions = ["Run", "Walk", "Cycle", "Weights"];

  const activityTypeMap = {
    Run: "run",
    Walk: "walk",
    Cycle: "cycle",
    Weights: "weight_lift",
  };

  // Updates a specific input field for a specific index row
  const handleUpdateExerciseItem = (index, field, value) => {
    setExercisesList(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // Pushes a brand new row entry field form into the screen matrix
  const handleAddExerciseRow = () => {
    setExercisesList(prev => [
      ...prev,
      { exercise_name: "", weight: "", set_reps: "" }
    ]);
  };

  // Removes a row if the user misclicked
  const handleRemoveExerciseRow = (index) => {
    if (exercisesList.length === 1) return; // Keep at least one
    setExercisesList(prev => prev.filter((_, i) => i !== index));
  };


  const handleSaveWorkout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "You must be logged in to save a workout");
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // This one is already safe since .toTimeString() uses local system time
    const timeStr = time.toTimeString().slice(0, 5);
    
    const [hh, mm, ss] = duration.split(":").map(Number);
    const durationMinutes = hh * 60 + mm + (ss || 0) / 60;

    try {
      // Prepare weightlifting data array if applicable
      let serializedExercises = null;
      if (isWeights) {
        // Filter out completely blank rows
        const validExercises = exercisesList.filter(e => e.exercise_name.trim() !== "");
        serializedExercises = JSON.stringify(validExercises);
      }

      await createTaskFromWorkoutForm({
        title,
        description,
        activity_type: activityTypeMap[activity] ?? activity.toLowerCase(),
        date: dateStr,
        time: timeStr,
        duration: durationMinutes,
        distance: !isWeights && distance ? Number(distance) : null,
        muscle_groups: isWeights && muscleGroups ? muscleGroups : null,

        // Pass the serialized multi-row JSON block down into the existing field string
        exercise: isWeights ? serializedExercises : null, 
        weight: null,   // Set singular column roots to null since we are multiplexing
        set_reps: null, 
        user_id: user.id,
      });


      await rewardUserCoins(user.id, 10);

      Alert.alert("Success", "Workout saved!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3E5A3C" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <TextInput
          style={styles.input}
          placeholder="Title your workout"
          placeholderTextColor="#5F6A5F"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor="#5F6A5F"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Activity */}
        <ActivityDropdown
          label="Select Activity"
          value={activity}
          options={activityOptions}
          onSelect={setActivity}
          iconName="walk-outline"
        />

        {/* Date */}
        <DatePicker
          value={date}
          onChange={setDate}
        />

        {/* Time */}
        <TimePicker 
          value={time}
          onChange={setTime}
        />

        {/* Duration */}
        <DurationPicker
          value={duration}
          onChange={setDuration}
        />

        {/* Distance — only for cardio activities */}
        {!isWeights && (
          <DistancePicker
            value={distance}
            onChange={setDistance}
            placeholder="Distance (km)"
          />
        )}

        {/* Weights-specific fields */}
        {/* Weights Form Options Matrix */}
        {isWeights && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Muscle Groups Target</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Chest, Triceps"
                placeholderTextColor="#A1A1A1"
                value={muscleGroups}
                onChangeText={setMuscleGroups}
              />
            </View>

            <Text style={[styles.label, { marginTop: 10, marginBottom: 5 }]}>Exercises List</Text>
            
            {exercisesList.map((item, index) => (
              <View key={index} style={styles.exerciseRowContainer}>
                <View style={styles.exerciseRowHeader}>
                  <Text style={styles.exerciseNumberText}>Exercise #{index + 1}</Text>
                  {exercisesList.length > 1 && (
                    <TouchableOpacity onPress={() => handleRemoveExerciseRow(index)}>
                      <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                    </TouchableOpacity>
                  )}
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Exercise Name (e.g. Bench Press)"
                  placeholderTextColor="#A1A1A1"
                  value={item.exercise_name}
                  onChangeText={(val) => handleUpdateExerciseItem(index, "exercise_name", val)}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TextInput
                    style={[styles.input, { width: '47%' }]}
                    placeholder="Weight (lbs)"
                    placeholderTextColor="#A1A1A1"
                    keyboardType="numeric"
                    value={item.weight}
                    onChangeText={(val) => handleUpdateExerciseItem(index, "weight", val)}
                  />
                  <TextInput
                    style={[styles.input, { width: '47%' }]}
                    placeholder="Sets x Reps (e.g. 4x10)"
                    placeholderTextColor="#A1A1A1"
                    value={item.set_reps}
                    onChangeText={(val) => handleUpdateExerciseItem(index, "set_reps", val)}
                  />
                </View>
              </View>
            ))}

            {/* Dynamic Add Button */}
            <TouchableOpacity style={styles.addExerciseButton} onPress={handleAddExerciseRow}>
              <Ionicons name="add-circle-outline" size={20} color="#D9A066" style={{ marginRight: 6 }} />
              <Text style={styles.addExerciseButtonText}>Add Another Exercise</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
        <Text style={styles.saveButtonText}>Save Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3D5A3C",
  },

  header: {
    backgroundColor: "#D4A574",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  content: {
    padding: 20,
  },

  input: {
    backgroundColor: "#F5F0E8",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  dropdown: {
    backgroundColor: "#F5F0E8",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dropdownText: {
    fontSize: 16,
    color: "#5F6A5F",
  },

  sectionTitle: {
    color: "#D4A574",
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },

  saveButton: {
    backgroundColor: "#D4A574",
    padding: 18,
    borderRadius: 14,
    margin: 20,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#3E5A3C",
    fontSize: 16,
    fontWeight: "600",
  },

  exerciseRowContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  exerciseRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseNumberText: {
    color: '#D4A574',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D9A066',
    marginBottom: 20,
  },
  addExerciseButtonText: {
    color: '#D9A066',
    fontWeight: '600',
    fontSize: 15,
  },
});