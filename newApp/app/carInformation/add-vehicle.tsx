import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@/config/config';
import { useRouter } from "expo-router";

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
      router.push('/carInformation');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Vehicle</Text>
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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddVehicle;
