import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export function ActivityDropdown({
  label,
  value,
  options,
  onSelect,
  iconName,
}) {
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
          {iconName && (
            <Ionicons name={iconName} size={20} color="#3E5A3C" />
          )}
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
  const [show, setShow] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.field}
        onPress={() => setShow(true)}
      >
        <Ionicons name="calendar-outline" size={20} color="#3E5A3C" />
        <Text style={styles.text}>
          {value.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          onChange={(e, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );
}


export function TimePicker({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.field}
        onPress={() => setShow(true)}
      >
        <Ionicons name="time-outline" size={20} color="#3E5A3C" />
        <Text style={styles.text}>
          {value.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode="time"
          display="spinner"
          is24Hour
          onChange={(e, selectedTime) => {
            setShow(false);
            if (selectedTime) onChange(selectedTime);
          }}
        />
      )}
    </View>
  );
}


export function DurationPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  const format = (num) => num.toString().padStart(2, "0");

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.field}
        onPress={() => setOpen(true)}
      >
        <Ionicons
          name="stopwatch-outline"
          size={20}
          color="#3E5A3C"
        />
        <Text style={styles.text}>
          {`${format(value.hours)}:${format(value.minutes)}:${format(
            value.seconds
          )}`}
        </Text>
      </TouchableOpacity>

      {open && (
        <Modal transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.pickerRow}>
              {[hours, minutes, seconds].map((arr, index) => (
                <ScrollView key={index}>
                  {arr.map((num) => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => {
                        if (index === 0)
                          onChange({ ...value, hours: num });
                        if (index === 1)
                          onChange({ ...value, minutes: num });
                        if (index === 2)
                          onChange({ ...value, seconds: num });
                      }}
                    >
                      <Text style={styles.pickerItem}>
                        {format(num)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ))}
            </View>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setOpen(false)}
            >
              <Text>Done</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
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

  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },

  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  pickerItem: {
    fontSize: 22,
    padding: 10,
    textAlign: "center",
  },

  doneButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 15,
    backgroundColor: "#D8AC7C",
    borderRadius: 10,
  }
});
