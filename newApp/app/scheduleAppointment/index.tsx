import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AccountSidebar from '../accountSidebar'; // Adjust the path as needed
import BottomNavBar from '../bottomNavBar'; // Adjust the path as needed
import { SERVER_URL } from '@/config/config';

const AppointmentScheduler = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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

    const handleAccountPress = () => {
        setIsSidebarVisible(true); // Show the sidebar
    };

    const handleOverlayClose = () => {
        setIsSidebarVisible(false); // Hide the sidebar
    };

    return (
        <View style={styles.container}>
            {/* Account Sidebar */}
            <AccountSidebar isVisible={isSidebarVisible} onClose={handleOverlayClose} />

            {/* Bottom Navigation Bar */}
            <BottomNavBar onAccountPress={handleAccountPress} />

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
            <Button title="Pick Date" onPress={() => showMode('date')} />

            {/* Button to Pick Time */}
            <View style={styles.buttonContainer}>
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

            <View style={styles.buttonContainer}>
                <Button title="Schedule Appointment" onPress={handleSchedule} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    selectedDate: {
        fontSize: 16,
        color: 'blue',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
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
});

export default AppointmentScheduler;
