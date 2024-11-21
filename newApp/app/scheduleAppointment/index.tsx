import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AccountSidebar from '../accountSidebar'; // Adjust the path as needed
import BottomNavBar from '../bottomNavBar'; // Adjust the path as needed

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

    const handleSchedule = () => {
        if (!name) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }
        Alert.alert(
            'Appointment Scheduled',
            `Name: ${name}\nDate: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
        );
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
            <Button title="Pick Time" onPress={() => showMode('time')} />

            {/* DateTimePicker */}
            {show && (
                <DateTimePicker
                    value={date}
                    mode={mode}
                    is24Hour={true}
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
    buttonContainer: {
        marginTop: 20,
    },
});

export default AppointmentScheduler;
