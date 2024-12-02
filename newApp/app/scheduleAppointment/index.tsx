import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SERVER_URL } from '@/config/config';
import NewPageTemplate from '../newPageTemplate';

const AppointmentScheduler = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (mode === 'date') {
        // Update the full date (date + time)
        setDate(selectedDate);
      } else if (mode === 'time') {
        // Only update the time, keeping the existing date
        const newDate = new Date(date);
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
        setDate(newDate);
      }
    }
    setShow(false); // Close the picker
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setMode(currentMode); // Set the mode (date or time)
    setShow(true); // Show the picker
  };

  const handleSchedule = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!date) {
      Alert.alert('Error', 'please select a date and time');
      return;
    }

    const localDateTime = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}T${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:00`;

    const data = {
      name: name.trim(), 
      appointment_date: localDateTime,
    }

    try {
      const response = await fetch(`${SERVER_URL}/scheduleAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        Alert.alert('Success', `Appointment schedualed: ${result.message}`)
      } else {
        const error = await response.json()
        Alert.alert('Error', error.message || 'Failed to schedule appointment')
      }
    } catch (err) {
      console.error('Error scheduling appointment:', err)
      Alert.alert('Error', 'somthing went wrong. Please try again.')
    }
  };

  return (
    <NewPageTemplate title= 'Schedule Appointment'>
      <View style={styles.contentContainer}>


        <Text style={styles.title}>Schedule an Appointment</Text>

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Select Date and Time</Text>

        {/* Button to Pick Date */}
        <View style={styles.button}>
          <Button title="Pick Date" onPress={() => showMode('date')} />
        </View>

        {/* Button to Pick Time */}
        <View style={styles.button}>
          <Button title="Pick Time" onPress={() => showMode('time')} />
        </View>

        {/* DateTimePicker */}
        {show && (
          <DateTimePicker
            value={date}
            mode={mode}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChange}
          />
        )}

        <Text style={styles.label}>Selected Date and Time:</Text>
        <Text style={styles.selectedDate}>{date.toLocaleString()}</Text>

        <View style={styles.button}>
          <Button title="Schedule Appointment" onPress={handleSchedule} />
        </View>
      </View>
    </NewPageTemplate>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginLeft: 5,
    marginTop: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    top: -50,
  },
  button: {
    width: 150,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    resizeMode: 'contain',
    backgroundColor: '#6B4F9B', // Purple color
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
    fontFamily: 'Calibri',
    fontSize: 23,
    //fontWeight: 'bold',
    cursor: 'pointer',
    top: -40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    top: -40,
  },
  selectedDate: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
    top: -40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    top: -35,
    width: 300,
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
});

export default AppointmentScheduler;
