import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import NewPageTemplate from '../newPageTemplate';
import StepProgressBar from './StepProgressBar';
import { SERVER_URL } from '@/config/config';
import { Linking } from 'react-native';


const AppointmentScheduler = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [name, setName] = useState('');
  const [service, setService] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [show, setShow] = useState(false);


  const services = ['Oil Change', 'Tire Rotation', 'Brake Inspection'];

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/get-vehicle-list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const vehicleData = await response.json();
          setVehicles(vehicleData);
        } else {
          const error = await response.json();
          Alert.alert('Error', error.error || 'Failed to fetch vehicle list');
        }
      } catch (err) {
        console.error('Error fetching vehicle list:', err);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDateChange = (event, date) => {
    setShow(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSoonestAvailable = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/getSoonestAppointment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const result = await response.json();
        setSelectedDate(new Date(result.date));
        setSelectedTime(result.time);
        Alert.alert('Success', `Soonest available appointment: ${result.date} ${result.time}`);
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Failed to find soonest appointment');
      }
    } catch (err) {
      console.error('Error getting soonest available appointment:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  

  const handleSchedule = async () => {
    if (!name || !service || !selectedDate || !selectedTime || !vehicle) {
      Alert.alert('Error', 'Please complete all steps before confirming.');
      return;
    }

    try {
      const [hours, minutes] = selectedTime.split(':');
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const formattedDate = appointmentDate.toISOString().slice(0, 19).replace('T', ' ');

      const data = {
        name: name.trim(),
        service,
        appointment_date: formattedDate,
        vehicle,
      };

      const response = await fetch(`${SERVER_URL}/scheduleAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setCurrentStep(6); // Proceed to Step 6 on successful submission
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

  const CustomButton = ({ title, onPress, disabled }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled ? styles.buttonDisabled : styles.buttonEnabled,
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

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
            <CustomButton title="Next" onPress={nextStep} disabled={!name.trim()} />
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <Text style={styles.title}>Step 2: Choose a Service</Text>
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
            <View style={styles.buttonRow}>
              <CustomButton title="Previous" onPress={prevStep} />
              <CustomButton title="Next" onPress={nextStep} disabled={!service} />
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View>
            <Text style={styles.title}>Step 3: Select Date and Time</Text>
            <CustomButton title="Select Date" onPress={() => setShow(true)} />
            {show && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.buttonRow}>
              <CustomButton title="Previous" onPress={prevStep} />
              <CustomButton title="Soonest Available"
              onPress={handleSoonestAvailable} disabled={undefined} />
              <CustomButton
                title="Next"
                onPress={nextStep}
                disabled={!selectedDate || !selectedTime}
              />
            </View>
          </View>
        )}

        {currentStep === 4 && (
          <View>
            <Text style={styles.title}>Step 4: Choose a Vehicle</Text>
            {isLoadingVehicles ? (
              <ActivityIndicator size="large" color="#6B4F9B" />
            ) : (
              <Picker
                selectedValue={vehicle}
                onValueChange={(itemValue) => setVehicle(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a vehicle" value="" />
                {vehicles.map((v, index) => (
                  <Picker.Item
                    key={index}
                    label={`${v.year} ${v.make} ${v.model} (${v.VIN})`}
                    value={v.VIN}
                  />
                ))}
              </Picker>
            )}
            <View style={styles.buttonRow}>
              <CustomButton title="Previous" onPress={prevStep} />
              <CustomButton title="Next" onPress={nextStep} disabled={!vehicle} />
            </View>
          </View>
        )}

        {currentStep === 5 && (
          <View>
            <Text style={styles.title}>Step 5: Confirm Appointment</Text>
            <Text style={styles.label}>Name: {name}</Text>
            <Text style={styles.label}>Service: {service}</Text>
            <Text style={styles.label}>
              Date and Time: {selectedDate.toLocaleDateString()} {selectedTime}
            </Text>
            <Text style={styles.label}>Vehicle: {vehicle}</Text>
            <View style={styles.buttonRow}>
              <CustomButton title="Previous" onPress={prevStep} />
              <CustomButton title="Confirm" onPress={handleSchedule} />
            </View>
          </View>
        )}

        {currentStep === 6 && (
          <View style={[styles.centeredContainer]}>
            <Text style={[styles.title, styles.centeredText]}>Thank You! 😊</Text>
            <Text style={[styles.description, styles.centeredText]}>
              Your appointment has been successfully scheduled! You can check
              its status by clicking "Status" on the Home page of the app.
            </Text>
            <CustomButton title="Finish" onPress={() => Linking.openURL('/userHomePage')} />
          </View>
        )}
      </View>
    </NewPageTemplate>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center',     // Centers content horizontally
    padding: 20,              // Maintains padding for consistency
  },
  
  centeredText: {
    textAlign: 'center',      // Ensures text alignment is centered
  },
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
  picker: {
    width: '100%',
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
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonEnabled: {
    backgroundColor: '#6B4F9B',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default AppointmentScheduler;
