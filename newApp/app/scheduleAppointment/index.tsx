import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SERVER_URL } from '@/config/config';
import NewPageTemplate from '../newPageTemplate';
import StepProgressBar from './StepProgressBar';

const AppointmentScheduler = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
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

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
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

    try {
      // Format the date properly
      const [hours, minutes] = selectedTime.split(':');
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hours), 0, 0, 0); // Set hours and reset minutes/seconds/ms
      
      // Format date as YYYY-MM-DD HH:mm:ss
      const formattedDate = appointmentDate.toISOString().slice(0, 19).replace('T', ' ');

    const data = {
      name: name.trim(),
      appointment_date: localDateTime,
    };

      console.log('Sending appointment data:', data); // Debug log

      const response = await fetch(`${SERVER_URL}/scheduleAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
            <Text style={styles.title}>Step 1: Choose a Service</Text>
            <Picker
              selectedValue={service}
              onValueChange={(itemValue) => setService(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a service" value="" />
              {services.map((s, index) => (
                <Picker.Item key={index} label={s} value={s} />
              ))}
            </Picker>
            <Button title="Next" onPress={nextStep} disabled={!service} />
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <Text style={styles.title}>Step 2: Select Date and Time</Text>
            <Button title="Select Date" onPress={() => setShow(true)} />
            {show && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
            <Text style={styles.selectedDate}>
              Selected Date: {selectedDate.toLocaleDateString()}
            </Text>

            <Text style={styles.subtitle}>Available Time Slots:</Text>
            <ScrollView style={styles.timeSlotContainer}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.selectedTimeSlot,
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.selectedTimeSlotText
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

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
              <Button title="Confirm" onPress={handleSchedule} />
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
  },
  selectedDate: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
  },
  timeSlotContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  timeSlot: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  selectedTimeSlot: {
    backgroundColor: '#E0BBE4',
    borderColor: '#957DAD',
  },
  timeSlotText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  selectedTimeSlotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default AppointmentScheduler;
