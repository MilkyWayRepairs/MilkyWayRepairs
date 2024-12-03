import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
//import RNPickerSelect from "react-native-picker-select";
//import Timetable from "react-native-calendar-timetable";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { SERVER_URL } from "@/config/config";
//import { CardProps } from 'react-native-paper';

interface Employee {
  id: string;
  name: string;
  schedule: string; // Add schedule as part of the employee object
}
type CardPropsWithEvent = CardProps<any> & {
  title: string;
  startDate: string | Date;
  endDate: string | Date;
};

interface Event {
  title: string;
  startDate: Date;
  endDate: Date;
}

const ManagerSettings = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [items, setItems] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    // Fetch employees with schedules from the server
    fetch(`${SERVER_URL}/get-employee-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: Employee[]) => {
        setEmployees(data);
        if (data.length > 0) {
          setSelectedEmployee(data[0].id);
        }
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
      Alert.alert("Error", "Please fill in all fields for the event.");
      return;
    }

    setItems([
      ...items,
      {
        title: newEvent.title,
        startDate: moment(newEvent.startDate).toDate(),
        endDate: moment(newEvent.endDate).toDate(),
      },
    ]);

    setNewEvent({ title: "", startDate: "", endDate: "" });
  };

  const handleSubmitSchedule = () => {
    if (!selectedEmployee) {
      Alert.alert("Error", "No employee selected.");
      return;
    }

    const schedule = {
      employeeId: selectedEmployee,
      schedule: items.map((item) => ({
        title: item.title,
        startDate: item.startDate.toISOString(),
        endDate: item.endDate.toISOString(),
      })),
    };

    fetch(`${SERVER_URL}/set-employee-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    })
      .then((response) => {
        if (response.ok) {
          Alert.alert("Success", "Schedule submitted successfully.");
        } else {
          throw new Error("Failed to submit schedule.");
        }
      })
      .catch((error) => Alert.alert("Error", error.message));
  };

  const renderEmployee = ({ item }: { item: Employee }) => (
    <View style={styles.row}>
      <Text style={styles.nameColumn}>{item.name}</Text>
      <Text style={styles.scheduleColumn}>{item.schedule}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Manager Settings</Text>
      </View>

      {/* Employee Selector */}
      <View style={styles.dropdown}>
        <Text style={styles.dropdownLabel}>Select Employee:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedEmployee(value)}
          items={employees.map((employee) => ({
            label: employee.name,
            value: employee.id,
          }))}
          style={pickerStyles}
          placeholder={{ label: "Select an employee", value: null }}
          value={selectedEmployee}
        />
      </View>

      {/* Employee List */}
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={renderEmployee}
        style={styles.list}
      />

      {/* Timetable */}
      <Timetable
        items={items}
        renderItem={(event: CardPropsWithEvent) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventText}>{event.title}</Text>
            <Text style={styles.eventText}>{moment(event.startDate).format("YYYY-MM-DD HH:mm")}</Text>
            <Text style={styles.eventText}>{moment(event.endDate).format("YYYY-MM-DD HH:mm")}</Text>
          </View>
        )}
      />

      {/* Add Event Form */}
      <View style={styles.form}>
        <Text>New Event:</Text>
        <TextInput
          style={styles.input}
          placeholder="Event Title"
          value={newEvent.title}
          onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD HH:mm)"
          value={newEvent.startDate}
          onChangeText={(text) => setNewEvent({ ...newEvent, startDate: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD HH:mm)"
          value={newEvent.endDate}
          onChangeText={(text) => setNewEvent({ ...newEvent, endDate: text })}
        />
        <Button title="Add Event" onPress={handleAddEvent} />
      </View>

      {/* Submit Schedule Button */}
      <View style={styles.submitButton}>
        <Button title="Submit Schedule" onPress={handleSubmitSchedule} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  dropdown: {
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  list: {
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  nameColumn: {
    fontSize: 16,
    flex: 1,
  },
  scheduleColumn: {
    fontSize: 16,
    flex: 2,
    textAlign: "right",
  },
  form: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  eventItem: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
    borderRadius: 5,
  },
  eventText: {
    fontSize: 14,
    color: "#333",
  },
  submitButton: {
    marginVertical: 20,
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    backgroundColor: "#fff",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    backgroundColor: "#fff",
    paddingRight: 30,
  },
});

export default ManagerSettings;
