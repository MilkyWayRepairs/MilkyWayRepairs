import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SERVER_URL } from '@/config/config';
import NewPageTemplate from '../newPageTemplate';
import StepProgressBar from './StepProgressBar';

const AppointmentScheduler = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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
      Alert.alert('Error', 'Please select a date and time');
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
    };

    try {
      const response = await fetch(`${SERVER_URL}/scheduleAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', `Appointment scheduled: ${result.message}`);
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Failed to schedule appointment');
      }
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <NewPageTemplate title="Schedule Appointment">
      <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <View style={styles.contentContainer}>
        {currentStep === 1 && (
          <View>
            <Text style={styles.title}>Step 1: Enter Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <Button title="Next" onPress={nextStep} disabled={!name.trim()} />
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <Text style={styles.title}>Step 2: Select Date and Time</Text>
            <Button title="Pick Date" onPress={() => showMode('date')} />
            <Button title="Pick Time" onPress={() => showMode('time')} />
            {show && (
              <DateTimePicker
                value={date}
                mode={mode}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChange}
              />
            )}
            <Text style={styles.selectedDate}>
              Selected Date and Time: {date.toLocaleString()}
            </Text>
            <View style={styles.buttonRow}>
              <Button title="Previous" onPress={prevStep} />
              <Button
                title="Next"
                onPress={nextStep}
                disabled={!date}
              />
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View>
            <Text style={styles.title}>Step 3: Confirm Appointment</Text>
            <Text style={styles.label}>Name: {name}</Text>
            <Text style={styles.label}>
              Date and Time: {date.toLocaleString()}
            </Text>
            <View style={styles.buttonRow}>
              <Button title="Previous" onPress={prevStep} />
              <Button
                title="Confirm"
                onPress={handleSchedule}
              />
            </View>
          </View>
        )}
      </View>
    </NewPageTemplate>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  selectedDate: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default AppointmentScheduler;
