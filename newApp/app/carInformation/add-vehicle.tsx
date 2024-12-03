import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@/config/config';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Import for back arrow icon

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    VIN: '',
    make: '',
    model: '',
    year: '',
  });
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddVehicle = async () => {
    try {
      await axios.post(`${SERVER_URL}/add-vehicle`, {
        ...formData,
        status: 0, // Default status
      });
      alert('Vehicle added successfully!');
      router.push('/carInformation'); // Navigate back to the vehicle information page
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/carInformation')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Vehicle</Text>
      </View>
      {/* Form */}
      <TextInput
        style={styles.input}
        placeholder="VIN"
        value={formData.VIN}
        onChangeText={(value) => handleInputChange('VIN', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Make"
        value={formData.make}
        onChangeText={(value) => handleInputChange('make', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Model"
        value={formData.model}
        onChangeText={(value) => handleInputChange('model', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        keyboardType="numeric"
        value={formData.year}
        onChangeText={(value) => handleInputChange('year', value)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
        <Text style={styles.addButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddVehicle;
