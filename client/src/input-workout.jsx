import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddWorkoutScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");

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

    console.log("Workout saved:", workout);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#3E5A3C" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <TextInput
          style={styles.input}
          placeholder="Title your workout"
          placeholderTextColor="#7A7A7A"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor="#7A7A7A"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Activity */}
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="walk-outline" size={20} color="#3E5A3C" />
            <Text style={styles.dropdownText}>{activity}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#3E5A3C" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Activity Stats</Text>

        {/* Date */}
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="calendar-outline" size={20} color="#3E5A3C" />
            <Text style={styles.dropdownText}>{date}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#3E5A3C" />
        </TouchableOpacity>

        {/* Time */}
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="time-outline" size={20} color="#3E5A3C" />
            <Text style={styles.dropdownText}>
              {time || "Time"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#3E5A3C" />
        </TouchableOpacity>

        {/* Duration */}
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="stopwatch-outline" size={20} color="#3E5A3C" />
            <Text style={styles.dropdownText}>
              {duration || "Duration"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#3E5A3C" />
        </TouchableOpacity>

        {/* Distance */}
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="analytics-outline" size={20} color="#3E5A3C" />
            <Text style={styles.dropdownText}>
              {distance || "Distance"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#3E5A3C" />
        </TouchableOpacity>
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
    backgroundColor: "#3E5A3C",
  },

  header: {
    backgroundColor: "#D8AC7C",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  content: {
    padding: 20,
  },

  input: {
    backgroundColor: "#F6F2EA",
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
    backgroundColor: "#F6F2EA",
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
    color: "#3E5A3C",
  },

  sectionTitle: {
    color: "#D8AC7C",
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },

  saveButton: {
    backgroundColor: "#D8AC7C",
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