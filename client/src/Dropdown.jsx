import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const activityIcons = {
  Run: "footsteps-outline",
  Cycle: "bicycle-outline",
  Walk: "walk-outline",
  Weights: "body-outline",
};

export function ActivityDropdown({label, value, options, onSelect, iconName}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
        <View style={styles.left}>
          <Ionicons
            name={activityIcons[value] || "fitness-outline"}
            size={20}
            color="#3E5A3C"
          />
          <Text style={styles.text}>
            {value || label}
          </Text>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#3E5A3C"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.optionsContainer}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.text}>{item}</Text>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
}

export function DatePicker({ value, onChange }) {
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.field}
        onPress={() => {
          setTempDate(value);
          setVisible(true);
        }}
      >
        <Ionicons name="calendar-outline" size={20} color="#3E5A3C" />
        <Text style={styles.text}>
          {value.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>

            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              themeVariant="light"
              textColor="#000"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setTempDate(selectedDate);
                }
              }}
              style={{ backgroundColor: "white" }}
            />

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                onChange(tempDate);
                setVisible(false);
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Done
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

export function TimePicker({ value, onChange }) {
  const [visible, setVisible] = useState(false);
  const [tempTime, setTempTime] = useState(value);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.field}
        onPress={() => {
          setTempTime(value);
          setVisible(true);
        }}
      >
        <Ionicons name="time-outline" size={20} color="#3E5A3C" />
        <Text style={styles.text}>
          {value.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>

            <DateTimePicker
              value={tempTime}
              mode="time"
              display="spinner"
              is24Hour
              themeVariant="light"
              textColor="#000"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  setTempTime(selectedTime);
                }
              }}
              style={{ backgroundColor: "white" }}
            />

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                onChange(tempTime);
                setVisible(false);
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Done
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}


export function DurationPicker({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const seconds = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const [h, m, s] = value.split(":");

  const updateValue = (newH, newM, newS) => {
    const formatted = `${newH}:${newM}:${newS}`;
    onChange(formatted);
  };

  return (
    <View style={styles.wrapper}>
      {/* Clickable Field */}
      <TouchableOpacity
        style={styles.field}
        onPress={() => setVisible(true)}
      >
        <Ionicons
            name="stopwatch-outline"
            size={20}
            color="#3E5A3C"
        />
        <Text style={styles.text}>{value}</Text>
      </TouchableOpacity>

      {/* Modal Picker */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerRow}>
              <Picker
                selectedValue={h}
                style={styles.picker}
                itemStyle={{ color: "#000" }}
                onValueChange={(itemValue) =>
                  updateValue(itemValue, m, s)
                }
              >
                {hours.map((hour) => (
                  <Picker.Item key={hour} label={hour} value={hour} color="#000"/>
                ))}
              </Picker>

              <Picker
                selectedValue={m}
                style={styles.picker}
                itemStyle={{ color: "#000" }}
                onValueChange={(itemValue) =>
                  updateValue(h, itemValue, s)
                }
              >
                {minutes.map((minute) => (
                  <Picker.Item key={minute} label={minute} value={minute} color="000"/>
                ))}
              </Picker>

              <Picker
                selectedValue={s}
                style={styles.picker}
                itemStyle={{ color: "#000" }}
                onValueChange={(itemValue) =>
                  updateValue(h, m, itemValue)
                }
              >
                {seconds.map((second) => (
                  <Picker.Item key={second} label={second} value={second} color="000"/>
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setVisible(false)}
            >
              <Text style={{ color: "white" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function DistancePicker({ value, onChange }) {

  return (
    <View style={styles.wrapper}>
      <View style={styles.field}>
        <Ionicons
          name="analytics-outline"
          size={20}
          color="#3E5A3C"
        />
        <TextInput
          style={styles.text}
          keyboardType="numeric"
          placeholder="Distance"
          value={value}
          onChangeText={onChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  dropdown: {
    backgroundColor: "#F5F0E8",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  field: {
    backgroundColor: "#F6F2EA",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 16,
    color: "#5F6A5F",
  },
  optionsContainer: {
    backgroundColor: "#F5F0E8",
    borderRadius: 12,
    marginTop: 5,
    elevation: 3,
  },
  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E0DED8",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  picker: {
    flex: 1,
    color: "#5F6A5F",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  pickerContainer: {
    backgroundColor: "white",
    paddingBottom: 20,
  },
  doneButton: {
    backgroundColor: "#3E5A3C",
    padding: 15,
    alignItems: "center",
  },
});
