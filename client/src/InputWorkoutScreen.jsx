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
import {useNavigation} from '@react-navigation/native';

export default function WorkoutScreen({ navigation }) {
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

    //to be changed with supabase connection, navigation, validation
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
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="walk-outline" size={20} color="#5F6A5F" />
            <Text style={styles.dropdownText}>{activity}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#5F6A5F" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Activity Stats</Text>

        {/* Date */}
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="calendar-outline" size={20} color="#5F6A5F" />
            <Text style={styles.dropdownText}>{date}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#5F6A5F" />
        </TouchableOpacity>

        {/* Time */}
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="time-outline" size={20} color="#5F6A5F" />
            <Text style={styles.dropdownText}>
              {time || "Time"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#5F6A5F" />
        </TouchableOpacity>

        {/* Duration */}
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="stopwatch-outline" size={20} color="#5F6A5F" />
            <Text style={styles.dropdownText}>
              {duration || "Duration"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#5F6A5F" />
        </TouchableOpacity>

        {/* Distance */}
        <TouchableOpacity style={styles.dropdown}>
          <View style={styles.dropdownLeft}>
            <Ionicons name="analytics-outline" size={20} color="#5F6A5F" />
            <Text style={styles.dropdownText}>
              {distance || "Distance"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#5F6A5F" />
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