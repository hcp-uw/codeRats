import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
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

export default function WorkoutScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [distance, setDistance] = useState("");

  const activityOptions = ["Run", "Walk", "Cycle", "Weight Lift"]

  const handleSaveWorkout = () => {
    const workout = {
      title,
      description,
      activity,
      date,
      time,
      duration,
      distance,
    };

    //TODO: backend - this function is supposed to save the inputted workout data to our databases. 
    console.log("Workout saved:", workout);
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

        {/* Distance */}
        <DistancePicker
          value={distance}
          onChange={setDistance}
        />

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