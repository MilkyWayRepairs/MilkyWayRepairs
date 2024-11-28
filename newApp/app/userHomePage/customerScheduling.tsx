import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SERVER_URL } from '@/config/config';
import axios from 'axios';

const customerScheduling = () => {
  const [selectedDate, setSelectedDate] = useState(''); // Selected date as a string (YYYY-MM-DD)
  const [availableTimes, setAvailableTimes] = useState([]); // Array of available time slots
  const [showPicker, setShowPicker] = useState(false); // Controls the visibility of the date picker

  // Function to fetch available times
  const fetchAvailableTimes = async (date: Date) => {
    try {
      const response = await axios.get(`${SERVER_URL}/available-times`, {
        params: { date: date.toISOString().split('T')[0] }, // Send only the date part in YYYY-MM-DD format
      });
      setAvailableTimes(response.data.available_times || []);
    } catch (error) {
      console.error('Error fetching available times:', error);
      Alert.alert('Error', 'Failed to fetch available times. Please try again.');
    }
  };

  // Function to render each available time as a button
  const renderTimeItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.timeSlot}>
      <Text style={styles.timeText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select a Date to View Available Times</Text>

      {/* Touchable input for DateTimePicker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={styles.inputText}>
          {selectedDate || 'Select a date'} {/* Show selected date or placeholder */}
        </Text>
      </TouchableOpacity>

      {/* DateTimePicker */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()} // Default to selected or current date
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => {
            setShowPicker(false); // Hide picker after selection
            if (date) {
              setSelectedDate(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
            }
          }}
        />
      )}

      {/* Button to fetch available times */}
      <TouchableOpacity
        style={styles.fetchButton}
        onPress={() => {
          if (selectedDate) {
            fetchAvailableTimes(new Date(selectedDate)); // Fetch available times for the selected date
          } else {
            Alert.alert('Error', 'Please select a date first!');
          }
        }}
      >
        <Text style={styles.fetchButtonText}>Check Availability</Text>
      </TouchableOpacity>

      {/* List of available times */}
      <FlatList
        data={availableTimes}
        renderItem={renderTimeItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.timeList}
        ListEmptyComponent={<Text style={styles.noTimesText}>No available times found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
  },
  inputText: {
    color: '#333',
  },
  fetchButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  fetchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeList: {
    paddingBottom: 20,
  },
  timeSlot: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    textAlign: 'center',
  },
  noTimesText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
});

export default customerScheduling;
