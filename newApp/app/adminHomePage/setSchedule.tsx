import React, { useEffect, useState } from "react";
import moment from "moment";
import Timetable from "react-native-calendar-timetable";
import { ScrollView, View, Text, Picker, TextInput, Button, Alert } from "react-native";
import { SERVER_URL } from "@/config/config";

// Define the structure of an employee
interface Employee {
  id: string; // Adjust type based on your backend
  name: string;
}

// Define the structure of an event
interface Event {
  title: string;
  startDate: Date; // Use Date for consistency
  endDate: Date;
}

// Main component
export default function App() {
  // State to hold employees
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // Timetable state
  const [items, setItems] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    startDate: string; // Using string for input handling
    endDate: string;
  }>({
    title: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    // Fetch employees from the server
    fetch(`${SERVER_URL}/employee`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: Employee[]) => {
        setEmployees(data);
        if (data.length > 0) {
          setSelectedEmployee(data[0].id); // Default to the first employee
        }
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // Handle adding a new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
      Alert.alert("Error", "Please fill in all fields for the event.");
      return;
    }

    // Add the event to the timetable
    setItems([
      ...items,
      {
        title: newEvent.title,
        startDate: moment(newEvent.startDate).toDate(),
        endDate: moment(newEvent.endDate).toDate(),
      },
    ]);

    // Clear the input fields
    setNewEvent({
      title: "",
      startDate: "",
      endDate: "",
    });
  };

  // Handle submitting the schedule to the database
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

    // Submit the schedule to the server
    fetch(`${SERVER_URL}set-employee-schedule`, {
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

  return (
    <ScrollView>
      {/* Employee Selector */}
      <View style={{ margin: 20 }}>
        <Text>Select Employee:</Text>
        <Picker
          selectedValue={selectedEmployee}
          onValueChange={(value: string) => setSelectedEmployee(value)}
        >
          {employees.map((employee) => (
            <Picker.Item
              key={employee.id}
              label={`${employee.name} (${employee.id})`}
              value={employee.id}
            />
          ))}
        </Picker>
      </View>

      {/* Add Event Form */}
      <View style={{ margin: 20 }}>
        <Text>New Event:</Text>
        <TextInput
          placeholder="Event Title"
          value={newEvent.title}
          onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Start Date (YYYY-MM-DD HH:mm)"
          value={newEvent.startDate}
          onChangeText={(text) => setNewEvent({ ...newEvent, startDate: text })}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 }}
        />
        <TextInput
          placeholder="End Date (YYYY-MM-DD HH:mm)"
          value={newEvent.endDate}
          onChangeText={(text) => setNewEvent({ ...newEvent, endDate: text })}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 }}
        />
        <Button title="Add Event" onPress={handleAddEvent} />
      </View>

      {/* Timetable */}
      <Timetable
        items={items}
        renderItem={(props: Event) => (
          <View>
            <Text>{props.title}</Text>
            <Text>{props.startDate.toString()}</Text>
            <Text>{props.endDate.toString()}</Text>
          </View>
        )}
      />

      {/* Submit Schedule Button */}
      <View style={{ margin: 20 }}>
        <Button title="Submit Schedule" onPress={handleSubmitSchedule} />
      </View>
    </ScrollView>
  );
}
