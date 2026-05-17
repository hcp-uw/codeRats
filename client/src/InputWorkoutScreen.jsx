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
  const [muscleGroups, setMuscleGroups] = useState("");
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [setReps, setSetReps] = useState("");

  const isWeights = activity === "Weights";

  const activityOptions = ["Run", "Walk", "Cycle", "Weights"];

  const activityTypeMap = {
    Run: "run",
    Walk: "walk",
    Cycle: "cycle",
    Weights: "weight_lift",
  };

  const handleSaveWorkout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "You must be logged in to save a workout");
      return;
    }

    const dateStr = date.toISOString().split("T")[0];
    const timeStr = time.toTimeString().slice(0, 5);
    const [hh, mm, ss] = duration.split(":").map(Number);
    const durationMinutes = hh * 60 + mm + (ss || 0) / 60;

    try {
      await createTaskFromWorkoutForm({
        title,
        description,
        activity_type: activityTypeMap[activity] ?? activity.toLowerCase(),
        date: dateStr,
        time: timeStr,
        duration: durationMinutes,
        distance: !isWeights && distance ? Number(distance) : null,
        muscle_groups: isWeights && muscleGroups ? muscleGroups : null,
        exercise: isWeights && exercise ? exercise : null,
        weight: isWeights && weight ? Number(weight) : null,
        set_reps: isWeights && setReps ? setReps : null,
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
          />
        )}

        {/* Weights-specific fields */}
        {isWeights && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Muscle groups (e.g. chest, back)"
              placeholderTextColor="#5F6A5F"
              value={muscleGroups}
              onChangeText={setMuscleGroups}
            />
            <TextInput
              style={styles.input}
              placeholder="Exercise (e.g. bench press)"
              placeholderTextColor="#5F6A5F"
              value={exercise}
              onChangeText={setExercise}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight (lbs)"
              placeholderTextColor="#5F6A5F"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Sets x Reps (e.g. 3x10)"
              placeholderTextColor="#5F6A5F"
              value={setReps}
              onChangeText={setSetReps}
            />
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
});